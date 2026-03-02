import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from "../../services/cart.service";
import { Product } from "../../services/product.service";
import { GlavnaGrupa, MockGlavnaGrupaService } from '../../services/mock-glavna-grupa.service';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-header-banner',
  templateUrl: './header-banner.component.html',
  styleUrls: ['./header-banner.component.css']
})
export class HeaderBannerComponent implements OnInit {

  cartCount = 0;
  searchTerm: string = '';

  // --- SVE KATEGORIJE - MEGA MENU ---
  showMenu = false;
  allGlavneGrupe: GlavnaGrupa[] = [];

  activeGlavnaGrupa: GlavnaGrupa | null = null;
  activeNadgrupaName: string | null = null;
  activeGrupe: string[] = [];

  constructor(
    private cartService: CartService,
    private router: Router,
    private mockGlavnaGrupaService: MockGlavnaGrupaService,
    public utilService: UtilService,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.cartService.cart$.subscribe((items: Product[]) => {
      this.cartCount = items.length;
    });

    this.allGlavneGrupe = this.mockGlavnaGrupaService.getAllGlavneGrupe();
  }

  // --- PRETRAGA (SEARCH) ---
  onSearch(): void {
    const trimmed = this.searchTerm.trim();
    if (trimmed) {
      this.router.navigate(['/search', this.searchTerm.trim()]);
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  // --- CLICK LOGIKA ZA SAAS PANEL ---

  // Toggle (otvara/zatvara modal) kada se klikne 'KATEGORIJE' triger
  toggleMenu(): void {
    this.showMenu = !this.showMenu;

    // Uvek restiuj na glavne grupe kad se otvori
    if (this.showMenu) {
      this.activeGlavnaGrupa = null;
    }
  }

  forceCloseMenu(): void {
    this.showMenu = false;
  }

  // Klikne se na background/van komponente - zatvori modal
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.showMenu && !this.elementRef.nativeElement.contains(event.target)) {
      this.forceCloseMenu();
    }
  }

  // Klikom na Main Group iz Kolone 1 popunjavamo Kolonu 2
  selectGlavnaGrupa(grupa: GlavnaGrupa): void {
    if (this.activeGlavnaGrupa === grupa) return; // ignore ako smo vec tu

    this.activeGlavnaGrupa = grupa;
    this.activeNadgrupaName = null;
    this.activeGrupe = [];

    this.activeNadgrupaName = null;
  }

  // Toggle expand/collapse nadgrupe
  toggleNadgrupa(nadgrupaName: string): void {
    if (this.activeNadgrupaName === nadgrupaName) {
      this.activeNadgrupaName = null;
    } else {
      this.activeNadgrupaName = nadgrupaName;
    }
  }

  getNadgrupeKeys(grupa: GlavnaGrupa | null): string[] {
    if (!grupa || !grupa.nadgrupe) return [];
    return Object.keys(grupa.nadgrupe);
  }

  // --- RUTIRANJE (Linkovi) ---

  // Klik na naziv glavne grupe = link ka stranici
  goToGlavnaGrupaStrana(grupa?: GlavnaGrupa): void {
    const target = grupa || this.activeGlavnaGrupa;
    if (target) {
      this.router.navigate(['/', target.name]);
      this.forceCloseMenu();
    }
  }

  // Klik na naziv nadgrupe = link ka stranici
  goToNadgrupaStrana(nadgrupaName?: string): void {
    const target = nadgrupaName || this.activeNadgrupaName;
    if (target && this.activeGlavnaGrupa) {
      this.router.navigate(['/', this.activeGlavnaGrupa.name, target]);
      this.forceCloseMenu();
    }
  }

  // Konacni "List Items" (klik po proizvodnoj grupi) iz zadnje kolone
  navigateToGrupa(grupaName: string): void {
    if (this.activeGlavnaGrupa && this.activeNadgrupaName) {
      this.router.navigate(['/', this.activeGlavnaGrupa.name, this.activeNadgrupaName, grupaName]);
      this.forceCloseMenu();
    }
  }
}
