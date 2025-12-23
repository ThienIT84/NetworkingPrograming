---
title: "TensorFlow.js: Mang sức mạnh Deep Learning lên trình duyệt"
date: 2025-12-19T15:00:00+07:00
draft: false
description: "Hướng dẫn chi tiết về TensorFlow.js - thư viện Machine Learning mạnh mẽ cho JavaScript, cách training models, sử dụng pre-trained models, và deploy AI trực tiếp trên browser."
image: "/NetworkingPrograming/images/projects/tfjs.jpg"
tags: ["JavaScript", "AI", "Deep Learning", "TensorFlow", "Machine Learning"]
categories: ["Trí tuệ nhân tạo"]
---

## Giới thiệu

Trong thời đại AI bùng nổ, việc chạy các mô hình Machine Learning không còn giới hạn ở Python và server nữa. **TensorFlow.js** đã mở ra kỷ nguyên mới: **AI chạy ngay trên trình duyệt web**, không cần backend, không cần cài đặt gì cả. Bài viết này sẽ đưa bạn từ những khái niệm cơ bản đến việc xây dựng ứng dụng AI thực tế với TensorFlow.js.

## 1. TensorFlow.js là gì?

### 1.1. Định nghĩa và lịch sử

**TensorFlow.js** là một thư viện JavaScript mã nguồn mở do Google phát triển, cho phép:
- **Định nghĩa** (define) models
- **Huấn luyện** (train) models
- **Chạy** (run) models

Tất cả ngay trên trình duyệt web hoặc Node.js, sử dụng WebGL để tăng tốc tính toán.

**Timeline:**
- **2017**: TensorFlow.js ra đời (ban đầu tên deeplearn.js)
- **2018**: Chính thức merge vào TensorFlow ecosystem
- **2019-2025**: Liên tục cập nhật, hỗ trợ nhiều models và platforms

### 1.2. Tại sao dùng TensorFlow.js?

#### Ưu điểm:

✅ **Privacy (Bảo mật)**: 
- Dữ liệu không cần gửi lên server
- Xử lý local → bảo vệ privacy người dùng
- Ví dụ: Nhận diện khuôn mặt, phân tích ảnh y tế

✅ **Low Latency (Độ trễ thấp)**:
- Không cần round-trip đến server
- Phản hồi tức thì
- Ví dụ: Real-time pose detection, gesture recognition

✅ **Accessibility (Dễ tiếp cận)**:
- Chạy trên mọi thiết bị có browser
- Không cần cài đặt Python, CUDA, etc.
- Cross-platform: Windows, Mac, Linux, Mobile

✅ **Cost-effective (Tiết kiệm chi phí)**:
- Giảm tải cho server
- Tận dụng GPU của client
- Scalable: Càng nhiều users, càng nhiều computing power

#### Nhược điểm:

❌ **Performance**: Chậm hơn Python + GPU server (nhưng đủ cho nhiều use cases)
❌ **Model size**: Cần tối ưu để tải nhanh qua mạng
❌ **Training**: Training models lớn vẫn nên dùng Python

### 1.3. Kiến trúc TensorFlow.js

```
┌─────────────────────────────────────┐
│     TensorFlow.js Application       │
├─────────────────────────────────────┤
│   Layers API (Keras-like, high-level)│
├─────────────────────────────────────┤
│   Core API (Low-level operations)   │
├─────────────────────────────────────┤
│         Backend (WebGL/CPU)         │
└─────────────────────────────────────┘
```

## 2. Cài đặt và Setup

### 2.1. Cài đặt qua CDN (Nhanh nhất)

```html
<!DOCTYPE html>
<html>
<head>
    <title>TensorFlow.js Demo</title>
    <!-- TensorFlow.js -->
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest"></script>
</head>
<body>
    <h1>TensorFlow.js Demo</h1>
    
    <script>
        // Kiểm tra TensorFlow.js đã load
        console.log('TensorFlow.js version:', tf.version.tfjs);
        
        // Tạo tensor đơn giản
        const tensor = tf.tensor([1, 2, 3, 4]);
        tensor.print();
    </script>
</body>
</html>
```

### 2.2. Cài đặt qua NPM (Cho projects lớn)

```bash
npm install @tensorflow/tfjs

# Hoặc chỉ cần backend cụ thể
npm install @tensorflow/tfjs-node  # Node.js backend
npm install @tensorflow/tfjs-node-gpu  # Node.js với GPU
```

```javascript
// Import trong JavaScript
import * as tf from '@tensorflow/tfjs';

// Hoặc Node.js
const tf = require('@tensorflow/tfjs-node');
```

## 3. Tensors - Khái niệm cơ bản

