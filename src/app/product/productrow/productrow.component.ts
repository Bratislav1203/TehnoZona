import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-productrow',
  templateUrl: './productrow.component.html',
  styleUrls: ['./productrow.component.css']
})
export class ProductrowComponent implements OnInit {

  @Input() products: any[] = [];
  visibleProducts = this.products;
  productCardWidth = 220;
  constructor() { }
  ngOnInit() {
    this.updateVisibleProducts();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateVisibleProducts();
  }


  updateVisibleProducts() {
    const containerWidth = window.innerWidth; // Ukupna širina prozora
    const menuWidth = 320; // Širina menija (fiksna širina menija u px)
    const margin = 40; // Ukupna leva i desna margina (20px sa svake strane)
    const availableWidth = containerWidth - menuWidth - margin; // Širina koja ostaje za prikaz kartica

    const maxProducts = Math.floor(availableWidth / this.productCardWidth); // Broj kartica koje mogu stati u preostali prostor
    this.visibleProducts = this.products.slice(0, maxProducts); // Prikazujemo samo onoliko kartica koliko može stati
  }



}
