import { Component, HostListener, OnInit } from '@angular/core';
import {CartService} from "../../services/cart.service";
import {Product} from "../../services/product.service";

@Component({
  selector: 'app-header-banner',
  templateUrl: './header-banner.component.html',
  styleUrls: ['./header-banner.component.css']
})
export class HeaderBannerComponent implements OnInit {

  cartCount = 0;

  constructor(private cartService: CartService ) { }


  ngOnInit(): void {
    this.cartService.cart$.subscribe((items: Product[]) => {
      this.cartCount = items.length;
    });
  }


}
