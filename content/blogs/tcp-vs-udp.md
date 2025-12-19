---
title: "TCP và UDP: Chọn 'ngựa' nào cho ứng dụng mạng?"
date: 2025-12-19T14:00:00+07:00
draft: false
description: "So sánh hai giao thức truyền tải phổ biến nhất và các trường hợp sử dụng trong thực tế."
image: "NetworkingPrograming/images/projects/tcp-udp.jpg"
tags: ["Java", "Network", "Protocol"]
categories: ["Lập trình mạng"]
---

Trong lập trình mạng, việc chọn lựa giữa **TCP** và **UDP** cũng giống như việc bạn chọn gửi thư bảo đảm hay gửi tin nhắn nhanh vậy. Mỗi cái đều có ưu và nhược điểm riêng.

### 1. TCP (Transmission Control Protocol)
TCP được gọi là giao thức "hướng kết nối". Nó đảm bảo dữ liệu gửi đi sẽ đến nơi chính xác, đầy đủ và đúng thứ tự.
* **Ưu điểm:** Tin cậy, không mất dữ liệu.
* **Ứng dụng:** Web (HTTP), Email (SMTP), Truyền file (FTP).

### 2. UDP (User Datagram Protocol)
Ngược lại, UDP là giao thức "không kết nối". Nó cứ gửi đi mà không cần biết phía bên kia có nhận được hay không.
* **Ưu điểm:** Cực nhanh, độ trễ thấp.
* **Ứng dụng:** Livestream, Game online, Gọi video (VoIP).

### 3. Triển khai trong Java
Trong Java, chúng ta dùng `Socket` cho TCP và `DatagramSocket` cho UDP.

**Ví dụ gửi tin nhắn UDP:**
```java
DatagramSocket ds = new DatagramSocket();
String str = "Chào UDP!";
InetAddress ip = InetAddress.getByName("127.0.0.1");

DatagramPacket dp = new DatagramPacket(str.getBytes(), str.length(), ip, 3000);
ds.send(dp);
ds.close();