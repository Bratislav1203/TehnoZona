import { Component, OnInit } from '@angular/core';
import {Product, ProductService, nameAndImage} from "../../services/product.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  brands: nameAndImage[] = [];

  ngOnInit(): void {
    this.productService.getProducts(1,20).subscribe((data) => {
      this.products = data;
      console.log(this.products);
    });
    this.productService.getGlavniProizvodjaci().subscribe(
      (podaci: string[]) => {
        this.brands = podaci.map(naziv => ({
          name: this.formatirajNaziv(naziv),
          imgUrl: `assets/brands/${naziv.toLowerCase()}.png`
        }));
      },
      (error) => {
        console.error('Greška prilikom učitavanja proizvođača:', error);
      }
    );
  }
  formatirajNaziv(naziv: string): string {
    return naziv.charAt(0).toUpperCase() + naziv.slice(1).toLowerCase();
  }

}
