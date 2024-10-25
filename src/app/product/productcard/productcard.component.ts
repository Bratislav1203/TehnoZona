import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-productcard',
  templateUrl: './productcard.component.html',
  styleUrls: ['./productcard.component.css']
})
export class ProductcardComponent implements OnInit {

  @Input() product: any; // Proizvod će biti prosleđen iz roditeljske komponente
  quantity: number = 1;

  ngOnInit() {
  }

  increaseQuantity() {
    this.quantity++;
  }


  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}

