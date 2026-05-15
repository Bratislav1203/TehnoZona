import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface NadgrupaMapping {
  nadgrupa: string;
  glavna_grupa: string;
}

export interface MappingConfirmRequest {
  nadgrupa: string;
  glavnaGrupa: string;
}

@Injectable({
  providedIn: 'root'
})
export class MappingService {

  private apiUrl = `${environment.apiBaseUrl}api/admin/feeds`;
  private headers = new HttpHeaders({ 'X-Admin-Key': 'tehnozona-admin-2024' });

  constructor(private http: HttpClient) { }

  getUnconfirmed(): Observable<NadgrupaMapping[]> {
    return this.http.get<NadgrupaMapping[]>(`${this.apiUrl}/mapping/unconfirmed`, { headers: this.headers });
  }

  confirmMappings(mappings: MappingConfirmRequest[]): Observable<string> {
    return this.http.post(`${this.apiUrl}/mapping/confirm`, mappings, { headers: this.headers, responseType: 'text' });
  }
}
