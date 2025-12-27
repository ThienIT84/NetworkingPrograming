---
title: "Bảo mật Socket: Tại sao cần SSL/TLS trong Lập trình Mạng và Cách Triển khai trong Java"
date: 2025-12-21T09:30:00+07:00
draft: false
description: "Hướng dẫn chi tiết về SSL/TLS trong lập trình Socket Java, cách mã hóa dữ liệu truyền tải để bảo vệ khỏi nghe lén và tấn công Man-in-the-Middle."
image: "/NetworkingPrograming/images/projects/ssl-tls.jpg"
tags: ["Java", "Security", "SSL/TLS", "Lập trình mạng", "Socket"]
categories: ["Lập trình mạng"]
---

Trong các bài viết trước về lập trình Socket, chúng ta thường truyền dữ liệu dưới dạng văn bản thuần túy (plaintext). Điều này rất nguy hiểm vì bất kỳ ai "nghe lén" (sniffing) trên mạng đều có thể đọc được toàn bộ nội dung, chẳng hạn như tin nhắn chat, mật khẩu hay thông tin nhạy cảm.

<grok-card data-id="5a5c46" data-type="image_card"  data-arg-size="LARGE" ></grok-card>



<grok-card data-id="9742a6" data-type="image_card"  data-arg-size="LARGE" ></grok-card>


Để khắc phục, chúng ta sử dụng **SSL/TLS** – giao thức mã hóa chuẩn được áp dụng rộng rãi (HTTPS chính là HTTP kết hợp TLS).

### 1. SSL/TLS là gì và tại sao cần thiết?

SSL (Secure Sockets Layer) là phiên bản cũ, hiện nay đã được thay thế bởi **TLS (Transport Layer Security)** – phiên bản hiện đại và an toàn hơn. TLS là giao thức mã hóa tầng vận chuyển, nằm trên TCP.

Các lợi ích chính:

- **Bảo mật (Confidentiality)**: Dữ liệu được mã hóa, chỉ người gửi và nhận mới đọc được.
- **Toàn vẹn dữ liệu (Integrity)**: Phát hiện nếu dữ liệu bị thay đổi trên đường truyền.
- **Xác thực (Authentication)**: Xác nhận danh tính Server (và tùy chọn Client) qua chứng chỉ số, ngăn tấn công Man-in-the-Middle (MITM).

Quá trình handshake TLS:

<grok-card data-id="7fb0d8" data-type="image_card"  data-arg-size="LARGE" ></grok-card>



<grok-card data-id="cc4e71" data-type="image_card"  data-arg-size="LARGE" ></grok-card>



<grok-card data-id="2c774d" data-type="image_card"  data-arg-size="LARGE" ></grok-card>


### 2. Triển khai SSL/TLS Socket trong Java

Java hỗ trợ sẵn qua gói `javax.net.ssl`. Thay vì `Socket` và `ServerSocket`, chúng ta dùng `SSLSocket` và `SSLServerSocket`.

Sơ đồ lớp JSSE trong Java:

<grok-card data-id="b900dc" data-type="image_card"  data-arg-size="LARGE" ></grok-card>



<grok-card data-id="464735" data-type="image_card"  data-arg-size="LARGE" ></grok-card>


#### 2.1. Chuẩn bị Keystore (cho Server)

Để Server có chứng chỉ, cần tạo keystore (đối với production nên dùng chứng chỉ từ CA uy tín như Let's Encrypt).

Cách đơn giản cho testing (self-signed):

```bash
keytool -genkeypair -alias mykey -keyalg RSA -keysize 2048 \
        -validity 365 -keystore server-keystore.jks \
        -storepass password -keypass password \
        -dname "CN=localhost, OU=Dev, O=MyBlog, L=Hanoi, ST=Vietnam, C=VN"