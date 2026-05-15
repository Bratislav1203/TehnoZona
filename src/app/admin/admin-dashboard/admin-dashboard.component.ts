import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FeaturedService, HomepageItemRequest, ItemType, HomepageSection, HomepageItemResponse } from '../../services/featured.service';
import { GlavnaGrupa, MockGlavnaGrupaService } from '../../services/mock-glavna-grupa.service';
import { MappingService, NadgrupaMapping, MappingConfirmRequest } from '../../services/mapping.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  activeTab: 'add' | 'list' | 'mapping' = 'add';
  currentStep: number = 1;
  editingId: number | null = null;

  // Sekcije dostupne po tipu
  private sectionsByType: Record<ItemType, { value: HomepageSection, label: string }[]> = {
    PRODUCT: [
      { value: 'TOP', label: 'Najnoviji proizvodi' },
      { value: 'SALE', label: 'Akcija / Popust' },
      { value: 'RECOMMENDED', label: 'Preporučeno' },
    ],
    CATEGORY: [
      { value: 'RECOMMENDED', label: 'Preporučene kategorije' },
      { value: 'TOP', label: 'Top kategorije' },
    ],
    BRAND: [
      { value: 'RECOMMENDED', label: 'Partner brendovi' },
    ],
    BANNER: [
      { value: 'HERO', label: 'Hero sekcija' },
      { value: 'RECOMMENDED', label: 'Sekundarna sekcija' },
    ],
    PROMO: [
      { value: 'NEW', label: 'Novo' },
      { value: 'NEWS', label: 'Akcije & Novosti' },
    ],
  };

  itemTypes: { value: ItemType, label: string }[] = [
    { value: 'PRODUCT', label: 'Proizvod' },
    { value: 'CATEGORY', label: 'Kategorija' },
    { value: 'BRAND', label: 'Brend' },
    { value: 'BANNER', label: 'Hero Baner' },
    { value: 'PROMO', label: 'Promo Kartica' }
  ];

  get sections(): { value: HomepageSection, label: string }[] {
    return this.sectionsByType[this.newFeatured.itemType] || [];
  }

  priorities = [1, 2, 3, 4, 5];

  newFeatured: HomepageItemRequest = this.emptyForm();

  isSubmitting = false;
  submitSuccess = false;
  submitError = '';
  imageUploading = false;
  imageUploadError = '';

  featuredProducts: HomepageItemResponse[] = [];

  // Mapping state
  mappingRows: NadgrupaMapping[] = [];
  mappingSaving = false;
  mappingSaveSuccess = false;
  mappingSaveError = '';

  readonly glavneGrupeOptions = [
    'BELA TEHNIKA I KUĆNI APARATI',
    'TV, FOTO, AUDIO I VIDEO',
    'RAČUNARI, KOMPONENTE I GAMING',
    'TELEFONI, TABLETI I OPREMA',
    'SIGURNOSNI I ALARMNI SISTEMI',
    'KANCELARIJSKI I ŠKOLSKI MATERIJAL',
    'BATERIJE, PUNJAČI I KABLOVI',
    'ALATI I OPREMA ZA DOM',
    'FITNESS I SPORT',
    'OSTALO I OUTLET'
  ];

  svGlavneGrupe: GlavnaGrupa[] = [];
  dostupneNadgrupe: string[] = [];
  dostupneGrupe: string[] = [];

  constructor(
    private featuredService: FeaturedService,
    private mockGlavnaGrupaService: MockGlavnaGrupaService,
    private mappingService: MappingService
  ) { }

  ngOnInit(): void {
    this.svGlavneGrupe = this.mockGlavnaGrupaService.getAllGlavneGrupe();
    if (this.activeTab === 'list') {
      this.loadFeaturedProducts();
    }
  }

  private emptyForm(): HomepageItemRequest {
    return {
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
  }

  setTab(tab: 'add' | 'list' | 'mapping'): void {
    this.activeTab = tab;
    this.submitSuccess = false;
    this.submitError = '';
    this.currentStep = 1;
    this.editingId = null;
    this.newFeatured = this.emptyForm();

    if (tab === 'list') this.loadFeaturedProducts();
    if (tab === 'mapping') this.loadUnconfirmedMappings();
  }

  onItemTypeChange(): void {
    // Resetuj sekciju na prvu dostupnu za novi tip
    const available = this.sectionsByType[this.newFeatured.itemType];
    if (available && available.length > 0) {
      this.newFeatured.section = available[0].value;
    }
  }

  nextStep(): void {
    if (this.currentStep < 3) this.currentStep++;
  }

  prevStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  onGlavnaGrupaChange(): void {
    this.newFeatured.nadgrupa = '';
    this.newFeatured.grupa = '';
    this.dostupneNadgrupe = [];
    this.dostupneGrupe = [];

    const izabrana = this.svGlavneGrupe.find(g => g.name === this.newFeatured.glavnaGrupa);
    if (izabrana?.nadgrupe) {
      this.dostupneNadgrupe = Object.keys(izabrana.nadgrupe);
    }
    if (this.newFeatured.glavnaGrupa) {
      this.newFeatured.customName = this.newFeatured.glavnaGrupa;
      this.newFeatured.customImageUrl = `assets/categories/cat_default.png`;
    }
  }

  onNadgrupaChange(): void {
    this.newFeatured.grupa = '';
    this.dostupneGrupe = [];

    const izabranaGlavna = this.svGlavneGrupe.find(g => g.name === this.newFeatured.glavnaGrupa);
    if (izabranaGlavna?.nadgrupe) {
      this.dostupneGrupe = izabranaGlavna.nadgrupe[this.newFeatured.nadgrupa] || [];
    }
    if (this.newFeatured.nadgrupa) {
      this.newFeatured.customName = this.newFeatured.nadgrupa;
      let fn = this.newFeatured.nadgrupa.toLowerCase();
      fn = fn.replace(/č/g, 'c').replace(/ć/g, 'c').replace(/š/g, 's').replace(/đ/g, 'dj').replace(/ž/g, 'z');
      fn = fn.replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '_');
      this.newFeatured.customImageUrl = `assets/categories/cat_${fn}.png`;
    }
  }

  editItem(item: HomepageItemResponse): void {
    const h = item.homepageItem;
    this.editingId = h.id;

    this.newFeatured = {
      itemType: h.itemType,
      section: h.section,
      priority: h.priority,
      validFrom: h.validFrom ? h.validFrom.substring(0, 16) : '',
      validTo: h.validTo ? h.validTo.substring(0, 16) : '',
      barcode: h.barcode || '',
      glavnaGrupa: h.glavnaGrupa || '',
      nadgrupa: h.nadgrupa || '',
      grupa: h.grupa || '',
      brandName: h.brandName || '',
      customName: h.customName || '',
      customImageUrl: h.customImageUrl || '',
      subtitle: h.subtitle || '',
      buttonText: h.buttonText || '',
      buttonRoute: h.buttonRoute || ''
    };

    // Učitaj nadgrupe/grupe za kategoriju
    if (h.itemType === 'CATEGORY' && h.glavnaGrupa) {
      const izabrana = this.svGlavneGrupe.find(g => g.name === h.glavnaGrupa);
      if (izabrana?.nadgrupe) {
        this.dostupneNadgrupe = Object.keys(izabrana.nadgrupe);
        if (h.nadgrupa) {
          this.dostupneGrupe = izabrana.nadgrupe[h.nadgrupa] || [];
        }
      }
    }

    this.activeTab = 'add';
    this.currentStep = 1;
    this.submitSuccess = false;
    this.submitError = '';
  }

  cancelEdit(): void {
    this.editingId = null;
    this.newFeatured = this.emptyForm();
    this.currentStep = 1;
    this.submitSuccess = false;
    this.submitError = '';
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    this.imageUploading = true;
    this.imageUploadError = '';
    this.featuredService.uploadImage(file).subscribe({
      next: (res) => {
        this.newFeatured.customImageUrl = res.url;
        this.imageUploading = false;
      },
      error: () => {
        this.imageUploadError = 'Upload nije uspeo. Pokušaj ponovo.';
        this.imageUploading = false;
      }
    });
  }

  submitNew(): void {
    this.submitSuccess = false;
    this.submitError = '';
    this.isSubmitting = true;

    const obs: Observable<unknown> = this.editingId !== null
      ? this.featuredService.updateHomepageItem(this.editingId, this.newFeatured)
      : this.featuredService.addHomepageItem(0, this.newFeatured);

    obs.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.editingId = null;
        this.currentStep = 1;
        this.newFeatured = this.emptyForm();
      },
      error: () => {
        this.isSubmitting = false;
        this.submitError = 'Greška prilikom čuvanja homepage stavke.';
      }
    });
  }

  loadFeaturedProducts(): void {
    this.featuredService.getAllHomepageItems().subscribe({
      next: (list) => { this.featuredProducts = list; },
      error: (err) => console.error(err)
    });
  }

  getMainImage(item: HomepageItemResponse): string {
    const h = item.homepageItem;
    if (h.customImageUrl) return h.customImageUrl;
    if (h.itemType === 'PRODUCT' && item.artikal?.slike?.length) {
      return item.artikal.slike[0];
    }
    return '/assets/no-image.png';
  }

  isNepoznat(item: HomepageItemResponse): boolean {
    return item.homepageItem.itemType === 'PRODUCT' && item.artikal == null;
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

  loadUnconfirmedMappings(): void {
    this.mappingService.getUnconfirmed().subscribe({
      next: (rows) => { this.mappingRows = rows; },
      error: (err) => console.error(err)
    });
  }

  saveMappings(): void {
    this.mappingSaving = true;
    this.mappingSaveSuccess = false;
    this.mappingSaveError = '';

    const payload: MappingConfirmRequest[] = this.mappingRows.map(r => ({
      nadgrupa: r.nadgrupa,
      glavnaGrupa: r.glavna_grupa
    }));

    this.mappingService.confirmMappings(payload).subscribe({
      next: () => {
        this.mappingSaving = false;
        this.mappingSaveSuccess = true;
        this.mappingRows = [];
      },
      error: () => {
        this.mappingSaving = false;
        this.mappingSaveError = 'Greška pri čuvanju. Pokušaj ponovo.';
      }
    });
  }
}
