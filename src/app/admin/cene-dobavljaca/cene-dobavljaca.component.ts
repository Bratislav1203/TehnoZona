import { Component, OnInit } from '@angular/core';
import { PromenaCene, PromeneCenaOdgovor, PromeneCenaService, PromeneCenaUpit } from '../../services/promene-cena.service';

@Component({
  selector: 'app-cene-dobavljaca',
  templateUrl: './cene-dobavljaca.component.html',
  styleUrls: ['./cene-dobavljaca.component.css']
})
export class CeneDobavljacaComponent implements OnInit {

  readonly dobavljaci = [
    { id: 1, naziv: 'Uspon' }, { id: 2, naziv: 'Linkom' },
    { id: 3, naziv: 'Avtera' }, { id: 4, naziv: 'Spektar' }
  ];

  upit: PromeneCenaUpit = {
    datum: this.danas(),
    minPct: 10,
    minRazlika: 3000,
    uslov: 'ILI',
    dobavljac: null,
    smer: ''
  };

  odgovor: PromeneCenaOdgovor | null = null;
  ucitava = false;
  greska = '';
  prikaziSitne = false;
  pokretanje = false;
  porukaPokretanja = '';

  constructor(private servis: PromeneCenaService) { }

  ngOnInit(): void {
    this.ucitaj();
  }

  ucitaj(): void {
    this.ucitava = true;
    this.greska = '';
    this.servis.getPromene(this.upit).subscribe({
      next: o => {
        this.odgovor = o;
        this.ucitava = false;
      },
      error: e => {
        this.odgovor = null;
        this.ucitava = false;
        this.greska = e?.error?.greska || 'Servis za praćenje cena trenutno nije dostupan.';
      }
    });
  }

  pokreniSada(): void {
    this.pokretanje = true;
    this.porukaPokretanja = '';
    this.servis.pokreni().subscribe({
      next: r => {
        this.pokretanje = false;
        this.porukaPokretanja = (r?.poruka || 'Pokrenuto') + ' — rezultati će biti vidljivi za par minuta.';
      },
      error: e => {
        this.pokretanje = false;
        this.porukaPokretanja = e?.error?.poruka || e?.error?.greska || 'Pokretanje nije uspelo.';
      }
    });
  }

  promeniDan(pomak: number): void {
    const d = new Date((this.upit.datum || this.danas()) + 'T00:00:00');
    d.setDate(d.getDate() + pomak);
    this.upit.datum = d.toLocaleDateString('sv-SE');
    this.ucitaj();
  }

  get znatne(): PromenaCene[] {
    return this.odgovor?.znatne || this.odgovor?.promene || [];
  }

  get sitne(): PromenaCene[] {
    return this.odgovor?.sitne || [];
  }

  get klasifikovano(): boolean {
    return !!this.odgovor?.znatne;
  }

  nazivDobavljaca(id: number): string {
    return this.dobavljaci.find(d => d.id === id)?.naziv || String(id);
  }

  private danas(): string {
    return new Date().toLocaleDateString('sv-SE');
  }
}
