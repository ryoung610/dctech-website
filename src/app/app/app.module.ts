import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; // Needed for browser-based applications
import { RouterModule } from '@angular/router'; // Import RouterModule for routing
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from '../app.routes';
import { AppComponent } from '../app.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { ContactComponent } from '../contact/contact.component';
import { ServicesComponent } from '../services/services.component';
import { HomeComponent } from '../home/home.component'; // Import HomeComponent 
import { AboutComponent } from '../about/about.component'; // Import AboutComponent




@NgModule({
  declarations: [
    AppComponent, // Declare the root component
    NavbarComponent, // Declare NavbarComponent
    FooterComponent, // Declare FooterComponent
    HomeComponent, // 🛑 Add HomeComponent
    AboutComponent, // 🛑 Add AboutComponent
    ServicesComponent, // 🛑 Add ServicesComponent
    ContactComponent // 🛑 Add ContactComponent
  ],
  imports: [
    BrowserModule, // Import BrowserModule for browser environments
    AppRoutingModule, // Import routing module
    CommonModule, // CommonModule for common Angular directives like ngIf, ngFor
    RouterModule, // Import RouterModule for routing functionality
  ],
 
  providers: [],
  bootstrap: [AppComponent] // Bootstraps the root component
})
export class AppModule { }
