---
title: "Xử lý đa luồng: Để Server phục vụ hàng ngàn khách hàng"
date: 2025-12-19T14:00:00+07:00
draft: false
description: "Cách sử dụng Thread trong Java để xây dựng Server có thể kết nối nhiều Client cùng lúc."
image: "/images/projects/multithread.png"
tags: ["Java", "Thread", "Socket"]
categories: ["Lập trình mạng"]
---

Một Server cơ bản chỉ có thể tiếp một Client tại một thời điểm. Vậy làm sao để xây dựng một phòng Chat có 100 người? Câu trả lời chính là **Multi-threading** (Đa luồng).

### 1. Vấn đề của Server đơn luồng
Khi Server đang xử lý lệnh `accept()` hoặc đang đợi dữ liệu từ Client A, nó sẽ bị "treo" (block) và không thể tiếp nhận Client B. Điều này khiến ứng dụng mạng trở nên vô dụng trong thực tế.

### 2. Giải pháp: Mỗi Client một luồng
Cứ mỗi khi có một kết nối mới (`socket = serverSocket.accept()`), chúng ta sẽ đẩy Socket đó vào một **Thread** riêng biệt để xử lý.

### 3. Cấu trúc Code mẫu
```java
while (true) {
    Socket socket = serverSocket.accept();
    System.out.println("Client mới kết nối!");
    
    // Tạo một thread mới để xử lý client này
    new Thread(new ClientHandler(socket)).start();
}