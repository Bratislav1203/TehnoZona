import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  products = [
    { id: 1, name: 'AIWA TV 50" UHD SMART', price: 41616, image: 'assets/tv.jpg' },
    { id: 2, name: 'AIWA TV 55', price: 45234, image: 'assets/tv.jpg' },
    { id: 3, name: 'LG 43UR78003LK LED Ultra HD 4K Smart', price: 45898, image: 'assets/tv.jpg' },
    { id: 4, name: 'LG Smart TV 32LQ63006LA, 32', price: 38521, image: 'assets/tv.jpg' },
    { id: 5, name: 'LG Smart TV 43NANO763QA, 41-48', price: 48597, image: 'assets/tv.jpg' }
  ];


  constructor() { }

  ngOnInit(): void {
  }

}
