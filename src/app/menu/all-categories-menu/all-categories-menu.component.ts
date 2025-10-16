import { Component, EventEmitter, HostListener, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { MockGlavnaGrupaService, GlavnaGrupa } from '../../services/mock-glavna-grupa.service';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-all-categories-menu',
  templateUrl: './all-categories-menu.component.html',
  styleUrls: ['./all-categories-menu.component.css']
})
export class AllCategoriesMenuComponent implements OnInit, OnChanges {

  @Output() closeMenu = new EventEmitter<void>();

  glavneGrupe: GlavnaGrupa[] = [];
  hoveredGroup: GlavnaGrupa | null = null;
  openedGroup: GlavnaGrupa | null = null;
  isMobile = false;

  constructor(
    private mockService: MockGlavnaGrupaService,
    public utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.glavneGrupe = this.mockService.getAllGlavneGrupe();
    this.checkMobile();
    this.resetGroups(); // ✅ reset odmah pri inicijalizaciji
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.resetGroups(); // ✅ reset svaki put kad se komponenta ponovo prikaže
  }

  /** Resetuje trenutno otvorene i hoverovane grupe */
  private resetGroups(): void {
    this.openedGroup = null;
    this.hoveredGroup = null;
  }

  /** Proverava širinu ekrana i postavlja mobilni mod */
  @HostListener('window:resize')
  checkMobile(): void {
    this.isMobile = window.innerWidth < 992;
  }

  /** Hover logika za desktop */
  onHoverGroup(group: GlavnaGrupa): void {
    if (!this.isMobile) {
      this.hoveredGroup = group;
    }
  }

  onLeaveMenu(): void {
    if (!this.isMobile) {
      this.hoveredGroup = null;
    }
  }

  /** Klik logika za mobilni prikaz (accordion ponašanje) */
  toggleGroup(group: GlavnaGrupa, event?: MouseEvent): void {
    if (!this.isMobile) {
      return;
    }

    // ✅ sprečava da klik na roditelja slučajno aktivira prvu grupu
    event?.stopPropagation();

    // ✅ ako klikne istu grupu — zatvori je, inače otvori novu
    if (this.openedGroup?.name === group.name) {
      this.openedGroup = null;
    } else {
      this.openedGroup = group;
    }
  }

  /** Zatvara meni na mobilnom */
  closeMobileMenu(): void {
    this.closeMenu.emit();
  }

  /** Zatvara meni (poziva se na klik bilo kog linka) */
  closeAllMenus(): void {
    this.closeMenu.emit();
    this.resetGroups(); // ✅ resetuj sve prilikom zatvaranja
  }
}
