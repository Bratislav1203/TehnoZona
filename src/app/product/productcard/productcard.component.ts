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
  showPopup = false;

  constructor(private productService: ProductService, private cartService: CartService) {
  }
  ngOnInit() {
  }

  setCurrentProduct(product: Product) {
    this.productService.setCurrentProduct(product);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.showPopup = true;

    setTimeout(() => {
      this.showPopup = false;
    }, 2000);
  }

  onImageError(event: Event) {
    const element = event.target as HTMLImageElement;
    element.src = 'assets/noImageAvailable.jpg';
  }


}