### 3.1. Tensor là gì?

**Tensor** là cấu trúc dữ liệu cơ bản trong TensorFlow - một mảng đa chiều:

- **Scalar** (0D tensor): Một số duy nhất
- **Vector** (1D tensor): Mảng 1 chiều
- **Matrix** (2D tensor): Mảng 2 chiều
- **3D+ tensor**: Mảng nhiều chiều

```javascript
// Scalar (0D)
const scalar = tf.scalar(42);
scalar.print(); // Tensor: 42

// Vector (1D)
const vector = tf.tensor1d([1, 2, 3, 4, 5]);
vector.print(); // Tensor: [1, 2, 3, 4, 5]

// Matrix (2D)
const matrix = tf.tensor2d([[1, 2], [3, 4], [5, 6]], [3, 2]);
matrix.print();
// Tensor:
//   [[1, 2],
//    [3, 4],
//    [5, 6]]

// 3D Tensor (ví dụ: RGB image)
const image = tf.tensor3d([
    [[255, 0, 0], [0, 255, 0]],
    [[0, 0, 255], [255, 255, 0]]
], [2, 2, 3]); // [height, width, channels]

// Tạo tensor từ array
const arr = [1, 2, 3, 4];
const tensor = tf.tensor(arr);

// Với shape cụ thể
const shaped = tf.tensor([1, 2, 3, 4, 5, 6], [2, 3]);
shaped.print();
// Tensor:
//   [[1, 2, 3],
//    [4, 5, 6]]
```

### 3.2. Tensor Operations

```javascript
// Arithmetic operations
const a = tf.tensor1d([1, 2, 3, 4]);
const b = tf.tensor1d([10, 20, 30, 40]);

// Cộng
const sum = a.add(b); // hoặc tf.add(a, b)
sum.print(); // [11, 22, 33, 44]

// Trừ
const diff = a.sub(b);
diff.print(); // [-9, -18, -27, -36]

// Nhân
const product = a.mul(b);
product.print(); // [10, 40, 90, 160]

// Chia
const quotient = b.div(a);
quotient.print(); // [10, 10, 10, 10]

// Matrix multiplication
const m1 = tf.tensor2d([[1, 2], [3, 4]]);
const m2 = tf.tensor2d([[5, 6], [7, 8]]);
const matmul = m1.matMul(m2);
matmul.print();
// [[19, 22],
//  [43, 50]]

// Element-wise operations
const squared = a.square();
squared.print(); // [1, 4, 9, 16]

const sqrt = tf.sqrt(tf.tensor1d([1, 4, 9, 16]));
sqrt.print(); // [1, 2, 3, 4]

// Aggregations
const tensor = tf.tensor1d([1, 2, 3, 4, 5]);
tensor.sum().print(); // 15
tensor.mean().print(); // 3
tensor.max().print(); // 5
tensor.min().print(); // 1
```

### 3.3. Memory Management

**Quan trọng**: TensorFlow.js không tự động garbage collect tensors!

```javascript
// ❌ BAD: Memory leak
function createTensors() {
    const a = tf.tensor1d([1, 2, 3]);
    const b = tf.tensor1d([4, 5, 6]);
    const c = a.add(b);
    return c; // a và b không được dispose!
}

// ✅ GOOD: Manual dispose
function createTensorsCorrect() {
    const a = tf.tensor1d([1, 2, 3]);
    const b = tf.tensor1d([4, 5, 6]);
    const c = a.add(b);
    
    a.dispose();
    b.dispose();
    
    return c;
}

// ✅ BETTER: tf.tidy() - Tự động cleanup
function createTensorsTidy() {
    return tf.tidy(() => {
        const a = tf.tensor1d([1, 2, 3]);
        const b = tf.tensor1d([4, 5, 6]);
        const c = a.add(b);
        return c; // Chỉ c được giữ lại, a và b tự động dispose
    });
}

// Kiểm tra memory
console.log('Tensors in memory:', tf.memory().numTensors);
```

## 4. Building Models

### 4.1. Sequential Model (Đơn giản nhất)

```javascript
// Tạo model tuần tự (sequential)
const model = tf.sequential();

// Thêm layers
model.add(tf.layers.dense({
    units: 10,           // 10 neurons
    activation: 'relu',  // ReLU activation
    inputShape: [5]      // Input: 5 features
}));

model.add(tf.layers.dense({
    units: 5,
    activation: 'relu'
}));

model.add(tf.layers.dense({
    units: 1,            // Output: 1 value
    activation: 'sigmoid' // Sigmoid cho binary classification
}));

// Compile model
model.compile({
    optimizer: 'adam',
    loss: 'binaryCrossentropy',
    metrics: ['accuracy']
});

// Xem summary
model.summary();
```

