import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/vendors/artikli';

  currentProduct: Product;
  constructor(private http: HttpClient) {}
  getProducts(vendorId: number, limit: number): Observable<Product[]> {
    const params = new HttpParams()
      .set('vendorId', vendorId.toString())
      .set('limit', limit.toString());

    return this.http.get<Product[]>(this.apiUrl, { params });
  }

  setCurrentProduct(product: Product) {
    this.currentProduct = product;
  }

  getCurrentProduct() {
    return this.currentProduct;
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

export interface MenuItem {
  title: string;
  subcategories: { name: string; items: string[] }[];
}

