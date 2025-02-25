import { Component, OnInit } from '@angular/core';
declare var WebChat: any;


@Component({
  selector: 'app-chat',
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  ngOnInit(): void {
    const secret = 'YOUR_WEB_CHAT_SECRET'; // Replace with your Azure Bot Service Secret
    WebChat.renderWebChat(
      {
        directLine: WebChat.createDirectLine({ secret }),
        userID: 'User',
        username: 'Guest',
      },
      document.getElementById('chatbot-container')
    );
  }
}
