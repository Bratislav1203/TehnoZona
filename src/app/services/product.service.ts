import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiBaseUrl}api/vendors`;

  currentProduct: Product;
  constructor(private http: HttpClient) { }

  getProductByBarcode(vendorId: number, barcode: string): Observable<any> {
    const url = `${this.apiUrl}/${vendorId}/artikal/${barcode}`;
    return this.http.get<Product>(url);
  }

  getProductsFiltered(
    vendorId: number,
    glavnaGrupa?: string,
    nadgrupa?: string,
    grupa?: string,
    page: number = 0,
    size: number = 20,
    minCena?: number,
    maxCena?: number,
    proizvodjaci?: string[],
    sort?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (glavnaGrupa) params = params.set('glavnaGrupa', glavnaGrupa);
    if (nadgrupa) params = params.set('nadgrupa', nadgrupa);
    if (grupa) params = params.set('grupa', grupa);

    if (minCena !== undefined && minCena !== null && minCena !== 0) {
      params = params.set('minCena', minCena.toString());
    }
    if (maxCena !== undefined && maxCena !== null && maxCena !== 0) {
      params = params.set('maxCena', maxCena.toString());
    }
    if (proizvodjaci && proizvodjaci.length > 0) {
      proizvodjaci.forEach(p => {
        params = params.append('proizvodjaci', p);
      });
      params = params.set('proizvodjaciCsv', proizvodjaci.join(','));
    }
    if (sort) {
      params = params.set('sort', sort);
    }

    const url = `${this.apiUrl}/${vendorId}/artikli-paginated`;
    return this.http.get<any>(url, { params });
  }

  getProductsFromCategory(
    vendorId: number,
    glavnaGrupa: string,
    page: number = 0,
    size: number = 10,
    minCena?: number,
    maxCena?: number,
    proizvodjaci?: string[],
    sort?: string
  ): Observable<any> {
    return this.getProductsFiltered(vendorId, glavnaGrupa, undefined, undefined, page, size, minCena, maxCena, proizvodjaci, sort);
  }

  getProductsFromNadgrupa(
    vendorId: number,
    glavnaGrupa: string,
    nadgrupa: string,
    page: number = 0,
    size: number = 20,
    minCena?: number,
    maxCena?: number,
    proizvodjaci?: string[],
    sort?: string
  ): Observable<any> {
    return this.getProductsFiltered(vendorId, glavnaGrupa, nadgrupa, undefined, page, size, minCena, maxCena, proizvodjaci, sort);
  }

  getProductsFromGrupa(
    vendorId: number,
    glavnaGrupa: string,
    nadgrupa: string,
    grupa: string,
    page: number = 0,
    size: number = 20,
    minCena?: number,
    maxCena?: number,
    proizvodjaci?: string[],
    sort?: string
  ): Observable<any> {
    return this.getProductsFiltered(vendorId, glavnaGrupa, nadgrupa, grupa, page, size, minCena, maxCena, proizvodjaci, sort);
  }

  setCurrentProduct(product: Product) {
    this.currentProduct = product;
  }

  getCurrentProduct() {
    return this.currentProduct;
  }

  getProizvodjaciCount(
    vendorId: number,
    glavnaGrupa: string,
    nadgrupe?: string[],
    minCena?: number,
    maxCena?: number,
    grupa?: string
  ): Observable<{ [key: string]: number }> {
    let params = new HttpParams();

    if (nadgrupe && nadgrupe.length > 0) {
      nadgrupe.forEach(n => {
        params = params.append('nadgrupe', n);
      });
    }

    if (minCena !== undefined && minCena !== null && minCena !== 0) {
      params = params.set('minCena', minCena.toString());
    }
    if (maxCena !== undefined && maxCena !== null && maxCena !== 0) {
      params = params.set('maxCena', maxCena.toString());
    }

    params = params.append('grupa', grupa);

    return this.http.get<{ [key: string]: number }>(
      `${this.apiUrl}/${vendorId}/glavnaGrupa/${encodeURIComponent(glavnaGrupa)}/proizvodjaci-count`,
      { params }
    );
  }

  private nadgrupeCache = new Map<string, NadgrupaExtended[]>();

  getNadgrupeExtendedZaGrupu(glavnaGrupa: string): Observable<NadgrupaExtended[]> {
    if (this.nadgrupeCache.has(glavnaGrupa)) {
      return of(this.nadgrupeCache.get(glavnaGrupa));
    }
    const encodedGrupa = encodeURIComponent(glavnaGrupa);
    const url = `${this.apiUrl}/glavneGrupe/${encodedGrupa}/nadgrupe-extended`;
    return this.http.get<NadgrupaExtended[]>(url).pipe(
      tap(data => this.nadgrupeCache.set(glavnaGrupa, data))
    );
  }
  getGlavniProizvodjaci() {
    return this.http.get<string[]>(`${this.apiUrl}/glavni-proizvodjaci`);
  }

  getProductsByBrand(
    vendorId: number,
    brand: string,
    page: number = 0,
    size: number = 20,
    minCena?: number,
    maxCena?: number,
    sort?: string
  ): Observable<any> {
    const encodedBrand = encodeURIComponent(brand);
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (minCena !== undefined && minCena !== null && minCena !== 0) {
      params = params.set('minCena', minCena.toString());
    }
    if (maxCena !== undefined && maxCena !== null && maxCena !== 0) {
      params = params.set('maxCena', maxCena.toString());
    }
    if (sort) {
      params = params.set('sort', sort);
    }

    const url = `${this.apiUrl}/${vendorId}/artikli/brand/${encodedBrand}`;
    return this.http.get<any>(url, { params });
  }

  searchProducts(
    vendorId: number,
    query: string,
    page: number = 0,
    size: number = 20,
    minCena?: number,
    maxCena?: number,
    proizvodjaci?: string[],
    sort?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('size', size.toString());

    if (minCena !== undefined && minCena !== null && minCena !== 0) {
      params = params.set('minCena', minCena.toString());
    }
    if (maxCena !== undefined && maxCena !== null && maxCena !== 0) {
      params = params.set('maxCena', maxCena.toString());
    }
    if (proizvodjaci && proizvodjaci.length > 0) {
      proizvodjaci.forEach(p => {
        params = params.append('proizvodjaci', p);
      });
      params = params.set('proizvodjaciCsv', proizvodjaci.join(','));
    }
    if (sort) {
      params = params.set('sort', sort);
    }

    const url = `${this.apiUrl}/${vendorId}/search`;
    return this.http.get<any>(url, { params });
  }

}

export interface Product {
  vendorId?: number;
  sifra: string;
  barkod: string;
  naziv: string;
  pdv: number;
  nadgrupa: string;
  grupa: string;
  proizvodjac: string;
  jedinicaMere: string;
  model: string;
  kolicina: string;
  b2bcena: number;
  valuta: string;
  flagAkcijskaCena: number;
  webCena: number;
  mpcena: number;
  energetskaKlasa: string;
  energetskaKlasaLink: string;
  energetskaKlasaPdf: string;
  deklaracija: string;
  opis: string;
  slike: string[];
  filteri: FilterGroup[];
  cartKolicina?: number;
}

export interface FilterGroup {
  ime: string | null;
  filter: Filter[];
}

export interface Filter {
  ime: string | null;
  vrednost: string;
}

export interface FilterCategory {
  category: string;
  types: FilterType[];
}

export interface FilterType {
  name: string;
  quantity: number;
}

export interface nameAndImage {
  name: string;
  imgUrl: string;
  fallbackUrl?: string; // 👈 added
}
export interface NadgrupaExtended {
  name: string;
  image: string;
  grupe: string[];
}
