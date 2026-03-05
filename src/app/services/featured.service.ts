import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type FeatureType = 'TOP' | 'SALE' | 'NEW' | 'RECOMMENDED';

export interface FeaturedAddRequest {
  barcode: string;
  featureType: FeatureType;
  priority?: number;
  validFrom?: string;
  validTo?: string;
}

export interface FeaturedResponseItem {
  artikal: {
    barcode: string;
    naziv: string;
    slike: string[];
    webCena: number;
    mpcena: number;
    glavnaGrupa: string;
    nadgrupa: string;
    grupa: string;
    proizvodjac: string;
  };
  featured: {
    id: number;
    barcode: string;
    vendorId: number;
    featureType: FeatureType;
    priority: number;
    validFrom: string;
    validTo: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class FeaturedService {

  private apiUrl = `${environment.apiBaseUrl}api/vendors`;

  constructor(private http: HttpClient) { }

  // 🟩 ADMIN – ADD FEATURED
  addFeatured(vendorId: number, req: FeaturedAddRequest): Observable<void> {
    let params = new HttpParams()
      .set('barcode', req.barcode)
      .set('featureType', req.featureType);

    if (req.priority !== undefined) {
      params = params.set('priority', req.priority.toString());
    }

    if (req.validFrom) {
      params = params.set('validFrom', req.validFrom);
    }

    if (req.validTo) {
      params = params.set('validTo', req.validTo);
    }

    return this.http.post<void>(
      `${this.apiUrl}/${vendorId}/featured`,
      null,
      { params }
    );
  }

  // 🟦 HOME – GET ALL FEATURED
  getAllFeatured(): Observable<FeaturedResponseItem[]> {
    return this.http.get<FeaturedResponseItem[]>(
      `${this.apiUrl}/featured/all`
    );
  }

  // 🟥 ADMIN – DELETE
  deleteFeatured(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/featured/${id}`
    );
  }
}
