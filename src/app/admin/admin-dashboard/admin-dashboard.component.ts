import { Component } from '@angular/core';
import { FeaturedService, FeaturedAddRequest } from '../../services/featured.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {

  activeTab: 'add' | 'list' = 'add';

  featureTypes = [
    { value: 'TOP', label: 'Top' },
    { value: 'SALE', label: 'Akcija' },
    { value: 'NEW', label: 'Novo' },
    { value: 'RECOMMENDED', label: 'Preporučeno' }
  ];

  priorities = [1, 2, 3, 4, 5];

  newFeatured: FeaturedAddRequest = {
    featureType: 'TOP',
    barcode: '',
    priority: 1,
    validFrom: '',
    validTo: ''
  };

  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  featuredProducts: any[] = [];

  constructor(private featuredService: FeaturedService) {}

  setTab(tab: 'add' | 'list'): void {
    this.activeTab = tab;
    this.submitSuccess = false;
    this.submitError = '';

    if (tab === 'list') {
      this.loadFeaturedProducts();
    }
  }

  submitNew(): void {
    this.submitSuccess = false;
    this.submitError = '';
    this.isSubmitting = true;

    const vendorId = 1;

    this.featuredService.addFeatured(vendorId, this.newFeatured).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitSuccess = true;

        this.newFeatured = {
          featureType: 'TOP',
          barcode: '',
          priority: 1,
          validFrom: '',
          validTo: ''
        };
      },
      error: () => {
        this.isSubmitting = false;
        this.submitError = 'Greška prilikom čuvanja featured proizvoda.';
      }
    });
  }

  loadFeaturedProducts(): void {
    this.featuredService.getAllFeatured().subscribe({
      next: (list) => {
        this.featuredProducts = list;
        console.log(this.featuredProducts);
      },
      error: (err) => console.error(err)
    });
  }

  getMainImage(item: any): string {
    if (!item?.artikal?.slike) return '/assets/no-image.png';
    const arr = item.artikal.slike;
    return Array.isArray(arr) && arr.length > 0 ? arr[0] : '/assets/no-image.png';
  }

  deleteFeatured(item: any): void {
    if (!confirm('Da li sigurno želiš da obrišeš featured stavku?')) return;

    this.featuredService.deleteFeatured(item.featured.id).subscribe({
      next: () => {
        this.featuredProducts = this.featuredProducts.filter(p => p.featured.id !== item.featured.id);
      },
      error: (err) => console.error(err)
    });
  }

}
