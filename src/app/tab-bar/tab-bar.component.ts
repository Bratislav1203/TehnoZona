import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import { GlavnagrupaService } from "../services/glavnagrupa.service";
import { GlavnaGrupa, MockGlavnaGrupaService } from "../services/mock-glavna-grupa.service";

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

  constructor(private glavnaGrupaService: GlavnagrupaService, private mockGlavnaGrupaService: MockGlavnaGrupaService) { }

  ngOnInit(): void {
    this.glavneGrupeSaNadgrupamaIGrupama = this.mockGlavnaGrupaService.getAllGlavneGrupe();
    this.glavneGrupeSaNadgrupamaIGrupamaUziSkup = this.glavneGrupeSaNadgrupamaIGrupama
      .filter(grupa =>
        grupa.name !== 'SIGURNOSNI I ALARMNI SISTEMI' &&
        grupa.name !== 'KANCELARIJSKI I ŠKOLSKI MATERIJAL' &&
        grupa.name !== 'OSTALO I OUTLET'
      );
    console.log(this.glavneGrupeSaNadgrupamaIGrupama);
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
