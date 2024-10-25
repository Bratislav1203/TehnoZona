import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.css']
})
export class SubmenuComponent implements OnInit {

  @Input() title: string = '';
  @Input() submenus: any[] | null = null;

  menuItems = [
    { title: 'Televizori', link: '/televizori' },
    { title: 'Bela Tehnika', link: '/bela-tehnika' },
    { title: 'Računari', link: '/racunari' },
    { title: 'Smart Telefoni', link: '/telefoni' },
    { title: 'Mali Kućni Aparati', link: '/kucni-aparati' },
    { title: 'Grejanje', link: '/grejanje' }
  ];

  showSubmenu: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }
  toggleSubmenu() {
    this.showSubmenu = !this.showSubmenu;
  }

}