### 4.2. Ví dụ: Linear Regression (y = 2x - 1)

```javascript
// 1. Tạo model
const model = tf.sequential();
model.add(tf.layers.dense({units: 1, inputShape: [1]}));

// 2. Compile
model.compile({
    optimizer: 'sgd',
    loss: 'meanSquaredError'
});

// 3. Chuẩn bị dữ liệu training
const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);

// 4. Train model
async function trainModel() {
    await model.fit(xs, ys, {
        epochs: 500,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                if (epoch % 100 === 0) {
                    console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
                }
            }
        }
    });
    
    console.log('Training complete!');
    
    // 5. Dự đoán
    const prediction = model.predict(tf.tensor2d([10], [1, 1]));
    prediction.print(); // Khoảng 19 (2*10 - 1)
}

trainModel();
```

### 4.3. Ví dụ: Image Classification (MNIST-like)

```javascript
// Model cho phân loại ảnh 28x28
const model = tf.sequential();

// Convolutional layer 1
model.add(tf.layers.conv2d({
    inputShape: [28, 28, 1],
    filters: 32,
    kernelSize: 3,
    activation: 'relu'
}));

// Max pooling
model.add(tf.layers.maxPooling2d({poolSize: 2}));

// Convolutional layer 2
model.add(tf.layers.conv2d({
    filters: 64,
    kernelSize: 3,
    activation: 'relu'
}));

model.add(tf.layers.maxPooling2d({poolSize: 2}));

// Flatten
model.add(tf.layers.flatten());

// Dense layers
model.add(tf.layers.dense({units: 128, activation: 'relu'}));
model.add(tf.layers.dropout({rate: 0.5})); // Dropout để tránh overfitting

// Output layer (10 classes: 0-9)
model.add(tf.layers.dense({units: 10, activation: 'softmax'}));

// Compile
model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
});

model.summary();
```

## 5. Pre-trained Models

### 5.1. MobileNet - Image Classification

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet"></script>
</head>
<body>
    <h1>Image Classification</h1>
    <input type="file" id="imageUpload" accept="image/*">
    <img id="preview" style="max-width: 400px;">
    <div id="predictions"></div>
    
    <script>
        let model;
        
        // Load model
        async function loadModel() {
            model = await mobilenet.load();
            console.log('MobileNet loaded!');
        }
        
        // Classify image
        async function classifyImage(img) {
            const predictions = await model.classify(img);
            
            const resultsDiv = document.getElementById('predictions');
            resultsDiv.innerHTML = '<h3>Predictions:</h3>';
            
            predictions.forEach(pred => {
                resultsDiv.innerHTML += `
                    <p>${pred.className}: ${(pred.probability * 100).toFixed(2)}%</p>
                `;
            });
        }
        
        // Handle file upload
        document.getElementById('imageUpload').addEventListener('change', (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = (event) => {
                const img = document.getElementById('preview');
                img.src = event.target.result;
                img.onload = () => classifyImage(img);
            };
            
            reader.readAsDataURL(file);
        });
        
        loadModel();
    </script>
</body>
</html>
```

### 5.2. PoseNet - Pose Detection

```javascript
// Load PoseNet
const net = await posenet.load();

// Detect pose từ video/image
const pose = await net.estimateSinglePose(videoElement, {
    flipHorizontal: false
});

console.log(pose.keypoints);
// [
//   {part: 'nose', position: {x: 125, y: 100}, score: 0.99},
//   {part: 'leftEye', position: {x: 115, y: 95}, score: 0.98},
//   ...
// ]

// Vẽ skeleton
pose.keypoints.forEach(keypoint => {
    if (keypoint.score > 0.5) {
        drawPoint(keypoint.position.x, keypoint.position.y);
    }
});
```

### 5.3. Toxicity - Text Classification

```javascript
// Load toxicity model
const threshold = 0.9;
const model = await toxicity.load(threshold);

// Classify text
const sentences = [
    'You are awesome!',
    'I hate you!'
];

const predictions = await model.classify(sentences);

predictions.forEach(prediction => {
    console.log(prediction.label);
    prediction.results.forEach((result, i) => {
        console.log(`  "${sentences[i]}": ${result.match ? 'TOXIC' : 'OK'}`);
    });
});
```

## 6. Transfer Learning

```javascript
// 1. Load pre-trained MobileNet
const mobilenet = await tf.loadLayersModel(
    'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json'
);

// 2. Freeze base layers
mobilenet.layers.forEach(layer => {
    layer.trainable = false;
});

