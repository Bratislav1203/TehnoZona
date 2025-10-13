import { Component, OnInit } from '@angular/core';
import { GlavnagrupaService } from '../services/glavnagrupa.service';
import { GlavnaGrupa, MockGlavnaGrupaService } from '../services/mock-glavna-grupa.service';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.css']
})
export class TabBarComponent implements OnInit {

  showMenu = false;                      // za "SVE KATEGORIJE"
  hoveredIndex: number | null = null;    // za hover glavnih grupa
  glavneGrupeSaNadgrupamaIGrupama: GlavnaGrupa[] = [];
  glavneGrupeSaNadgrupamaIGrupamaUziSkup: GlavnaGrupa[] = [];

  private hoverTimeout: any;
  private menuTimeout: any;

  constructor(
    private glavnaGrupaService: GlavnagrupaService,
    private mockGlavnaGrupaService: MockGlavnaGrupaService,
    public utilService: UtilService
  ) { }

  ngOnInit(): void {
    this.glavneGrupeSaNadgrupamaIGrupama = this.mockGlavnaGrupaService.getAllGlavneGrupe();

    this.glavneGrupeSaNadgrupamaIGrupamaUziSkup = this.glavneGrupeSaNadgrupamaIGrupama
      .filter(grupa =>
        grupa.name !== 'SIGURNOSNI I ALARMNI SISTEMI' &&
        grupa.name !== 'KANCELARIJSKI I ŠKOLSKI MATERIJAL' &&
        grupa.name !== 'OSTALO I OUTLET'
      );
  }

  /* Hover logika za glavne tabove */
  onMouseEnter(index: number): void {
    clearTimeout(this.hoverTimeout);
    this.hoveredIndex = index;
  }

  onMouseLeave(): void {
    this.hoverTimeout = setTimeout(() => {
      this.hoveredIndex = null;
    }, 250); // delay 250ms
  }

  /* Hover/klik logika za "SVE KATEGORIJE" */
  openMenu(): void {
    clearTimeout(this.menuTimeout);
    this.showMenu = true;
  }

  closeMenu(): void {
    this.menuTimeout = setTimeout(() => {
      this.showMenu = false;
    }, 250); // delay 250ms
  }

  forceCloseMenu(): void {
    this.showMenu = false;
  }

  onTabClick(tab: string): void {
    console.log('Kliknut tab:', tab);
  }
}
