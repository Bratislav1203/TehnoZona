import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl  = `${environment.apiBaseUrl}api/vendors`;

  currentProduct: Product;
  constructor(private http: HttpClient) {}

  getProductByBarcode(vendorId: number, barcode: string): Observable<any> {
    const url = `${this.apiUrl}/${vendorId}/artikal/${barcode}`;
    return this.http.get<Product>(url);
  }

  getProductsFromCategory(
    vendorId: number,
    glavnaGrupa: string,
    page: number = 0,
    size: number = 10,
    minCena?: number,
    maxCena?: number,
    proizvodjaci?: string[]
  ): Observable<any> {
    const encodedGrupa = encodeURIComponent(glavnaGrupa);
    let params = new HttpParams()
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
    }

    const url = `${this.apiUrl}/1/glavnaGrupa/${encodedGrupa}/artikli`;
    return this.http.get<{ products: Product[], totalCount: number, minCena: number, maxCena: number }>(url, { params });
  }

  getProductsFromNadgrupa(
    vendorId: number,
    glavnaGrupa: string,
    nadgrupa: string,
    page: number = 0,
    size: number = 20,
    minCena?: number,
    maxCena?: number,
    proizvodjaci?: string[] // dodatni parametar
  ): Observable<any> {
    const encodedGlavnaGrupa = encodeURIComponent(glavnaGrupa);
    const encodedNadgrupa = encodeURIComponent(nadgrupa);

    const url = `${this.apiUrl}/1/glavnaGrupa/${encodedGlavnaGrupa}/nadgrupa/${encodedNadgrupa}/artikli`;

    let params = new HttpParams()
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
    }
    return this.http.get<Product[]>(url, { params });
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
    proizvodjaci?: string[]
  ): Observable<any> {
    const encodedGlavnaGrupa = encodeURIComponent(glavnaGrupa);
    const encodedNadgrupa = encodeURIComponent(nadgrupa);
    const encodedGrupa = encodeURIComponent(grupa);

    const url = `${this.apiUrl}/${vendorId}/glavnaGrupa/${encodedGlavnaGrupa}/nadgrupa/${encodedNadgrupa}/grupa/${encodedGrupa}/artikli`;

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (minCena !== undefined && minCena !== null) {
      params = params.set('minCena', minCena.toString());
    }

    if (maxCena !== undefined && maxCena !== null) {
      params = params.set('maxCena', maxCena.toString());
    }

    if (proizvodjaci && proizvodjaci.length > 0) {
      proizvodjaci.forEach(p => {
        params = params.append('proizvodjaci', p);
      });
    }

    return this.http.get<Product[]>(url, { params });
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
      `${this.apiUrl}/1/glavnaGrupa/${encodeURIComponent(glavnaGrupa)}/proizvodjaci-count`,
      { params }
    );
  }

  getNadgrupeZaGrupu(glavnaGrupa: string) {
    const encodedGrupa = encodeURIComponent(glavnaGrupa);
    const url = `${this.apiUrl}/glavneGrupe/${encodedGrupa}/nadgrupe`;
    return this.http.get<string[]>(url);
  }
  getGlavniProizvodjaci() {
    return this.http.get<string[]>(`${this.apiUrl}/glavni-proizvodjaci`);
  }

  getProductsByBrand(vendorId: number, brand: string): Observable<any> {
    const encodedBrand = encodeURIComponent(brand);
    const url = `${this.apiUrl}/${vendorId}/artikli/brand/${encodedBrand}`;
    return this.http.get<Product[]>(url);
  }

}

export interface Product {
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
}
