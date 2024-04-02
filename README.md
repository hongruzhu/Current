<!-- <div align=center>
  <img width="250" src="https://github.com/hongruzhu/Current/assets/121448431/5bd9e381-91b2-4679-8091-b075481343f6">
</div> -->

# Current
A real-time online meeting application, with multi-users video conference, chat room, screen sharing,
whiteboard, recording, and background changing features.

**Website URL (no longer valid)**

https://currentmeet.com

**Demo Account**

* Email: admin@test.com
* Password: Test1234567

**Index Page**

<img width="1024" alt="截圖 2023-05-19 下午5 26 37" src="https://github.com/hongruzhu/Current/assets/121448431/de48e971-c815-4fc8-a709-8fc12e84a3c3">

## Table of Contents

- [Technologies](#technologies)
- [Architecture Diagram](#architecture-diagram)
- [Database Schema](#database-schema)
- [Features](#features)
- [Contact](#contact)
- [Appendix: How does WebRTC work to realize a P2P connection?](#appendix-how-does-webrtc-work-to-realize-a-p2p-connection)

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

## Architecture Diagram

![截圖 2023-06-06 下午1 29 02](https://github.com/hongruzhu/Current/assets/121448431/8ed1e2a8-8c77-44fe-bca8-3c9a227f35f0)

## Database Schema

The transparent part is prepared for future expansion .

![截圖 2023-06-12 下午1 42 54](https://github.com/hongruzhu/Current/assets/121448431/2b48651d-b7e3-43ec-9f37-c14cd43006c6)

## Features
### Multi-users Video Conference
Developed multi-users video conference with webcam and mic toggling by integrating **PeerJS (WebRTC library)** and **Socket.IO**.

![未命名 (1920 × 800 像素)](https://github.com/hongruzhu/Current/assets/121448431/44df6c68-08f4-499f-8e34-fb2e347d3f91)

### Background Changing
Achieved real-time background changing by extracting the person's image from the webcam using **MediaPipe** and utilizing the **Canvas API** for layered rendering and animation.

![Current Usage Footage GIF (4)](https://github.com/hongruzhu/Current/assets/121448431/038148ec-8846-4607-8f1e-4fa314d51ffd)

### Screen Sharing 
Implemented screen sharing with audio using **PeerJS** and **Socket.IO**.

![Current Usage Footage GIF (1)](https://github.com/hongruzhu/Current/assets/121448431/287cebda-f66b-4907-a0b9-ec781f886806)

### Collaborative Whiteboard
Created a collaborative whiteboard with **Canvas API** and **Socket.IO**, effectively managing race conditions with a **queue**.

![Current Usage Footage GIF (2)](https://github.com/hongruzhu/Current/assets/121448431/6ca5c850-6a78-49b7-8cea-216d659aa5c2)

### Real-time Chatroom
Developed a real-time chatroom with **Socket.IO** for communication among users.

![Current Usage Footage GIF](https://github.com/hongruzhu/Current/assets/121448431/821bf512-467c-4a46-b694-f8ea320a73ee)

### Conference Recording
Realized conference recording by leveraging the **Web Audio API** to merge screen video and mic audio and utilizing the **MediaStream Recording API** to record and generate conference videos.

![Current Usage Footage GIF (3)](https://github.com/hongruzhu/Current/assets/121448431/822537b7-5d80-4d6d-a0fa-850ad350c346)

## Contact
Hong-Ru Zhu

Email: hongru07@gmail.com

Linkedin: https://www.linkedin.com/in/hongruzhu/

## Appendix: How does WebRTC work to realize a P2P connection?

![截圖 2023-05-26 下午7 58 50](https://github.com/hongruzhu/Current/assets/121448431/f9a67865-d4b1-4ae7-8c8e-26a2f0ec6312)

**Step 1 & 2:** 

User A and B exchange their Session Description Protocol (SDP) through a Signaling Server. Each user creates their own SDP, which contains information about their media streams, such as audio and video.

**What's Session Description Protocol (SDP)?**
* SDP contains detailed information about media streams, such as audio and video, including encoding formats, transport protocols, and port numbers. It describes the parameters required to establish a connection between two peers.
* The purpose of exchanging SDPs through the Signaling Server is to enable the peers to mutually confirm each other's media requirements and capabilities, in order to establish a suitable connection.
* During the SDP exchange, the peers can also negotiate, for example, to choose the most appropriate encoding format and transport protocol, ensuring smooth communication.

**Step 3:**

User A and B individually collect Interactive Connectivity Establishment (ICE) candidates. This involves obtaining their public IP address and port from a Session Traversal Utilities for NAT (STUN) server and acquiring relay IP address and port from a Traversal Using Relays around NAT (TURN) server when STUN fails to perform NAT traversal.

**Step 4 & 5:** 

User A and B exchange their ICE candidates through the Signaling Server.

**Step 6:**

The optimal candidates for establishing a connection are selected from the exchanged ICE candidates. The connection is established using UDP. If STUN-based NAT traversal fails, the connection resorts to using TURN relay, although this is no longer considered a true P2P connection.

Once the connection is successfully established, User A and B can commence data transmission to each other. 🥳


