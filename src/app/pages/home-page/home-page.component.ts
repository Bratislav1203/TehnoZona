import { Component, OnInit } from '@angular/core';
import { Product, ProductService, nameAndImage } from '../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  products: Product[] = [];
  brands: nameAndImage[] = [];

  // nove sekcije
  topProducts: { name: string; imageUrl: string; price: number }[] = [];
  recommendedCategories: {glavnaGrupa: string; nadgrupa: string; name: string; imgUrl: string }[] = [];
  saleItems: { name: string; imgUrl: string; oldPrice: number; newPrice: number }[] = [];

  vendorId = 2;
  glavnaGrupa: string = 'TV, FOTO, AUDIO I VIDEO';
  page = 0;
  size = 20;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.ucitajProizvode();

    // popularni brendovi
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

    // statički podaci (kasnije možeš povući iz backenda)
    this.topProducts = [
      { name: 'Samsung TV 55"', imageUrl: 'assets/frizider.jpg', price: 499 },
      { name: 'Sony Soundbar', imageUrl: 'assets/frizider.jpg', price: 249 },
      { name: 'LG Monitor 27"', imageUrl: 'assets/frizider.jpg', price: 199 },
      { name: 'LG Monitor 27"', imageUrl: 'assets/frizider.jpg', price: 199 },
    ];

    this.recommendedCategories = [
      { glavnaGrupa: 'TV, FOTO, AUDIO I VIDEO', nadgrupa: 'TV, AUDIO, VIDEO',
        name: 'Televizori', imgUrl: 'assets/subcategories/AUDIO.jpg' },
      { glavnaGrupa: 'TV, FOTO, AUDIO I VIDEO', nadgrupa: 'TV, AUDIO, VIDEO',
        name: 'Laptopovi', imgUrl: 'assets/tv.jpg' },
      { glavnaGrupa: 'TV, FOTO, AUDIO I VIDEO', nadgrupa: 'TV, AUDIO, VIDEO',
        name: 'Frižideri', imgUrl: 'assets/frizider.jpg' },
      { glavnaGrupa: 'TV, FOTO, AUDIO I VIDEO', nadgrupa: 'TV, AUDIO, VIDEO',
        name: 'Mobilni telefoni', imgUrl: 'assets/frizider.jpg' },
    ];

    this.saleItems = [
      { name: 'Philips TV 43"', imgUrl: 'assets/tv.jpg', oldPrice: 399, newPrice: 329 },
      { name: 'Beko frižider', imgUrl: 'assets/frizider.jpg', oldPrice: 499, newPrice: 429 },
    ];
  }

  ucitajProizvode(): void {
    // ako ti zatreba backend poziv, ovde ga lako aktiviraš ponovo
    // this.productService.getProductsFromCategory(this.vendorId, this.glavnaGrupa, this.page, this.size)
    //   .subscribe((data) => {
    //     this.products = data;
    //     console.log(this.products);
    //   });
  }

  formatirajNaziv(naziv: string): string {
    return naziv.charAt(0).toUpperCase() + naziv.slice(1).toLowerCase();
  }
}
