import { Component, OnInit } from '@angular/core';
import { GlavnagrupaService } from "../services/glavnagrupa.service";

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.css']
})
export class TabBarComponent implements OnInit {

  showMenu = false;
  glavneGrupe: any[] = [];
  hoveredIndex: number | null = null;

  // Testni podaci za submenu (nadgrupe i grupe)
  submenuData: Record<string, { name: string, items: string[] }[]> = {
    'BATERIJE, PUNJAČI I KABLOVI': [
      { name: 'Baterije', items: ['AA', 'AAA', '9V'] },
      { name: 'Punjači', items: ['Za telefone', 'Za baterije'] },
      { name: 'Kablovi', items: ['USB-C', 'Lightning', 'HDMI'] }
    ],
    'OSTALO I OUTLET': [
      { name: 'Outlet uređaji', items: ['Televizori', 'Telefonija', 'Laptopovi'] },
      { name: 'Ostala oprema', items: ['Adapteri', 'Torbe', 'Dodaci'] }
    ],
    'KANCELARIJSKI I ŠKOLSKI MATERIJAL': [
      { name: 'Papirna galanterija', items: ['Sveske', 'Blokovi', 'Papir A4'] },
      { name: 'Pribor za pisanje', items: ['Olovke', 'Hemijske', 'Markeri'] }
    ],
    'TV, FOTO, AUDIO I VIDEO': [
      { name: 'Televizori', items: ['LG', 'Samsung', 'Sony'] },
      { name: 'Audio uređaji', items: ['Slušalice', 'Zvučnici', 'Soundbar'] },
      { name: 'Foto oprema', items: ['Kamere', 'Stativi', 'Memorijske kartice'] }
    ],
    'SIGURNOSNI I ALARMNI SISTEMI': [
      { name: 'Video nadzor', items: ['Kamere', 'Snimaci', 'Monitori'] },
      { name: 'Alarmni sistemi', items: ['Senzori', 'Kontroleri', 'Sirene'] }
    ],
    'TELEFONI, TABLETI I OPREMA': [
      { name: 'Mobilni telefoni', items: ['Samsung', 'Apple', 'Xiaomi'] },
      { name: 'Tableti', items: ['iPad', 'Galaxy Tab', 'Lenovo'] },
      { name: 'Oprema', items: ['Maske', 'Punjači', 'Slušalice'] }
    ],
    'ALATI I OPREMA ZA RAD': [
      { name: 'Električni alati', items: ['Bušilice', 'Testere', 'Brusilice'] },
      { name: 'Ručni alati', items: ['Šrafcigeri', 'Čekići', 'Ključevi'] },
      { name: 'Zaštitna oprema', items: ['Rukavice', 'Naočare', 'Šlemovi'] }
    ]
  };

  constructor(private glavnaGrupaService: GlavnagrupaService) { }

  ngOnInit(): void {
    this.glavnaGrupaService.getGlavneGrupe(1).subscribe((data) => {
      this.glavneGrupe = data;
      console.log('Glavne grupe:', this.glavneGrupe);
    });
  }

  onMouseEnter(index: number): void {
    this.hoveredIndex = index;
  }

  onMouseLeave(): void {
    this.hoveredIndex = null;
  }

  onTabClick(tab: string): void {
    console.log('Clicked tab:', tab);
  }
}
