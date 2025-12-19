---
title: "TensorFlow.js: Mang sức mạnh Deep Learning lên trình duyệt"
date: 2025-12-19T15:00:00+07:00
draft: false
description: "Chạy mô hình AI trực tiếp trên trình duyệt web bằng JavaScript mà không cần Backend Python."
image: "/images/projects/tfjs.jpg"
tags: ["JavaScript", "AI", "Deep Learning", "TensorFlow"]
categories: ["Trí tuệ nhân tạo"]
---

Là một người yêu thích Deep Learning, mình thường dùng Python để train model. Nhưng để đưa model đó đến tay người dùng web, **TensorFlow.js** là một lựa chọn tuyệt vời.

### 1. TensorFlow.js là gì?
Đây là một thư viện JavaScript do Google phát triển, cho phép bạn định nghĩa, huấn luyện và chạy các mô hình Machine Learning ngay trên trình duyệt (Client-side).

### 2. Tại sao lại dùng nó?
* **Bảo mật:** Dữ liệu không cần gửi về server (ví dụ nhận diện khuôn mặt).
* **Tương tác thời gian thực:** Độ trễ cực thấp vì chạy ngay trên máy người dùng.

### 3. Ví dụ: Tạo một Tensor đơn giản
Để sử dụng, chúng ta chỉ cần nhúng thẻ script CDN vào HTML, sau đó viết code JS như sau:

```javascript
// Định nghĩa model đơn giản: y = 2x - 1
const model = tf.sequential();
model.add(tf.layers.dense({units: 1, inputShape: [1]}));

model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

// Tạo dữ liệu train
const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);

// Train model
await model.fit(xs, ys, {epochs: 500});

// Dự đoán giá trị mới (x = 10)
model.predict(tf.tensor2d([10], [1, 1])).print();