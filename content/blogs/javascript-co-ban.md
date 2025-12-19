---
title: "JavaScript Căn Bản: Những bước chân đầu tiên"
date: 2025-12-19T09:00:00+07:00
draft: false
description: "Tìm hiểu về biến (var, let, const) và các kiểu dữ liệu cơ bản trong JavaScript."
image: "/NetworkingPrograming/images/projects/js-basic.jpg"
tags: ["JavaScript", "Frontend", "Programming"]
categories: ["Web Development"]
---

Nếu Java là "xương sống" của hệ thống thì JavaScript chính là "cơ bắp" giúp trang web hoạt động linh hoạt.

### 1. Khai báo biến: var, let hay const?
Trong JS hiện đại, chúng ta ưu tiên dùng `let` và `const`:
* **const:** Dùng cho các giá trị không đổi.
* **let:** Dùng cho các biến có thể thay đổi giá trị.
* **var:** Cách cũ, hiện nay ít dùng do vấn đề về scope (phạm vi).

### 2. Các kiểu dữ liệu quan trọng
JS là ngôn ngữ "loosely typed", nghĩa là bạn không cần khai báo kiểu dữ liệu như Java:
```javascript
let name = "Thanh Thiện"; // String
let age = 20;           // Number
let isStudent = true;    // Boolean