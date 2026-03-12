import { Component, OnInit } from '@angular/core';
import { Product, ProductService, nameAndImage } from '../../services/product.service';
import { FeaturedService, HomepageItemResponse } from '../../services/featured.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  products: Product[] = [];
  brands: nameAndImage[] = [];

  // 🛒 Top proizvodi (dinamički iz baze: itemType=PRODUCT, section=TOP)
  topProducts: {
    barcode: string;
    name: string;
    imageUrl: string;
    price: number;
  }[] = [];

  // 🧭 Preporučene kategorije (dinamički iz baze: itemType=CATEGORY, section=RECOMMENDED)
  recommendedCategories: {
    name: string;
    imgUrl: string;
    routeSegments: string[];
  }[] = [];

  // 💥 Akcije i popusti (dinamički iz baze: itemType=PRODUCT, section=SALE)
  saleItems: {
    barcode: string;
    name: string;
    imgUrl: string;
    oldPrice: number;
    newPrice: number;
  }[] = [];

  // 🎭 Dinamički Hero (BANNER)
  heroBanner: {
    title: string;
    subtitle: string;
    imgUrl: string;
    buttonText: string;
    buttonRoute: string;
  } | null = null;

  // 📰 Promo kartice (PROMO)
  promos: {
    tag: string;
    title: string;
    subtitle: string;
    imgUrl: string;
    buttonRoute: string;
  }[] = [];

  isLoading: boolean = true;
  vendorId = 2;
  page = 0;
  size = 20;

  constructor(
    private productService: ProductService,
    private featuredService: FeaturedService
  ) { }

  ngOnInit(): void {
    // 🧩 OSTAJE ISTO: Najpopularniji brendovi iz starog API-ja za sada
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

    // 🛒 Učitavamo sve HomepageItems sa beka (TOP, SALE, RECOMMENDED)
    this.ucitajFeaturedSekcije();
  }

  private ucitajFeaturedSekcije(): void {
    this.featuredService.getAllHomepageItems().subscribe({
      next: (data: HomepageItemResponse[]) => {
        console.log('Homepage Items fetched:', data);

        // 1. Izdvajamo proizvode (TOP)
        const top = data.filter(i => i.homepageItem.itemType === 'PRODUCT' && i.homepageItem.section === 'TOP');
        // 2. Izdvajamo proizvode na akciji (SALE)
        const sale = data.filter(i => i.homepageItem.itemType === 'PRODUCT' && i.homepageItem.section === 'SALE');
        // 3. Izdvajamo kategorije (Sada hvatamo sve kategorije, pa filtriramo po tipu)
        const cats = data.filter(i => i.homepageItem.itemType === 'CATEGORY');
        
        console.log('Sirovi podaci za popularne kategorije (SVE):', cats);

        // Mapiramo TOP proizvode
        this.topProducts = top
          .filter(i => !!i.artikal)
          .map(i => ({
            barcode: i.homepageItem.barcode || i.artikal!.barcode,
            name: i.artikal!.naziv,
            imageUrl: i.artikal!.slike?.[0] || 'assets/no-image.png',
            price: i.artikal!.mpcena
          }));
        console.log('🛒 TOP PROIZVODI:', this.topProducts);

        // Mapiramo SALE proizvode
        this.saleItems = sale
          .filter(i => !!i.artikal)
          .map(i => ({
            barcode: i.homepageItem.barcode || i.artikal!.barcode,
            name: i.artikal!.naziv,
            imgUrl: i.artikal!.slike?.[0] || 'assets/no-image.png',
            oldPrice: Math.round(i.artikal!.mpcena * 1.2), // TODO: Stvarna stara cena kad backend podrži
            newPrice: i.artikal!.mpcena
          }));
        console.log('💥 AKCIJE I POPUSTI:', this.saleItems);

        // Mapiramo KATEGORIJE
        this.recommendedCategories = cats.map(i => {
          const item = i.homepageItem;
          // Dinamički pravimo niz za routerLink: ['Glavna Grupa', 'Nadgrupa', 'Grupa']
          const routeSegments: string[] = [];
          if (item.glavnaGrupa) routeSegments.push(item.glavnaGrupa);
          if (item.nadgrupa) routeSegments.push(item.nadgrupa);
          if (item.grupa) routeSegments.push(item.grupa);

          return {
            name: item.customName || item.grupa || item.nadgrupa || item.glavnaGrupa || 'Nepoznato',
            imgUrl: item.customImageUrl || 'assets/cat-tv-light.png',
            routeSegments: routeSegments.length > 0 ? routeSegments : ['/'] // fallback da ne pukne link
          };
        });

        // 4. Izdvajamo BANER (HERO)
        const banner = data.find(i => i.homepageItem.itemType === 'BANNER' && i.homepageItem.section === 'HERO');
        if (banner) {
          const b = banner.homepageItem;
          this.heroBanner = {
            title: b.customName || 'Dobrodošli u TehnoZonu',
            subtitle: b.subtitle || '',
            imgUrl: b.customImageUrl || 'assets/hero-device.png',
            buttonText: b.buttonText || 'Pregledaj ponudu',
            buttonRoute: b.buttonRoute || '/products'
          };
        }

        // 5. Izdvajamo PROMO kartice (NEWS)
        const news = data.filter(i => i.homepageItem.itemType === 'PROMO');
        this.promos = news.map(i => {
          const p = i.homepageItem;
          return {
            tag: p.section === 'NEW' ? 'Novo' : 'Akcija',
            title: p.customName || '',
            subtitle: p.subtitle || '',
            imgUrl: p.customImageUrl || 'assets/hero-device.png',
            buttonRoute: p.buttonRoute || '/products'
          };
        });

        console.log('--------------------------------------------------');
        console.log('🚀 POPULARNE KATEGORIJE POVUČENE SA BEKENDA:');
        console.table(this.recommendedCategories);
        console.log('--------------------------------------------------');

        this.isLoading = false;
      },
      error: err => {
        console.error('Greška pri učitavanju homepage sekcija:', err);
        this.isLoading = false;
      }
    });
  }

  formatirajNaziv(naziv: string): string {
    return naziv.charAt(0).toUpperCase() + naziv.slice(1).toLowerCase();
  }
}
