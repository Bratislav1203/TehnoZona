import { Component, Input, OnInit } from '@angular/core';
import { Product, ProductService } from "../../services/product.service";
import { CartService } from "../../services/cart.service";

@Component({
  selector: 'app-productcard',
  templateUrl: './productcard.component.html',
  styleUrls: ['./productcard.component.css']
})
export class ProductcardComponent implements OnInit {

  @Input() product: Product;

  constructor(private productService: ProductService, private cartService: CartService) {
  }
  ngOnInit() {
  }

  setCurrentProduct(product: Product) {
    this.productService.setCurrentProduct(product);
  }
  addToCart(product: Product) {
    this.cartService.addToCart(product);
    console.log('Dodato u korpu:', product);
  }
}

