import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { MockGlavnaGrupaService, GlavnaGrupa } from '../../services/mock-glavna-grupa.service';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-all-categories-menu',
  templateUrl: './all-categories-menu.component.html',
  styleUrls: ['./all-categories-menu.component.css']
})
export class AllCategoriesMenuComponent implements OnInit {

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
  }

  @HostListener('window:resize')
  checkMobile(): void {
    this.isMobile = window.innerWidth < 992;
  }

  onHoverGroup(group: GlavnaGrupa): void {
    if (!this.isMobile) this.hoveredGroup = group;
  }

  onLeaveMenu(): void {
    if (!this.isMobile) this.hoveredGroup = null;
  }

  toggleGroup(group: GlavnaGrupa): void {
    if (this.isMobile) {
      this.openedGroup = this.openedGroup?.name === group.name ? null : group;
    }
  }

  closeMobileMenu(): void {
    this.closeMenu.emit();
  }
}
