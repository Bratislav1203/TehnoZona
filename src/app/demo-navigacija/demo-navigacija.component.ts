import { Component, OnInit } from '@angular/core';

interface SubGroup {
  name: string;
  items: string[];
}

interface MainGroup {
  name: string;
  subgroups: SubGroup[];
}

@Component({
  selector: 'app-demo-navigacija',
  templateUrl: './demo-navigacija.component.html',
  styleUrls: ['./demo-navigacija.component.css']
})
export class DemoNavigacijaComponent implements OnInit {

  showPanel = false;
  activeMain: MainGroup | null = null;
  activeSub: SubGroup | null = null;

  private hideTimeout: any;

  // Cist dummy data koncept
  mockData: MainGroup[] = [
    {
      name: 'Računari & Komponente',
      subgroups: [
        { name: 'Laptopovi', items: ['Poslovni', 'Gaming', 'Ultrabook', 'MacBook'] },
        { name: 'Desktop Računari', items: ['Gotove konfiguracije', 'All-In-One', 'Serveri'] },
        { name: 'Komponente', items: ['Procesori', 'Grafičke karte', 'RAM memorija', 'Matične ploče', 'Napajanja', 'Kućišta'] },
        { name: 'Periferije', items: ['Miševi', 'Tastature', 'Monitori', 'Slušalice'] }
      ]
    },
    {
      name: 'Mobilni telefoni & Oprema',
      subgroups: [
        { name: 'Telefoni', items: ['Android', 'iPhone', 'Na preklop', 'Classic'] },
        { name: 'Oprema', items: ['Maske', 'Stakla', 'Punjači', 'Kablovi', 'Powerbank', 'Držači za auto'] },
        { name: 'Pametni satovi', items: ['Smartwatch', 'Fitness narukvice', 'Dečiji satovi'] }
      ]
    },
    {
      name: 'Bela Tehnika i Kuhinja',
      subgroups: [
        { name: 'Rashladni uređaji', items: ['Frižideri', 'Zamrzivači', 'Vinske vitrine'] },
        { name: 'Pranje i sušenje', items: ['Veš mašine', 'Mašine za sušenje', 'Kombinovane', 'Mašine za sudove'] },
        { name: 'Priprema hrane', items: ['Šporeti', 'Ugradne rerne', 'Ploče', 'Mikrotalasne'] },
        { name: 'Mali kućni aparati', items: ['Usisivači', 'Aparati za kafu', 'Blenderi', 'Pegle', 'Sokovnici'] }
      ]
    },
    {
      name: 'Televizori & Audio',
      subgroups: [
        { name: 'Televizori', items: ['OLED', 'QLED', 'LED', 'Smart TV'] },
        { name: 'Oprema za TV', items: ['Nosači', 'Kablovi', 'Daljinski', 'Android Box'] },
        { name: 'Audio tehnika', items: ['Soundbar', 'Bluetooth zvučnici', 'Pojačala', 'Slušalice', 'Kućni bioskop'] }
      ]
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  openPanel(): void {
    clearTimeout(this.hideTimeout);
    this.showPanel = true;
    if (!this.activeMain && this.mockData.length > 0) {
      this.selectMain(this.mockData[0]);
    }
  }

  closePanel(): void {
    this.hideTimeout = setTimeout(() => {
      this.showPanel = false;
    }, 250);
  }

  onPanelEnter(): void {
    clearTimeout(this.hideTimeout);
  }

  onPanelLeave(): void {
    this.closePanel();
  }

  selectMain(group: MainGroup): void {
    this.activeMain = group;
    if (group.subgroups.length > 0) {
      this.selectSub(group.subgroups[0]);
    } else {
      this.activeSub = null;
    }
  }

  selectSub(sub: SubGroup): void {
    this.activeSub = sub;
  }

}
