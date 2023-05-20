<!-- <div align=center>
  <img width="250" src="https://github.com/hongruzhu/Current/assets/121448431/5bd9e381-91b2-4679-8091-b075481343f6">
</div> -->

# Current
A real-time online meeting application, with multi-users video conference, chat room, screen sharing,
whiteboard, recording, and background changing features.

**Website URL**

https://currentmeet.com

**Demo Account**

* Email: admin@test.com
* Password: Test1234567

**Index Page**

<img width="1024" alt="截圖 2023-05-19 下午5 26 37" src="https://github.com/hongruzhu/Current/assets/121448431/de48e971-c815-4fc8-a709-8fc12e84a3c3">

## Table of Contents

- [Features](#features)
- [Architecture Diagram](#architecture-diagram)
- [Database Schema](#database-schema)
- [Technologies](#technologies)
- [Contact](#contact)

## Features
### Multi-users Video Conference
Developed multi-users video conference with webcam and mic toggling by integrating PeerJS (WebRTC library) and Socket.IO.

![未命名 (1920 × 800 像素)](https://github.com/hongruzhu/Current/assets/121448431/44df6c68-08f4-499f-8e34-fb2e347d3f91)

### Screen Sharing 
Implemented screen sharing with audio using PeerJS and Socket.IO.

![Current Usage Footage GIF (1)](https://github.com/hongruzhu/Current/assets/121448431/287cebda-f66b-4907-a0b9-ec781f886806)

### Real-time Chatroom
Developed a real-time chatroom with Socket.IO for communication among users.

![Current Usage Footage GIF](https://github.com/hongruzhu/Current/assets/121448431/821bf512-467c-4a46-b694-f8ea320a73ee)

### Collaborative Whiteboard
Created a collaborative whiteboard with Canvas API and Socket.IO, effectively managing race conditions with a queue.

![Current Usage Footage GIF (2)](https://github.com/hongruzhu/Current/assets/121448431/6ca5c850-6a78-49b7-8cea-216d659aa5c2)

### Conference Recording
Realized conference recording by leveraging the Web Audio API to merge screen video and mic audio and utilizing the MediaStream Recording API to record and generate conference videos.

![Current Usage Footage GIF (3)](https://github.com/hongruzhu/Current/assets/121448431/822537b7-5d80-4d6d-a0fa-850ad350c346)

### Background Changing
Achieved real-time background changing by extracting the person's image from the webcam using MediaPipe and utilizing the Canvas API for layered rendering and animation.


## Architecture Diagram
![截圖 2023-05-20 上午12 34 47](https://github.com/hongruzhu/Current/assets/121448431/0e414f08-c69b-4d05-be4b-683bab2fdb28)

## Database Schema
![Current Backend Architecture](https://github.com/hongruzhu/Current/assets/121448431/3a7d2886-0958-4f8d-9109-93e0079cc9a7)

## Technologies
### Back-End
* Node.js
* Express
* NGINX
* Socket.IO
### Front-End
* JavaScript
* HTML
* jQuery
* Tailwind CSS
* WebRTC
* MediaPipe (Google ML Toolkits)
### Database
* MySQL
* Redis
### Cloud Service (AWS)
* Elastic Compute Cloud (EC2)
* Simple Storage Service (S3)
* Relational Database Service (RDS)
* ElastiCache for Redis
* CloudFront
* CloudWatch
* Route 53
* Elastic Load Balancer (ELB)
* Auto Scaling
### Test & CICD
* Jest
* GitHub Actions
### Others
* Git / GitHub
* MVC design pattern
* ESLint
* Trello (Scrum)

## Contact
Hong-Ru Zhu

Email: hongru07@gmail.com

Linkedin: https://www.linkedin.com/in/hongruzhu/


