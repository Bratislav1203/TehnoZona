import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  products = [
    { name: 'AIWA TV 50" UHD SMART', price: 41616, image: 'assets/tv.jpg' },
    { name: 'AIWA TV 55', price: 45234, image: 'assets/tv.jpg' },
    { name: 'LG 43UR78003LK LED Ultra HD 4K Smart', price: 45898, image: 'assets/tv.jpg' },
    { name: 'LG Smart TV 32LQ63006LA, 32', price: 38521, image: 'assets/tv.jpg' },
    { name: 'LG Smart TV 43NANO763QA, 41-48', price: 48597, image: 'assets/tv.jpg' }
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
