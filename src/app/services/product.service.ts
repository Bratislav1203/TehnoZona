import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrlArtikli = 'http://localhost:8080/api/vendors/artikli';
  private apiUrl = 'http://localhost:8080/api/vendors';

  currentProduct: Product;
  constructor(private http: HttpClient) {}

  getProducts(vendorId: number, limit: number): Observable<Product[]> {
    const params = new HttpParams()
      .set('vendorId', vendorId.toString())
      .set('limit', limit.toString());

    return this.http.get<Product[]>(this.apiUrlArtikli, { params });
  }

  getProductsFromCategory(vendorId: number, limit: number, category: string): Observable<Product[]> {
    const params = new HttpParams()
      .set('vendorId', vendorId.toString())
      .set('limit', limit.toString());

    return this.http.get<Product[]>(this.apiUrlArtikli, { params });
  }

  getProductsFromNadgrupa(vendorId: number, glavnaGrupa: string, nadgrupa: string, limit: number): Observable<Product[]> {
    const url = `http://localhost:8080/api/vendors/${vendorId}/glavnaGrupa/${glavnaGrupa}/nadgrupa/${nadgrupa}/artikli`;
    const params = new HttpParams().set('limit', limit.toString());

    return this.http.get<Product[]>(url, { params });
  }

  setCurrentProduct(product: Product) {
    this.currentProduct = product;
  }

  getCurrentProduct() {
    return this.currentProduct;
  }

  getProizvodjaciCount(vendorId: number, glavnaGrupa: string): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/${vendorId}/glavnaGrupa/${glavnaGrupa}/proizvodjaci-count`);
  }
  getProizvodjaciCountNadgrupaWithPrice(vendorId: number, glavnaGrupa: string, minCena: number, maxCena: number): Observable<{ [key: string]: number }> {
    //
    //OVO TRENUTNO RADI ZA GLAVNU GRUPU!!!!!!
    //
    const encodedGlavnaGrupa = encodeURIComponent(glavnaGrupa);
    let params = new HttpParams()
      .set('minCena', minCena.toString())
      .set('maxCena', maxCena.toString());

    const url = `${this.apiUrl}/${vendorId}/glavnaGrupa/${encodedGlavnaGrupa}/proizvodjaci-count`;

    return this.http.get<{ [key: string]: number }>(url, { params });

  }
  getProductsFromNadgrupaWithPrice(vendorId: number, glavnaGrupa: string, nadgrupa: string, minCena: number, maxCena: number): Observable<Product[]> {
    const encodedGlavnaGrupa = encodeURIComponent(glavnaGrupa);
    const encodedNadgrupa = encodeURIComponent(nadgrupa);

    const url = `${this.apiUrl}/${vendorId}/glavnaGrupa/${encodedGlavnaGrupa}/nadgrupa/${encodedNadgrupa}/artikli`;

    const params = new HttpParams()
      .set('minCena', minCena.toString())
      .set('maxCena', maxCena.toString());
    console.log(params);
    return this.http.get<Product[]>(url, { params });
  }
  getNadgrupeZaGrupu(glavnaGrupa: string) {
    const encodedGrupa = encodeURIComponent(glavnaGrupa);
    const url = `${this.apiUrl}/glavneGrupe/${encodedGrupa}/nadgrupe`;
    return this.http.get<string[]>(url);
  }
  getGlavniProizvodjaci() {
    return this.http.get<string[]>(`${this.apiUrl}/glavni-proizvodjaci`);
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
