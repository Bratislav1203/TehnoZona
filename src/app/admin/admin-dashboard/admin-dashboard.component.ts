import { Component } from '@angular/core';

interface NewFeaturedProduct {
  featureType: string;
  barcode: string;
  priority: number;
  validFrom: string;
  validTo: string;
}

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

  newFeatured: NewFeaturedProduct = {
    featureType: 'TOP',
    barcode: '',
    priority: 1,
    validFrom: '',
    validTo: ''
  };

  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  // Za drugi tab – kasnije ćemo puniti iz beka
  featuredProducts: any[] = [];

  setTab(tab: 'add' | 'list'): void {
    this.activeTab = tab;
    this.submitSuccess = false;
    this.submitError = '';
  }

  submitNew(): void {
    this.submitSuccess = false;
    this.submitError = '';
    this.isSubmitting = true;

    // za sad samo log, posle povezujemo na backend
    console.log('Submitting new featured product:', this.newFeatured);

    // fake “request” – da imaš osećaj flow-a
    setTimeout(() => {
      this.isSubmitting = false;
      this.submitSuccess = true;

      // po želji očisti formu, barcode i datume
      this.newFeatured.barcode = '';
      this.newFeatured.priority = 1;
      this.newFeatured.validFrom = '';
      this.newFeatured.validTo = '';
    }, 600);
  }
}
