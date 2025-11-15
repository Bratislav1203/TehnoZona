import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FeaturedAddRequest {
  barcode: string;
  featureType: string;
  priority?: number;
  validFrom?: string;
  validTo?: string;
}

export interface FeaturedArtikalResponse {
  id: number;
  barcode: string;
  vendorId: number;
  featureType: string;
  priority: number;
  validFrom: string;
  validTo: string;
  naziv: string;
  slika: string;
  cena: number;
}

@Injectable({
  providedIn: 'root'
})
export class FeaturedService {

  private apiUrl = `${environment.apiBaseUrl}api/vendors`;

  constructor(private http: HttpClient) {}

  // 🟩 ADD FEATURED PRODUCT
  addFeatured(vendorId: number, req: FeaturedAddRequest): Observable<any> {

    let params = new HttpParams()
      .set('barcode', req.barcode)
      .set('featureType', req.featureType);

    if (req.priority !== undefined && req.priority !== null) {
      params = params.set('priority', String(req.priority));
    }

    if (req.validFrom) {
      params = params.set('validFrom', req.validFrom);
    }

    if (req.validTo) {
      params = params.set('validTo', req.validTo);
    }

    const url = `${this.apiUrl}/${vendorId}/featured`;
    return this.http.post(url, null, { params });
  }

  // 🟦 GET ALL FEATURED (active)
  getAllFeatured(): Observable<FeaturedArtikalResponse[]> {
    return this.http.get<FeaturedArtikalResponse[]>(`${this.apiUrl}/featured/all`);
  }

  // 🟧 GET BY TYPE
  getFeaturedByType(type: string): Observable<FeaturedArtikalResponse[]> {
    const params = new HttpParams().set('type', type);
    return this.http.get<FeaturedArtikalResponse[]>(`${this.apiUrl}/featured`, { params });
  }
// 🟥 DELETE FEATURED PRODUCT
  deleteFeatured(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/featured/${id}`);
  }

}
