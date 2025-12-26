import { Component, OnInit } from '@angular/core';
import { Product, ProductService, nameAndImage } from '../../services/product.service';
import { FeaturedService, FeaturedResponseItem } from '../../services/featured.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  products: Product[] = [];
  brands: nameAndImage[] = [];

  // 🛒 Top proizvodi (dinamički iz featured)
  topProducts: {
    barcode: string;
    name: string;
    imageUrl: string;
    price: number;
  }[] = [];

  // 🧭 Preporučene kategorije (OSTAJE KAKO JESTE)
  recommendedCategories: {
    glavnaGrupa: string;
    nadgrupa: string;
    name: string;
    imgUrl: string;
  }[] = [];

  // 💥 Akcije i popusti (dinamički iz featured)
  saleItems: {
    barcode: string;
    name: string;
    imgUrl: string;
    oldPrice: number;
    newPrice: number;
  }[] = [];

  vendorId = 2;
  glavnaGrupa: string = 'TV, FOTO, AUDIO I VIDEO';
  page = 0;
  size = 20;

  constructor(
    private productService: ProductService,
    private featuredService: FeaturedService
  ) {}

  ngOnInit(): void {
    this.ucitajProizvode();

    // 🧩 Najpopularniji brendovi (OSTAJE ISTO)
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

    // 🧭 Preporučene kategorije (OSTAJE STATIČKO)
    this.recommendedCategories = [
      {
        glavnaGrupa: 'TV, FOTO, AUDIO I VIDEO',
        nadgrupa: 'TV, AUDIO, VIDEO',
        name: 'Televizori',
        imgUrl: 'assets/subcategories/AUDIO.jpg'
      },
      {
        glavnaGrupa: 'TV, FOTO, AUDIO I VIDEO',
        nadgrupa: 'TV, AUDIO, VIDEO',
        name: 'Laptopovi',
        imgUrl: 'assets/tv.jpg'
      },
      {
        glavnaGrupa: 'TV, FOTO, AUDIO I VIDEO',
        nadgrupa: 'TV, AUDIO, VIDEO',
        name: 'Frižideri',
        imgUrl: 'assets/frizider.jpg'
      },
      {
        glavnaGrupa: 'TV, FOTO, AUDIO I VIDEO',
        nadgrupa: 'TV, AUDIO, VIDEO',
        name: 'Mobilni telefoni',
        imgUrl: 'assets/frizider.jpg'
      }
    ];

    // 🛒 Featured → Top + Sale
    this.ucitajFeaturedSekcije();
  }

  private ucitajFeaturedSekcije(): void {
    this.featuredService.getAllFeatured().subscribe({
      next: (data: FeaturedResponseItem[]) => {

        const top = data.filter(i => i.featured.featureType === 'TOP');
        const sale = data.filter(i => i.featured.featureType === 'SALE');

        this.topProducts = top.map(i => ({
          barcode: i.featured.barcode,
          name: i.artikal.naziv,
          imageUrl: i.artikal.slike?.[0] || 'assets/no-image.png',
          price: i.artikal.webCena
        }));
        console.log(data);

        this.saleItems = sale.map(i => ({
          barcode: i.artikal.barcode,
          name: i.artikal.naziv,
          imgUrl: i.artikal.slike?.[0] || 'assets/no-image.png',
          oldPrice: Math.round(i.artikal.webCena * 1.2), // privremeno dok ne dobiješ popust iz backenda
          newPrice: i.artikal.webCena
        }));
      },
      error: err => console.error('Greška pri učitavanju featured sekcija:', err)
    });
  }

  ucitajProizvode(): void {
    // trenutno ne koristiš
  }

  formatirajNaziv(naziv: string): string {
    return naziv.charAt(0).toUpperCase() + naziv.slice(1).toLowerCase();
  }
}
