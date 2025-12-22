---
title: "Bảo mật Socket: Tại sao cần SSL/TLS trong Lập trình mạng?"
date: 2025-12-21T09:30:00+07:00
draft: false
description: "Hướng dẫn cách mã hóa dữ liệu truyền tải qua Socket bằng SSL/TLS để tránh bị đánh cắp thông tin."
image: "/images/projects/ssl-tls.jpg"
tags: ["Java", "Security", "SSL", "TLS"]
categories: ["Lập trình mạng"]
---

Trong các bài trước, chúng ta truyền dữ liệu qua Socket bằng văn bản thuần túy (Plaintext). Nếu có ai đó "nghe lén" trên mạng (Sniffing), họ sẽ thấy hết toàn bộ tin nhắn chat của bạn. Để giải quyết vấn đề này, chúng ta cần **SSL/TLS**.

### 1. SSL/TLS là gì?
SSL (Secure Sockets Layer) và phiên bản mới hơn là TLS (Transport Layer Security) là các giao thức giúp mã hóa đường truyền giữa Client và Server. 
* **Privacy:** Không ai đọc được dữ liệu ngoài người gửi và nhận.
* **Integrity:** Đảm bảo dữ liệu không bị thay đổi trên đường đi.

### 2. Sử dụng SSLSocket trong Java
Thay vì dùng `Socket` thông thường, Java hỗ trợ lớp `SSLSocket` thông qua `SSLSocketFactory`.

**Code mẫu phía Server:**
```java
SSLServerSocketFactory ssf = (SSLServerSocketFactory) SSLServerSocketFactory.getDefault();
SSLServerSocket serverSocket = (SSLServerSocket) ssf.createServerSocket(8888);

System.out.println("Secure Server đang đợi kết nối...");
SSLSocket socket = (SSLSocket) serverSocket.accept();