---
title: "Java Socket: Cánh cửa vào thế giới Lập trình mạng"
date: 2025-12-19T10:00:00+07:00
draft: false
description: "Tìm hiểu cơ bản về Socket trong Java và cách thức hoạt động của mô hình Client-Server."
image: "/NetworkingPrograming/images/projects/chat-app.jpg"
tags: ["Java", "Network", "Socket"]
categories: ["Lập trình mạng"]
---

Chào mọi người, bài viết đầu tiên trên Blog này mình muốn dành để nói về **Socket** – khái niệm nền tảng nhất khi học môn Lập trình mạng.

### 1. Socket là gì?
Nếu coi mạng Internet là một hệ thống bưu điện khổng lồ, thì **Socket** chính là "cửa sổ" hoặc "cổng" để các ứng dụng gửi và nhận thư. Trong Java, Socket cho phép hai máy tính giao tiếp với nhau qua giao thức TCP hoặc UDP.

### 2. Mô hình hoạt động Client - Server
Để giao tiếp diễn ra, chúng ta cần hai phía:
* **Server (Máy chủ):** Luôn ở trạng thái "lắng nghe" (listen) các kết nối từ bên ngoài.
* **Client (Máy khách):** Chủ động gửi yêu cầu kết nối đến Server.



### 3. Ví dụ Code đơn giản trong Java

Dưới đây là đoạn code khởi tạo một Server cơ bản lắng nghe tại cổng **1234**:

```java
// Phía Server
try (ServerSocket serverSocket = new ServerSocket(1234)) {
    System.out.println("Server đang chờ kết nối...");
    Socket socket = serverSocket.accept(); // Chấp nhận kết nối
    System.out.println("Đã có máy khách kết nối!");
} catch (IOException e) {
    e.printStackTrace();
}