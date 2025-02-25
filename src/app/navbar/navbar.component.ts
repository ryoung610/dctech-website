import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router'; // Add this for routing
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true, // Add this
  imports: [RouterLink, CommonModule], // Include RouterLink if using routerLink
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'] // Fix typo: styleUrl -> styleUrls
})
export class NavbarComponent implements OnInit {

  isSticky: boolean = false;

  constructor() {}

  ngOnInit() {}

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (window.pageYOffset > 100) {
    this.isSticky = true;
  } else {
    this.isSticky = false;
  }
  }
}