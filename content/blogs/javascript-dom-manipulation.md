---
title: "DOM Manipulation: Thay đổi trang web theo ý muốn"
date: 2025-12-19T10:00:00+07:00
draft: false
description: "Hướng dẫn cách dùng JavaScript để thêm, xóa, sửa các phần tử HTML trên trang."
image: "NetworkingPrograming/images/projects/js-dom.jpg"
tags: ["JavaScript", "DOM", "Frontend"]
categories: ["Web Development"]
---

**DOM** là cầu nối cho phép JavaScript "nhào nặn" cấu trúc của trang web sau khi nó đã tải xong.

### 1. Truy xuất phần tử    
Chúng ta có thể lấy bất kỳ thẻ HTML nào thông qua ID hoặc Class:
```javascript
const title = document.getElementById("main-title");
const items = document.querySelectorAll(".list-item");