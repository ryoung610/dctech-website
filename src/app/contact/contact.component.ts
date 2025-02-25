import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as emailjs from 'emailjs-com';



@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contact = { name: '', email: '', subject: '', message: '' };

  submitForm() {
    console.log('Form Submitted:', this.contact);
    alert('Thank you for reaching out! We will get back to you soon.');
    
    // Optionally: Send form data to backend (POST API)
  }
}
