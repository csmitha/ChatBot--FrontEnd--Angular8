Details with screen shots avaialable in below link.
https://java99beginnertoprofessional.blogspot.com/2019/08/chat-bot-sprigboot-websocketsangular-8.html


What we are building? 

Basically, we will create two projects frontend and backend to build chat application POC. 

Springboot Websocket (backend): This project is developed to support WebSocket endpoint at server side with user basic user authentication, registration and saving chat history. 

Tech Stack. 

1)    Java 1.8. 

2)    Spring Boot Rest. 

3)    JPA – Embedded H2 DB. 

4) Swagger 

5)    Maven build.  

6) Swagger 

7) Mockito 

     

Angular8 - StompJs and SockJs (frontend): This project is developed as multipage login, register and home(chat) application. This is developed on Angular 8 and subscribes and exchanges messages over WebSocket. 

Tech Stack. 

1)      Angular 8 .2.2 

2)      Node 12.7 

3)      Stomp and Sockjs. 

  

Building Application 

1) Springboot Websocket (backend):  

Clone application from git  and build Application using maven 

mvn clean install 

mvn spring-boot:run  

Application will run on “9000” port. 

http://localhost:9000 

 

1)     Angular8 - StompJs and SockJs (frontend):  

Clone application from git https://github.com/csmitha/ChatBot---FrontEnd--Angular8/upload and build Application. Please refer to the Tech stack on top. 

 

cd to downloaded application path.  

npm install stompjs; 

npm install sockjs-client 

npm install jquery (just to quickly access the DOM elements) 

npm install.  

npm start. 

Application will start on “4200” port. 

http://localhost:4200  

 

 

Executing Application 

1) user Login Page 

 

 

 

 

 

2) User Registration Page 

 

 

3) Enter username - “TTom”  and  password “123456” on the Login screen to navigate to chat screen.  

 

 

4) Enter username - “JRobert”  and  password “123456” on the Login screen to navigate to chat screen for second user. Let's roll! 

5) Message exchange between different users. 

 

6) Data is persisted on embedded H2 DB. 

 

 
