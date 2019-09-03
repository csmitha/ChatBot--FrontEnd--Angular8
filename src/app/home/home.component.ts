import { Component, OnInit, Injectable, ViewChild, ElementRef, Input, Inject, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Router } from '@angular/router';


import { User } from '../_models';
import { DataService, AlertService } from '../_services';


@Injectable({ providedIn: 'root' })
@Component({ templateUrl: './home.component.html', styleUrls: ['./home.component.css'] })
export class HomeComponent implements OnInit {
  @ViewChild('message') messageInput: ElementRef;
  currentUser: User;
  users = [];
  loading = false;

  messageForm;
  messages = [];
  greeting: any;

  webSocketEndPoint: string = 'http://localhost:9000/ws';

  topic: string = "/topic/chatting";
  stompClient: any;

  @Input('routerLink') link: string;
  constructor(
    private dataService: DataService,
    private router: Router,
    private alertService: AlertService,
    private el: ElementRef, @Inject(Window) private win: Window
  ) {

    this.messageForm = new FormGroup({
      message: new FormControl()
    });

  }
 

  ngOnInit() {
    this.currentUser = this.dataService.user;
    //this.users[];
    if (typeof this.currentUser === 'undefined') {

      this.router.navigate(['/login']);
      const error = "Invalid Session - Please Login or register";
      this.alertService.error(error);
      this.loading = false;
    } else {

      // this.users = this.dataService.user;
      this._connect();
    }


  }

  ngAfterViewInit() {
    this.delay(2000);
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => this._sendUserLoginMsg());
  }

  _connect() {
    console.log("Initialize WebSocket Connection");
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect({}, function (frame) {
      _this.stompClient.subscribe(_this.topic, function (sdkEvent) {
        _this.onMessageReceived(sdkEvent);
      });
      //_this.stompClient.reconnect_delay = 2000;
    }, this.errorCallBack);
    var connectingElement = document.querySelector('.connecting');
    connectingElement.classList.add('hidden');
  };

  _disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
      this.dataService.user = null;
      this.router.navigate(['/login']);
      const error = "Session disconnected - Please Login";
      this.alertService.error(error);
      this.loading = false;
    }
    console.log("Disconnected");
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
      if (typeof this._connect() === 'undefined') {
        this.router.navigate(['/login']);
        const error = "Session disconnected - Please Login";
        this.alertService.error(error);
        this.loading = false;
      } else {
        this._connect();
      }

    }, 5000);
  }

  /**
   * Send message to sever via web socket
   * @param {*} message 
   */
  _send(message) {
    console.log("calling Send Message api via web socket");
    var chatMessage = {
      sender: this.currentUser.username,
      userName: this.currentUser.username,
      firstName: this.currentUser.firstName,
      lastName: this.currentUser.lastName,
      content: message,
      type: 'CHAT'
    };

    this.stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
    this.messageInput.nativeElement.value = '';
  }

  _sendUserLoginMsg() {
    console.log("calling User Sign in Message api via web socket");
    var chatMessage = {
      sender: this.currentUser.username,
      userName: this.currentUser.username,
      firstName: this.currentUser.firstName,
      lastName: this.currentUser.lastName,
      content: "user Logged In",
      type: 'JOIN'
    };

    this.stompClient.send("/app/join", {}, JSON.stringify(chatMessage));
    this.messageInput.nativeElement.value = '';
  }


  onMessageReceived(message) {
    console.log("Message Recieved from Server :: " + message);
    var message = JSON.parse(message.body);

    var messageElement = document.createElement('li');

    if (message.type === 'JOIN') {
      messageElement.classList.add('event-message');
      message.content = message.sender + ' joined!';
    } else if (message.type === 'LEAVE') {
      messageElement.classList.add('event-message');
      message.content = message.sender + ' left!';
    } else {
      messageElement.classList.add('chat-message');

      var usernameElement = document.createElement('span');
      var usernameText = document.createTextNode(message.firstName + " " + message.lastName);
      usernameElement.appendChild(usernameText);
      usernameElement.style['font-weight'] = 'bold';
      messageElement.appendChild(usernameElement);

    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);
    textElement.style['background-color'] = this.getAvatarColor(message.sender);
    if (message.type === 'JOIN') { textElement.style['text-align'] = 'center'; }

    messageElement.appendChild(textElement);
    var messageArea = document.querySelector('#messageArea');
    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;

  }

  getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
      hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var colors = [
      '#8c93ce', '#d3caa5', '#d6c3bf', '#c08aa9',
      '#eccac8', '#758d91', '#dde2af', '#8671b6'
    ];
    var index = Math.abs(hash % colors.length);
    return colors[index];
  }


}
