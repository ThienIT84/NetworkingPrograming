---
title: "Tự làm Chatbot AI tích hợp vào Website bằng Fetch API"
date: 2025-12-19T15:00:00+07:00
draft: false
description: "Hướng dẫn sử dụng JavaScript Fetch API để kết nối với các mô hình ngôn ngữ lớn (LLM)."
image: "/images/projects/chatbot-api.jpg"
tags: ["JavaScript", "API", "Chatbot"]
categories: ["Web Development"]
---

Trong bài viết này, mình sẽ hướng dẫn cách dùng JavaScript để "nói chuyện" với một Server AI thông qua giao thức HTTP (Fetch API).

### 1. Fetch API là gì?
`fetch()` là một hàm có sẵn trong các trình duyệt hiện đại, giúp thực hiện các yêu cầu mạng (Network Request) tương tự như cách chúng ta gửi gói tin trong Lập trình mạng.

### 2. Code mẫu gọi API
Giả sử mình muốn gửi câu hỏi đến một API AI nào đó, code sẽ như sau:

```javascript
async function hoiAI(cauHoi) {
    const url = '[https://api.openai.com/v1/chat/completions](https://api.openai.com/v1/chat/completions)'; // Ví dụ minh họa
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_API_KEY'
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: cauHoi}]
            })
        });

        const data = await response.json();
        console.log("AI trả lời:", data.choices[0].message.content);
        
        // Cập nhật lên giao diện
        document.getElementById("chat-box").innerText = data.choices[0].message.content;

    } catch (error) {
        console.error("Lỗi kết nối:", error);
    }
}