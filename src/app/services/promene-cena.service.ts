import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PromenaCene {
  vendorId: number;
  dobavljac: string;
  sifra: string;
  barkod: string;
  naziv: string;
  proizvodjac: string;
  smer: 'POJEFTINJENJE' | 'POSKUPLJENJE';
  staraB2b: number;
  novaB2b: number;
  razlika: number;
  razlikaPct: number;
  staraMp: number;
  novaMp: number;
  vracen: boolean;
}

export interface PromeneCenaOdgovor {
  datum: string;
  kriterijum: { minPct: number | null; minRazlika: number | null; uslov: 'I' | 'ILI' };
  ukupno: number;
  // bez praga:
  promene?: PromenaCene[];
  // sa pragom:
  brojZnatnih?: number;
  brojSitnih?: number;
  znatne?: PromenaCene[];
  sitne?: PromenaCene[];
}

export interface PromeneCenaUpit {
  datum?: string;
  minPct?: number | null;
  minRazlika?: number | null;
  uslov?: 'I' | 'ILI';
  dobavljac?: number | null;
  smer?: '' | 'dole' | 'gore';
}

/** Promene B2B cena dobavljača — preko TehnoZonaBackend (/api/admin/promene-cena) ka servisu TehnoZonaCene. */
@Injectable({ providedIn: 'root' })
export class PromeneCenaService {

  private apiUrl = `${environment.apiBaseUrl}api/admin/promene-cena`;
  // isti admin ključ kao u ostalim admin servisima (zameniti kada se uvede pravi admin login)
  private headers = new HttpHeaders({ 'X-Admin-Key': 'tehnozona-admin-2024' });

  constructor(private http: HttpClient) { }

  getPromene(upit: PromeneCenaUpit): Observable<PromeneCenaOdgovor> {
    let params = new HttpParams();
    Object.keys(upit).forEach(k => {
      const v = (upit as any)[k];
      if (v !== null && v !== undefined && v !== '') {
        params = params.set(k, String(v));
      }
    });
    return this.http.get<PromeneCenaOdgovor>(this.apiUrl, { headers: this.headers, params });
  }

  /** Ručno pokreće današnje poređenje (inače ga pokreće cron svako jutro u 06:00). */
  pokreni(): Observable<{ pokrenuto: boolean; poruka: string }> {
    return this.http.post<{ pokrenuto: boolean; poruka: string }>(`${this.apiUrl}/pokreni`, null, { headers: this.headers });
  }
}
