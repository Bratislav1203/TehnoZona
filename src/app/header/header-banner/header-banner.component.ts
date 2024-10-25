import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-banner',
  templateUrl: './header-banner.component.html',
  styleUrls: ['./header-banner.component.css']
})
export class HeaderBannerComponent implements OnInit {
  lastScrollTop = 0;
  isHeaderVisible = true;
  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScrollTop === 0) {
      // At the top of the page
      this.isHeaderVisible = true;
    } else if (currentScrollTop > this.lastScrollTop) {
      // Scrolling down
      this.isHeaderVisible = false;
    } else if (currentScrollTop < this.lastScrollTop) {
      // Scrolling up
      this.isHeaderVisible = true;
    }

    this.lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // For Mobile or negative scrolling
  }

}
