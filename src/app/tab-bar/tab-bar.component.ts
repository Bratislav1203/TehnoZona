import { Component, HostListener, OnInit } from '@angular/core';
import { GlavnagrupaService } from '../services/glavnagrupa.service';
import { GlavnaGrupa, MockGlavnaGrupaService } from '../services/mock-glavna-grupa.service';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.css']
})
export class TabBarComponent implements OnInit {

  showMenu = false;
  hoveredIndex: number | null = null;
  glavneGrupeSaNadgrupamaIGrupama: GlavnaGrupa[] = [];
  glavneGrupeSaNadgrupamaIGrupamaUziSkup: GlavnaGrupa[] = [];

  private hoverTimeout: any;
  private menuTimeout: any;

  constructor(
    private glavnaGrupaService: GlavnagrupaService,
    private mockGlavnaGrupaService: MockGlavnaGrupaService,
    public utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.glavneGrupeSaNadgrupamaIGrupama = this.mockGlavnaGrupaService.getAllGlavneGrupe().filter(grupa =>
      grupa.name !== 'SIGURNOSNI I ALARMNI SISTEMI' &&
      grupa.name !== 'KANCELARIJSKI I ŠKOLSKI MATERIJAL' &&
      grupa.name !== 'OSTALO I OUTLET'
    );

    this.updateVisibleTabs();
  }

  /** 👇 sluša promenu širine prozora i automatski menja broj tabova */
  @HostListener('window:resize')
  onResize() {
    this.updateVisibleTabs();
  }

  /** određuje koliko glavnih grupa prikazati na osnovu širine ekrana */
  private updateVisibleTabs(): void {
    const width = window.innerWidth;

    if (width >= 1400) {
      this.glavneGrupeSaNadgrupamaIGrupamaUziSkup = this.glavneGrupeSaNadgrupamaIGrupama.slice(0, 8);
    } else if (width >= 1200) {
      this.glavneGrupeSaNadgrupamaIGrupamaUziSkup = this.glavneGrupeSaNadgrupamaIGrupama.slice(0, 6);
    } else if (width >= 992) {
      this.glavneGrupeSaNadgrupamaIGrupamaUziSkup = this.glavneGrupeSaNadgrupamaIGrupama.slice(0, 5);
    } else if (width >= 768) {
      this.glavneGrupeSaNadgrupamaIGrupamaUziSkup = this.glavneGrupeSaNadgrupamaIGrupama.slice(0, 3);
    } else {
      this.glavneGrupeSaNadgrupamaIGrupamaUziSkup = []; // mobilni prikaz – ne prikazuj glavne tabove
    }
  }

  // hover logika
  onMouseEnter(index: number): void {
    clearTimeout(this.hoverTimeout);
    this.hoveredIndex = index;
  }

  onMouseLeave(): void {
    this.hoverTimeout = setTimeout(() => {
      this.hoveredIndex = null;
    }, 250);
  }

  // "Sve kategorije" meni
  openMenu(): void {
    clearTimeout(this.menuTimeout);
    this.showMenu = true;
  }

  closeMenu(): void {
    this.menuTimeout = setTimeout(() => {
      this.showMenu = false;
    }, 250);
  }

  forceCloseMenu(): void {
    this.showMenu = false;
  }

  onTabClick(tab: string): void {
    console.log('Kliknut tab:', tab);
  }
}
