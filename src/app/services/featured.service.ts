import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type ItemType = 'PRODUCT' | 'CATEGORY' | 'BRAND' | 'BANNER' | 'PROMO';
export type HomepageSection = 'TOP' | 'SALE' | 'RECOMMENDED' | 'NEW' | 'HERO' | 'NEWS';

export interface HomepageItemRequest {
  itemType: ItemType;
  section: HomepageSection;
  priority?: number;
  validFrom?: string;
  validTo?: string;
  barcode?: string;
  glavnaGrupa?: string;
  nadgrupa?: string;
  grupa?: string;
  brandName?: string;
  customName?: string;
  customImageUrl?: string;
  subtitle?: string;
  buttonText?: string;
  buttonRoute?: string;
}

export interface HomepageItem {
  id: number;
  vendorId: number;
  itemType: ItemType;
  section: HomepageSection;
  priority: number;
  validFrom: string;
  validTo: string;
  // Opciona polja
  barcode?: string;
  glavnaGrupa?: string;
  nadgrupa?: string;
  grupa?: string;
  brandName?: string;
  customName?: string;
  customImageUrl?: string;
  subtitle?: string;
  buttonText?: string;
  buttonRoute?: string;
}

export interface HomepageItemResponse {
  homepageItem: HomepageItem;
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
  } | null;
}

@Injectable({
  providedIn: 'root'
})
export class FeaturedService {

  private apiUrl = `${environment.apiBaseUrl}api/vendors`;

  constructor(private http: HttpClient) { }

  // 🟩 ADMIN – ADD HOMEPAGE ITEM
  addHomepageItem(vendorId: number, req: HomepageItemRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${vendorId}/homepage-items`, req);
  }

  // 🟦 HOME – GET ALL HOMEPAGE ITEMS
  getAllHomepageItems(): Observable<HomepageItemResponse[]> {
    return this.http.get<HomepageItemResponse[]>(`${this.apiUrl}/homepage-items/all?vendorId=1`);
  }

  // 🟥 ADMIN – DELETE
  deleteHomepageItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/homepage-items/${id}`);
  }
}
