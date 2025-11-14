import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product } from '../../services/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartItems: Product[] = [];
  isMobile = false;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.detectMobile();

    window.addEventListener('resize', () => {
      this.detectMobile();
    });

    this.cartItems = this.cartService.getCartItems();
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
    });
  }

  private detectMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  removeFromCart(product: Product) {
    this.cartService.removeFromCart(product);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  updateQuantity(product: Product) {
    this.cartService.updateQuantity(product, product.cartKolicina);
  }
}
