import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Product} from "../../../services/product.service";
import {CartService} from "../../../services/cart.service";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: Product[] = [];

  firstName: string = '';
  lastName: string = '';
  address: string = '';
  postalCode: string = '';
  email: string = '';

  constructor(private cartService: CartService, private http: HttpClient) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe((items: Product[]) => {
      this.cartItems = items;
    });
  }

  submitOrder(): void {
    if (!this.firstName || !this.lastName || !this.address || !this.postalCode || !this.email) {
      alert('Molimo vas da popunite sva polja.');
      return;
    }

    const orderData = {
      ime: this.firstName,
      prezime: this.lastName,
      email: this.email,
      adresa: this.address,
      postanskiBroj: this.postalCode,
      artikli: this.cartItems
    };

    this.cartService.submitOrder(orderData).subscribe(
      (response) => {
        console.log('Uspešno poslato:', response);
        alert('Porudžbina je uspešno poslata!');
      },
      (error) => {
        console.error('Greška prilikom slanja porudžbine:', error);
        alert('Došlo je do greške prilikom slanja porudžbine.');
      }
    );
  }

}