// 3. Thêm custom layers
const model = tf.sequential();

// Thêm tất cả layers của MobileNet trừ layer cuối
for (let i = 0; i < mobilenet.layers.length - 1; i++) {
    model.add(mobilenet.layers[i]);
}

// Thêm custom classification head
model.add(tf.layers.dense({
    units: 128,
    activation: 'relu'
}));

model.add(tf.layers.dropout({rate: 0.5}));

model.add(tf.layers.dense({
    units: 3, // 3 classes riêng của bạn
    activation: 'softmax'
}));

// 4. Compile và train
model.compile({
    optimizer: tf.train.adam(0.0001),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
});

// Train chỉ với custom layers
await model.fit(trainData, trainLabels, {
    epochs: 20,
    validationData: [valData, valLabels]
});
```

## 7. Saving và Loading Models

### 7.1. Save to Browser Storage

```javascript
// Save model
await model.save('localstorage://my-model');

// Load model
const loadedModel = await tf.loadLayersModel('localstorage://my-model');
```

### 7.2. Save to Downloads

```javascript
// Save model để download
await model.save('downloads://my-model');
// Tải 2 files: model.json và weights.bin
```

### 7.3. Convert từ Python

```bash
# Cài đặt tensorflowjs converter
pip install tensorflowjs

# Convert Keras model
tensorflowjs_converter \
    --input_format keras \
    model.h5 \
    tfjs_model/

# Convert SavedModel
tensorflowjs_converter \
    --input_format tf_saved_model \
    saved_model/ \
    tfjs_model/
```

```javascript
// Load converted model
const model = await tf.loadLayersModel('tfjs_model/model.json');
```

## 8. Real-World Application: Webcam Classifier

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet"></script>
</head>
<body>
    <h1>Real-time Webcam Classification</h1>
    <video id="webcam" width="400" height="300" autoplay></video>
    <div id="predictions"></div>
    
    <script>
        let model, webcam;
        
        async function init() {
            // Load model
            model = await mobilenet.load();
            
            // Setup webcam
            webcam = document.getElementById('webcam');
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true
            });
            webcam.srcObject = stream;
            
            // Start prediction loop
            predictLoop();
        }
        
        async function predictLoop() {
            const predictions = await model.classify(webcam);
            
            const div = document.getElementById('predictions');
            div.innerHTML = '<h3>I see:</h3>';
            predictions.forEach(pred => {
                div.innerHTML += `
                    <p><strong>${pred.className}</strong>: 
                    ${(pred.probability * 100).toFixed(1)}%</p>
                `;
            });
            
            requestAnimationFrame(predictLoop);
        }
        
        init();
    </script>
</body>
</html>
```

## 9. Performance Optimization

### 9.1. WebGL Backend

```javascript
// Kiểm tra backend hiện tại
console.log('Backend:', tf.getBackend()); // 'webgl' hoặc 'cpu'

// Set backend (WebGL nhanh hơn CPU rất nhiều)
await tf.setBackend('webgl');

// Kiểm tra WebGL support
const webglSupported = tf.ENV.getBool('WEBGL_VERSION') > 0;
```

### 9.2. Model Optimization

```javascript
// Quantization - Giảm kích thước model
// Khi convert từ Python:
tensorflowjs_converter \
    --input_format keras \
    --quantization_bytes 1 \  # 1 byte (uint8) thay vì 4 bytes (float32)
    model.h5 \
    tfjs_model/
```

### 9.3. Batch Prediction

```javascript
// ❌ Slow: Predict từng ảnh
for (const image of images) {
    const prediction = model.predict(image);
}

// ✅ Fast: Batch prediction
const batch = tf.stack(images);
const predictions = model.predict(batch);
```

## Kết luận

TensorFlow.js đã mở ra một thế giới mới cho Machine Learning - không còn giới hạn ở Python và server, mà có thể chạy ngay trên trình duyệt với hàng tỷ thiết bị. Từ image classification, pose detection, đến text analysis - tất cả đều có thể thực hiện client-side với privacy tốt hơn và latency thấp hơn.

Đây là công nghệ đang phát triển mạnh mẽ và sẽ ngày càng quan trọng trong tương lai của Web Development và AI.

## Tài liệu tham khảo

- [TensorFlow.js Official Documentation](https://www.tensorflow.org/js)
- [TensorFlow.js Examples](https://github.com/tensorflow/tfjs-examples)
- [Pre-trained Models](https://github.com/tensorflow/tfjs-models)
- "Deep Learning with JavaScript" - Shanqing Cai, Stanley Bileschi, Eric D. Nielsen
- [TensorFlow.js Gallery](https://www.tensorflow.org/js/demos)