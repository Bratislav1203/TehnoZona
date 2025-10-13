import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent implements OnInit, OnDestroy, OnChanges {
  @Input() brands: { name: string; imgUrl: string; link?: string }[] = [];

  duplicatedBrands: { name: string; imgUrl: string; link?: string }[] = [];
  duplicatedBrandsBottom: { name: string; imgUrl: string; link?: string }[] = [];
  shuffledBrands: { name: string; imgUrl: string; link?: string }[] = [];
  autoScrollInterval: any;
  scrollSpeed = 1;

  ngOnInit(): void {
    // ne radi ništa ovde, jer možda brendovi još nisu stigli
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['brands'] && this.brands?.length > 0) {
      // kad stignu brendovi, pokreni logiku
      this.initializeBrands();
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.autoScrollInterval);
  }

  private initializeBrands(): void {
    this.shuffledBrands = this.shuffleArray([...this.brands]);

    const shuffledTop = this.shuffleArray([...this.brands]);
    const shuffledBottom = this.shuffleArray([...this.brands]);

    this.duplicatedBrands = [...shuffledTop, ...shuffledTop];
    this.duplicatedBrandsBottom = [...shuffledBottom, ...shuffledBottom];

    console.log('🔀 Promešani brendovi:', this.shuffledBrands);

    this.startAutoScroll();
  }

  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  startAutoScroll(): void {
    const tracks = document.querySelectorAll('.slide-track');
    if (!tracks.length) return;

    tracks.forEach((track, index) => {
      let position = 0;
      const direction = index % 2 === 0 ? -1 : 1;

      const interval = setInterval(() => {
        position += direction * this.scrollSpeed;
        (track as HTMLElement).style.transform = `translateX(${position}px)`;

        if (Math.abs(position) >= track.scrollWidth / 2) {
          position = 0;
          (track as HTMLElement).style.transform = `translateX(0px)`;
        }
      }, 20);

      if (index === 0) {
        this.autoScrollInterval = interval;
      }
    });
  }

  scrollNext(): void {
    const track = document.querySelector('.slide-track.top') as HTMLElement;
    if (!track) return;

    const matrix = new DOMMatrixReadOnly(getComputedStyle(track).transform);
    const current = matrix.m41;
    const newPos = current - 250;
    track.style.transition = 'transform 0.4s ease';
    track.style.transform = `translateX(${newPos}px)`;
    setTimeout(() => (track.style.transition = ''), 400);
  }

  scrollPrev(): void {
    const track = document.querySelector('.slide-track.top') as HTMLElement;
    if (!track) return;

    const matrix = new DOMMatrixReadOnly(getComputedStyle(track).transform);
    const current = matrix.m41;
    const newPos = current + 250;
    track.style.transition = 'transform 0.4s ease';
    track.style.transform = `translateX(${newPos}px)`;
    setTimeout(() => (track.style.transition = ''), 400);
  }
}
