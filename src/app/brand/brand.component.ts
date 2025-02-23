import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent {
  @Input() brand!: { name: string; imgUrl: string };
}
