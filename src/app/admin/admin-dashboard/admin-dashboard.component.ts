import { Component, OnInit } from '@angular/core';
import { FeaturedService, HomepageItemRequest, ItemType, HomepageSection, HomepageItemResponse } from '../../services/featured.service';
import { GlavnaGrupa, MockGlavnaGrupaService } from '../../services/mock-glavna-grupa.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  activeTab: 'add' | 'list' = 'add';
  currentStep: number = 1;

  itemTypes: { value: ItemType, label: string }[] = [
    { value: 'PRODUCT', label: 'Proizvod' },
    { value: 'CATEGORY', label: 'Kategorija' },
    { value: 'BRAND', label: 'Brend' },
    { value: 'BANNER', label: 'Hero Baner' },
    { value: 'PROMO', label: 'Promo Kartica' }
  ];

  sections: { value: HomepageSection, label: string }[] = [
    { value: 'TOP', label: 'Top / Najnovije' },
    { value: 'SALE', label: 'Akcija / Popust' },
    { value: 'RECOMMENDED', label: 'Preporučeno' },
    { value: 'NEW', label: 'Novo' },
    { value: 'HERO', label: 'Hero Sekcija' },
    { value: 'NEWS', label: 'Akcije & Novosti' }
  ];

  priorities = [1, 2, 3, 4, 5];

  newFeatured: HomepageItemRequest = {
    itemType: 'PRODUCT',
    section: 'TOP',
    barcode: '',
    priority: 1,
    validFrom: '',
    validTo: '',
    glavnaGrupa: '',
    nadgrupa: '',
    grupa: '',
    brandName: '',
    customName: '',
    customImageUrl: '',
    subtitle: '',
    buttonText: '',
    buttonRoute: ''
  };

  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  featuredProducts: HomepageItemResponse[] = [];

  // Kategorije state
  svGlavneGrupe: GlavnaGrupa[] = [];
  dostupneNadgrupe: string[] = [];
  dostupneGrupe: string[] = [];

  constructor(
    private featuredService: FeaturedService,
    private mockGlavnaGrupaService: MockGlavnaGrupaService
  ) { }

  ngOnInit(): void {
    this.svGlavneGrupe = this.mockGlavnaGrupaService.getAllGlavneGrupe();

    if (this.activeTab === 'list') {
      this.loadFeaturedProducts();
    }
  }

  setTab(tab: 'add' | 'list'): void {
    this.activeTab = tab;
    this.submitSuccess = false;
    this.submitError = '';
    this.currentStep = 1; // Resetuj wizard

    if (tab === 'list') {
      this.loadFeaturedProducts();
    }
  }

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Eventi za padajuće liste
  onGlavnaGrupaChange(): void {
    this.newFeatured.nadgrupa = '';
    this.newFeatured.grupa = '';
    this.dostupneNadgrupe = [];
    this.dostupneGrupe = [];

    const izabrana = this.svGlavneGrupe.find(g => g.name === this.newFeatured.glavnaGrupa);
    if (izabrana && izabrana.nadgrupe) {
      this.dostupneNadgrupe = Object.keys(izabrana.nadgrupe);
    }

    // Auto-fill estetike (fallback na Glavnu Grupu dok se ne izabere nadgrupa)
    if (this.newFeatured.glavnaGrupa) {
      this.newFeatured.customName = this.newFeatured.glavnaGrupa;
      this.newFeatured.customImageUrl = `assets/categories/cat_default.png`;
    }
  }

  onNadgrupaChange(): void {
    this.newFeatured.grupa = '';
    this.dostupneGrupe = [];

    const izabranaGlavna = this.svGlavneGrupe.find(g => g.name === this.newFeatured.glavnaGrupa);
    if (izabranaGlavna && izabranaGlavna.nadgrupe) {
      this.dostupneGrupe = izabranaGlavna.nadgrupe[this.newFeatured.nadgrupa] || [];
    }

    // Auto-fill estetike zavisno od izabrane nadgrupe
    if (this.newFeatured.nadgrupa) {
      this.newFeatured.customName = this.newFeatured.nadgrupa;

      // Mapiramo ime nadgrupe u ime slike (lowercase, bez kvačica, razmaci u donje crte)
      let fn = this.newFeatured.nadgrupa.toLowerCase();
      fn = fn.replace(/č/g, 'c').replace(/ć/g, 'c').replace(/š/g, 's').replace(/đ/g, 'dj').replace(/ž/g, 'z');
      fn = fn.replace(/[^a-z0-9\s]/g, ''); // izbaci spec karaktere
      fn = fn.replace(/\s+/g, '_'); // razmake u _

      this.newFeatured.customImageUrl = `assets/categories/cat_${fn}.png`;
    }
  }

  submitNew(): void {
    this.submitSuccess = false;
    this.submitError = '';
    this.isSubmitting = true;

    const vendorId = 1; // Hardkodovan vendorId

    this.featuredService.addHomepageItem(vendorId, this.newFeatured).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.currentStep = 1; // Vrati na pocetak wizarda

        this.newFeatured = {
          itemType: 'PRODUCT',
          section: 'TOP',
          barcode: '',
          priority: 1,
          validFrom: '',
          validTo: '',
          glavnaGrupa: '',
          nadgrupa: '',
          grupa: '',
          brandName: '',
          customName: '',
          customImageUrl: '',
          subtitle: '',
          buttonText: '',
          buttonRoute: ''
        };
      },
      error: () => {
        this.isSubmitting = false;
        this.submitError = 'Greška prilikom čuvanja homepage stavke.';
      }
    });
  }

  loadFeaturedProducts(): void {
    this.featuredService.getAllHomepageItems().subscribe({
      next: (list) => {
        this.featuredProducts = list;
        console.log('Homepage Items:', this.featuredProducts);
      },
      error: (err) => console.error(err)
    });
  }

  getMainImage(item: HomepageItemResponse): string {
    const h = item.homepageItem;
    if (h.customImageUrl) return h.customImageUrl;
    if (h.itemType === 'PRODUCT' && item.artikal?.slike && item.artikal.slike.length > 0) {
      return item.artikal.slike[0];
    }
    return '/assets/no-image.png';
  }

  deleteFeatured(item: HomepageItemResponse): void {
    if (!confirm('Da li sigurno želiš da obrišeš ovu stavku?')) return;

    this.featuredService.deleteHomepageItem(item.homepageItem.id).subscribe({
      next: () => {
        this.featuredProducts = this.featuredProducts.filter(p => p.homepageItem.id !== item.homepageItem.id);
      },
      error: (err) => console.error(err)
    });
  }

}
