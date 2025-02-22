import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // Add this for routing

@Component({
  selector: 'app-navbar',
  standalone: true, // Add this
  imports: [RouterLink], // Include RouterLink if using routerLink
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'] // Fix typo: styleUrl -> styleUrls
})
export class NavbarComponent {}