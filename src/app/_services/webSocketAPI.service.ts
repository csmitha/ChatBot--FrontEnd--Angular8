import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class WebSocketAPIService {
    //webSocketEndPoint: string = 'http://localhost:8080/ws';
    webSocketEndPoint: string = 'http://localhost:9000/ws';
    
   // topic: string = "/topic/greetings";
    topic: string = "/topic/greeting";
    stompClient: any;

    constructor (
        //private homeComponent:HomeComponent
    ){
       
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
    };

    _disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log("Disconnected");
    }

    // on error, schedule a reconnection attempt
    errorCallBack(error) {
        console.log("errorCallBack -> " + error)
        setTimeout(() => {
            this._connect();
        }, 5000);
    }

	/**
	 * Send message to sever via web socket
	 * @param {*} message 
	 */
    _send(message) {
        console.log("calling logout api via web socket");
        var chatMessage = {            
            content: message,
            type: 'CHAT'
        };

        this.stompClient.send("/app/hello", {}, JSON.stringify(chatMessage));
    }

    onMessageReceived(message) {
        console.log("Message Recieved from Server :: " + message);        
        //this.homeComponent.handleMessage(JSON.stringify(message.body));
    }
}