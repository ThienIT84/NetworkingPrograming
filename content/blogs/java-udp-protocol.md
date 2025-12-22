---
title: "Lập trình UDP với Java: Nhanh nhưng không tin cậy?"
date: 2025-12-20T10:00:00+07:00
draft: false
description: "Tìm hiểu sự khác biệt giữa TCP và UDP, cùng cách xây dựng ứng dụng gửi nhận gói tin Datagram trong Java."
image: "/images/projects/udp-protocol.jpg"
tags: ["Java", "UDP", "Networking", "Socket"]
categories: ["Lập trình mạng"]
---

Nếu TCP là một cuộc điện thoại (cần kết nối trước), thì **UDP (User Datagram Protocol)** giống như việc gửi thư qua bưu điện: bạn cứ gửi đi mà không chắc chắn người nhận có nhận được hay không.

### 1. Tại sao lại dùng UDP?
Dù không đảm bảo tin nhắn sẽ đến đích, nhưng UDP có ưu điểm cực lớn: **Tốc độ cực nhanh** vì không cần bắt tay 3 bước (Handshake). Nó thường dùng trong:
* Livestream Video.
* Chơi game online (Liên Minh, CS:GO).
* Gọi thoại VoIP.

### 2. Hai lớp quan trọng trong Java
Khác với `ServerSocket` và `Socket` của TCP, UDP sử dụng:
1. **DatagramSocket:** Công cụ để gửi và nhận gói tin.
2. **DatagramPacket:** Chính là "lá thư" chứa dữ liệu và địa chỉ người nhận.

### 3. Code mẫu gửi dữ liệu (Client)
```java
DatagramSocket socket = new DatagramSocket();
String message = "Hello UDP Server!";
byte[] buffer = message.getBytes();

InetAddress address = InetAddress.getByName("localhost");
DatagramPacket packet = new DatagramPacket(buffer, buffer.length, address, 9876);

socket.send(packet);
System.out.println("Đã gửi gói tin!");
socket.close();