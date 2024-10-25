import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ad-banner',
  templateUrl: './ad-banner.component.html',
  styleUrls: ['./ad-banner.component.css']
})
export class AdBannerComponent implements OnInit {

  ads = [
    {
      image: 'assets/adbanner.jpg',
      title: 'Specijalna ponuda za televizore',
      description: 'Popust do 30% na sve televizore! Ponuda traje do kraja meseca.',
      buttonText: 'Pogledaj ponudu',
      link: '/'
    },
    {
      image: 'assets/adbanner.jpg',
      title: 'Bela Tehnika na akciji',
      description: 'Uštedite na kupovini bele tehnike. Pogledajte aktuelne popuste.',
      buttonText: 'Saznaj više',
      link: '/'
    },
    {
      image: 'assets/adbanner.jpg',
      title: 'Smart telefoni - Top cene',
      description: 'Najnoviji modeli smart telefona po najpovoljnijim cenama.',
      buttonText: 'Kupi sada',
      link: '/'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onAdClick(link: string) {
    window.location.href = link; // Preusmeravanje na stranicu reklame
  }

}
