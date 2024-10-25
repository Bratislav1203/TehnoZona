import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.css']
})
export class TabBarComponent implements OnInit {

  showMenu = false;
  constructor() { }

  ngOnInit(): void {
  }


  onTabClick(tab: string) {
    console.log('Clicked tab:', tab);
  }

}
