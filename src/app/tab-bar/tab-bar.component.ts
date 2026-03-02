import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlavnagrupaService } from '../services/glavnagrupa.service';
import { GlavnaGrupa, MockGlavnaGrupaService } from '../services/mock-glavna-grupa.service';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.css']
})
export class TabBarComponent implements OnInit {

  // --- SVE KATEGORIJE - MEGA MENU ---
  showMenu = false;
  allGlavneGrupe: GlavnaGrupa[] = [];

  activeGlavnaGrupa: GlavnaGrupa | null = null;
  activeNadgrupaName: string | null = null;
  activeGrupe: string[] = [];

  private hideTimeout: any;

  // --- GLAVNI TABOVI - NAVIGACIJA ---
  hoveredIndex: number | null = null;
  glavneGrupeSaNadgrupamaIGrupama: GlavnaGrupa[] = [];
  glavneGrupeSaNadgrupamaIGrupamaUziSkup: GlavnaGrupa[] = [];

  private hoverTimeout: any;

  constructor(
    private glavnaGrupaService: GlavnagrupaService,
    private mockGlavnaGrupaService: MockGlavnaGrupaService,
    public utilService: UtilService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Svi podaci za panel
    this.allGlavneGrupe = this.mockGlavnaGrupaService.getAllGlavneGrupe();

    // Podaci za ostale tabove
    this.glavneGrupeSaNadgrupamaIGrupama = this.allGlavneGrupe.filter(grupa =>
      grupa.name !== 'SIGURNOSNI I ALARMNI SISTEMI' &&
      grupa.name !== 'KANCELARIJSKI I ŠKOLSKI MATERIJAL' &&
      grupa.name !== 'OSTALO I OUTLET'
    );

    this.updateVisibleTabs();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateVisibleTabs();
  }

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
      this.glavneGrupeSaNadgrupamaIGrupamaUziSkup = []; // mobilni prikaz
    }
  }

  // --- GLAVNI TABOVI LOGIKA --- //
  onMouseEnter(index: number): void {
    clearTimeout(this.hoverTimeout);
    this.hoveredIndex = index;
  }

  onMouseLeave(): void {
    this.hoverTimeout = setTimeout(() => {
      this.hoveredIndex = null;
    }, 250);
  }

  // --- SVE KATEGORIJE - SAAS PANEL LOGIKA --- //
  openMenu(): void {
    clearTimeout(this.hideTimeout);
    this.showMenu = true;

    // Auto-select prve kategorije na otvaranje ako nije već tu
    if (!this.activeGlavnaGrupa && this.allGlavneGrupe.length > 0) {
      this.selectGlavnaGrupa(this.allGlavneGrupe[0]);
    }
  }

  closeMenu(): void {
    this.hideTimeout = setTimeout(() => {
      this.showMenu = false;
    }, 250);
  }

  onMenuEnter(): void {
    clearTimeout(this.hideTimeout);
  }

  onMenuLeave(): void {
    this.closeMenu();
  }

  forceCloseMenu(): void {
    this.showMenu = false;
  }

  selectGlavnaGrupa(grupa: GlavnaGrupa): void {
    this.activeGlavnaGrupa = grupa;
    this.activeNadgrupaName = null;
    this.activeGrupe = [];

    // Prikazemo odmah prvu podgrupu zarad glatkoće menija
    const nadgrupeKeys = this.getNadgrupeKeys(grupa);
    if (nadgrupeKeys && nadgrupeKeys.length > 0) {
      this.selectNadgrupa(grupa, nadgrupeKeys[0]);
    }
  }

  selectNadgrupa(grupa: GlavnaGrupa, nadgrupaName: string): void {
    this.activeNadgrupaName = nadgrupaName;
    this.activeGrupe = grupa.nadgrupe[nadgrupaName] || [];
  }

  getNadgrupeKeys(grupa: GlavnaGrupa | null): string[] {
    if (!grupa || !grupa.nadgrupe) return [];
    return Object.keys(grupa.nadgrupe);
  }

  // --- RUTIRANJE IZ SVE KATEGORIJE --- //
  navigateToGlavnaGrupa(grupa: GlavnaGrupa): void {
    this.router.navigate(['/kategorija', grupa.name.toLowerCase().replace(/ /g, '-')]);
    this.forceCloseMenu();
  }

  navigateToNadgrupa(nadgrupaName: string): void {
    this.router.navigate(['/potkategorija', nadgrupaName.toLowerCase().replace(/ /g, '-')]);
    this.forceCloseMenu();
  }

  navigateToGrupa(grupaName: string): void {
    this.router.navigate(['/grupa', grupaName.toLowerCase().replace(/ /g, '-')]);
    this.forceCloseMenu();
  }

  onTabClick(tab: string): void {
    console.log('Kliknut tab:', tab);
  }

}
