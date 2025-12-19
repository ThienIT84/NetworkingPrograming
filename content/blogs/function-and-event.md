---
title: "Hàm và Sự kiện: Cách JavaScript tương tác với người dùng"
date: 2025-12-19T14:00:00+07:00
draft: false
description: "Cách viết hàm và lắng nghe các sự kiện như Click, Hover trên trang web."
image: "/NetworkingPrograming/images/projects/images/"
tags: ["JavaScript", "Events", "Logic"]
categories: ["Web Development"]
---

Làm sao để khi người dùng bấm nút, một thông báo hiện ra? Đó chính là nhờ **Events**.

### 1. Cách định nghĩa hàm (Function)
Chúng ta có hai cách phổ biến hiện nay:
```javascript
// Cách truyền thống
function xinchao() {
    console.log("Chào bạn!");
}

// Arrow function (Hiện đại)
const xinchao = () => console.log("Chào bạn!");