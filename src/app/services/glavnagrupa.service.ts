import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Product } from "./product.service";

@Injectable({
  providedIn: 'root'
})
export class GlavnagrupaService {
  private baseApiUrl = 'http://localhost:8080/api/vendors';

  constructor(private http: HttpClient) {}

  // Dobijanje svih glavnih grupa
  getGlavneGrupe(vendorId: number): Observable<Product[]> {
    const url = `${this.baseApiUrl}/glavneGrupe`;
    return this.http.get<Product[]>(url);
  }

  // Dobijanje nadgrupa za određenu glavnu grupu
  getNadgrupe(vendorId: number, glavnaGrupa: string): Observable<Product[]> {
    const url = `${this.baseApiUrl}/${vendorId}/nadgrupe`;
    const params = new HttpParams().set('glavnaGrupa', glavnaGrupa);
    return this.http.get<Product[]>(url, { params });
  }

  // Dobijanje grupa za određenu glavnu grupu i nadgrupu
  getGrupe(vendorId: number, glavnaGrupa: string, nadGrupa: string): Observable<Product[]> {
    const url = `${this.baseApiUrl}/${vendorId}/grupe`;
    const params = new HttpParams()
      .set('glavnaGrupa', glavnaGrupa)
      .set('nadGrupa', nadGrupa);
    return this.http.get<Product[]>(url, { params });
  }

  // Dobijanje nadgrupa i grupa za glavnu grupu
  getNadgrupeiGrupe(vendorId: number): Observable<Record<string, string[]>> {
    const url = `${this.baseApiUrl}/${vendorId}/glavne_grupe_i_nadgrupe`;
    return this.http.get<Record<string, string[]>>(url);
  }
}
