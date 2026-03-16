import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  formatirajNaziv(naziv: string): string {
    return naziv.charAt(0).toUpperCase() + naziv.slice(1).toLowerCase();
  }

  formatirajNazivGrupe(naziv: string): string {
    if (!naziv) return '';
    // Uzmi samo deo posle poslednje kose crte
    const parts = naziv.split('\\');
    const lastPart = parts[parts.length - 1];
    return this.formatirajNaziv(lastPart.trim());
  }
}
