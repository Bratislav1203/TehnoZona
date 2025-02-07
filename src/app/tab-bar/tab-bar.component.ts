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
  glavneGrupeINadgrupe: Record<string, string[]> = {};

  // Vendor ID - ovo možeš učiniti dinamičkim ukoliko treba
  vendorId = 1;

  constructor(private glavnaGrupaService: GlavnagrupaService) { }

  ngOnInit(): void {
    // Pozivanje servisa za glavne grupe
    this.glavnaGrupaService.getGlavneGrupe(this.vendorId).subscribe((data) => {
      this.glavneGrupe = data;
      console.log('Glavne grupe:', this.glavneGrupe);
    });

    // Pozivanje servisa za nadgrupe i grupe
    this.glavnaGrupaService.getNadgrupeiGrupe(this.vendorId).subscribe((data) => {
      this.glavneGrupeINadgrupe = data;
      console.log('Glavne grupe i nadgrupe:', this.glavneGrupeINadgrupe);
    });
  }

  // Klik na tab
  onTabClick(tab: string): void {
    console.log('Clicked tab:', tab);
  }
}
