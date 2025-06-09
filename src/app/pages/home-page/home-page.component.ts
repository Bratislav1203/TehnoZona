import { Component, OnInit } from '@angular/core';
import { Product, ProductService, nameAndImage } from '../../services/product.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  products: Product[] = [];
  brands: nameAndImage[] = [];

  vendorId: number = 1;
  glavnaGrupa: string = 'TV, FOTO, AUDIO I VIDEO'; // možeš promeniti po potrebi
  page: number = 0;
  size: number = 20;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.ucitajProizvode();

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

  ucitajProizvode(): void {
    this.productService.getProductsFromCategory(this.vendorId, this.glavnaGrupa, this.page, this.size)
      .subscribe((data) => {
        this.products = data;
        console.log(this.products);
      });
  }

  formatirajNaziv(naziv: string): string {
    return naziv.charAt(0).toUpperCase() + naziv.slice(1).toLowerCase();
  }
}
