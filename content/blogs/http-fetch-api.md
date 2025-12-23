---
title: "HTTP & Fetch API: Cầu nối giữa Client và Web Server"
date: 2025-12-22T08:00:00+07:00
draft: false
description: "Tìm hiểu cách trình duyệt giao tiếp với Server qua giao thức HTTP và cách sử dụng Fetch API trong JavaScript."
image: "/images/projects/http-fetch.jpg"
tags: ["HTTP", "Fetch API", "JavaScript", "Networking"]
categories: ["Web Development"]
---

Nếu Socket là nền tảng để truyền dữ liệu thô, thì **HTTP (Hypertext Transfer Protocol)** là ngôn ngữ chung mà mọi trình duyệt web sử dụng để giao tiếp với các máy chủ trên toàn thế giới.

### 1. HTTP hoạt động như thế nào?
HTTP hoạt động theo mô hình **Request - Response** (Yêu cầu - Phản hồi). Khi bạn nhập một URL, trình duyệt gửi một bản tin yêu cầu đến Server, và Server trả về dữ liệu (thường là HTML, JSON hoặc ảnh).

**Các phương thức phổ biến:**
* **GET:** Lấy dữ liệu từ Server.
* **POST:** Gửi dữ liệu mới lên Server.
* **PUT/PATCH:** Cập nhật dữ liệu hiện có.
* **DELETE:** Xóa dữ liệu.

### 2. Fetch API: Cách hiện đại để gọi Network
Trong JavaScript hiện đại, chúng ta không còn dùng `XMLHttpRequest` cũ kỹ nữa mà chuyển sang dùng **Fetch API**. Nó trả về một `Promise`, giúp code trông sạch sẽ và dễ đọc hơn rất nhiều.

**Ví dụ lấy thông tin từ một API:**
```javascript
fetch('[https://api.example.com/data](https://api.example.com/data)')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Lỗi kết nối:', error));