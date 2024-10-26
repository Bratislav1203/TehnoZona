import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  ngOnInit() {}

  product = {
    code: '1200537',
    name: 'Samsung Galaxy A15 128 GB - Crni',
    oldPrice: 25554,
    discount: 22,
    savings: 5555.44,
    price: 19999,
    saleStart: '21.10.2024',
    saleEnd: '31.10.2024'
  };

  countdownTime = '4 dana i 11:28:59';

  mainImage = 'assets/tv.jpg'; // Glavna slika
  productImages = [
    'assets/logoKum.jpg',
    'assets/frizider.jpg',
    'assets/tv.jpg',
    'assets/frizider.jpg'
  ];

  currentImageIndex = 0;

  changeMainImage(image: string) {
    this.mainImage = image;
  }

  previousImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    } else {
      this.currentImageIndex = this.productImages.length - 1;
    }
    this.mainImage = this.productImages[this.currentImageIndex];
  }

  nextImage() {
    if (this.currentImageIndex < this.productImages.length - 1) {
      this.currentImageIndex++;
    } else {
      this.currentImageIndex = 0;
    }
    this.mainImage = this.productImages[this.currentImageIndex];
  }
}
