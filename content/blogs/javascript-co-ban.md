---
title: "JavaScript Căn Bản: Nền tảng của Web Development hiện đại"
date: 2025-12-19T09:00:00+07:00
draft: false
description: "Hướng dẫn chi tiết về JavaScript từ cơ bản đến nâng cao: biến, kiểu dữ liệu, functions, objects, ES6+ features, và best practices cho lập trình viên hiện đại."
image: "/images/projects/js-basic.jpg"
tags: ["JavaScript", "Frontend", "Programming", "ES6", "Web Development"]
categories: ["Web Development"]
---

## Giới thiệu

**JavaScript** là ngôn ngữ lập trình phổ biến nhất thế giới (theo Stack Overflow Survey), và là ngôn ngữ duy nhất chạy native trên mọi trình duyệt web. Nếu Java là "xương sống" của hệ thống backend thì JavaScript chính là "linh hồn" giúp trang web sống động và tương tác. Bài viết này sẽ đưa bạn từ những khái niệm cơ bản nhất đến các tính năng hiện đại của JavaScript.

## 1. JavaScript là gì?

### 1.1. Lịch sử và vai trò

**JavaScript** được tạo ra bởi Brendan Eich năm 1995 chỉ trong **10 ngày** tại Netscape. Ban đầu tên là Mocha, sau đổi thành LiveScript, cuối cùng là JavaScript (để "nhờ vả" sự nổi tiếng của Java).

**Vai trò hiện tại:**
- **Frontend**: Tương tác với người dùng trên browser
- **Backend**: Node.js cho server-side programming
- **Mobile**: React Native, Ionic
- **Desktop**: Electron (VS Code, Discord, Slack)
- **IoT**: Johnny-Five framework

### 1.2. JavaScript vs Java

| Đặc điểm | JavaScript | Java |
|----------|-----------|------|
| **Typing** | Dynamically typed | Statically typed |
| **Compilation** | Interpreted | Compiled |
| **Running** | Browser, Node.js | JVM |
| **OOP** | Prototype-based | Class-based |
| **Syntax** | Linh hoạt | Nghiêm ngặt |
| **Use case** | Web, Full-stack | Enterprise, Android |

## 2. Biến và Kiểu dữ liệu

### 2.1. Khai báo biến: var, let, const

JavaScript có 3 cách khai báo biến, mỗi cách có đặc điểm riêng:

#### a) var (Cách cũ - Không khuyến khích)

```javascript
var name = "Thanh Thiện";
var age = 20;

// Vấn đề 1: Function scope (không phải block scope)
if (true) {
    var x = 10;
}
console.log(x); // 10 (vẫn truy cập được!)

// Vấn đề 2: Hoisting
console.log(y); // undefined (không lỗi!)
var y = 5;

// Vấn đề 3: Có thể khai báo lại
var name = "Thiện"; // OK (nhưng dễ gây bug)
```

#### b) let (ES6 - Khuyến khích cho biến thay đổi)

```javascript
let age = 20;
age = 21; // OK - có thể thay đổi

// Ưu điểm 1: Block scope
if (true) {
    let x = 10;
}
console.log(x); // ReferenceError: x is not defined

// Ưu điểm 2: Không thể khai báo lại
let name = "Thiện";
let name = "Thanh"; // SyntaxError!

// Ưu điểm 3: Temporal Dead Zone
console.log(z); // ReferenceError (không phải undefined)
let z = 5;
```

#### c) const (ES6 - Khuyến khích cho hằng số)

```javascript
const PI = 3.14159;
PI = 3.14; // TypeError: Assignment to constant variable

const user = {
    name: "Thiện",
    age: 20
};

// Lưu ý: const chỉ ngăn reassignment, không ngăn mutation
user.age = 21; // OK - object vẫn có thể thay đổi
user = {}; // TypeError - không thể gán lại

// Để object thực sự immutable:
const frozenUser = Object.freeze({name: "Thiện"});
frozenUser.name = "Thanh"; // Không có tác dụng (strict mode sẽ lỗi)
```

**Best Practice:**
```javascript
// ✅ GOOD: Ưu tiên const, dùng let khi cần thay đổi
const API_URL = "https://api.example.com";
let counter = 0;

// ❌ BAD: Tránh dùng var
var oldStyle = "deprecated";
```

### 2.2. Kiểu dữ liệu (Data Types)

JavaScript có **8 kiểu dữ liệu**: 7 primitive + 1 object.

#### a) Primitive Types

```javascript
// 1. String - Chuỗi ký tự
const name = "Thanh Thiện";
const greeting = 'Xin chào';
const template = `Hello, ${name}!`; // Template literal (ES6)

// 2. Number - Số (cả integer và float)
const age = 20;
const pi = 3.14159;
const bigNum = 1e6; // 1,000,000
const infinity = Infinity;
const notANumber = NaN; // Not a Number

// 3. BigInt - Số nguyên lớn (ES2020)
const huge = 9007199254740991n;
const alsoHuge = BigInt("9007199254740991");

// 4. Boolean - Giá trị logic
const isStudent = true;
const hasGraduated = false;

// 5. Undefined - Chưa được gán giá trị
let x;
console.log(x); // undefined

// 6. Null - Cố ý không có giá trị
const emptyValue = null;

// 7. Symbol - Giá trị duy nhất (ES6)
const id1 = Symbol("id");
const id2 = Symbol("id");
console.log(id1 === id2); // false (mỗi Symbol là duy nhất)
```

#### b) Object Type

```javascript
// Object - Tập hợp các key-value pairs
const student = {
    name: "Thanh Thiện",
    age: 20,
    major: "Computer Science",
    gpa: 3.8,
    skills: ["Java", "JavaScript", "Python"],
    address: {
        city: "Ho Chi Minh",
        district: "District 1"
    },
    // Method
    introduce: function() {
        return `Tôi là ${this.name}, ${this.age} tuổi`;
    }
};

// Truy cập properties
console.log(student.name); // Dot notation
console.log(student["age"]); // Bracket notation

// Thêm property mới
student.email = "thien@example.com";

// Xóa property
delete student.gpa;
```

### 2.3. Type Checking và Conversion

```javascript
// Kiểm tra kiểu dữ liệu
typeof "hello"; // "string"
typeof 42; // "number"
typeof true; // "boolean"
typeof undefined; // "undefined"
typeof null; // "object" (bug lịch sử của JS!)
typeof {}; // "object"
typeof []; // "object" (array cũng là object)
typeof function(){}; // "function"

// Kiểm tra array
Array.isArray([]); // true
Array.isArray({}); // false

// Type Conversion
String(123); // "123"
Number("456"); // 456
Number("abc"); // NaN
Boolean(0); // false
Boolean(""); // false
Boolean("hello"); // true

// Implicit Conversion (Tự động chuyển đổi)
"5" + 3; // "53" (number → string)
"5" - 3; // 2 (string → number)
"5" * "2"; // 10 (cả hai → number)
```

## 3. Operators (Toán tử)

### 3.1. Arithmetic Operators

```javascript
let a = 10, b = 3;

console.log(a + b); // 13 - Cộng
console.log(a - b); // 7 - Trừ
console.log(a * b); // 30 - Nhân
console.log(a / b); // 3.333... - Chia
console.log(a % b); // 1 - Chia lấy dư (modulo)
console.log(a ** b); // 1000 - Lũy thừa (ES2016)

// Increment/Decrement
let x = 5;
console.log(x++); // 5 (post-increment: trả về rồi mới tăng)
console.log(x); // 6

let y = 5;
console.log(++y); // 6 (pre-increment: tăng rồi mới trả về)
```

### 3.2. Comparison Operators

```javascript
// Equality
5 == "5"; // true (loose equality - chuyển đổi kiểu)
5 === "5"; // false (strict equality - không chuyển đổi)

// ✅ Best Practice: Luôn dùng === và !==
0 == false; // true (loose)
0 === false; // false (strict)

null == undefined; // true
null === undefined; // false

// Comparison
10 > 5; // true
10 >= 10; // true
5 < 3; // false
"a" < "b"; // true (so sánh lexicographic)
```

### 3.3. Logical Operators

```javascript
// AND (&&) - Cả hai phải true
true && true; // true
true && false; // false

// OR (||) - Một trong hai true
true || false; // true
false || false; // false

// NOT (!) - Đảo ngược
!true; // false
!false; // true

// Short-circuit evaluation
const result = null || "default"; // "default"
const value = "hello" && "world"; // "world"

// Nullish Coalescing Operator (ES2020)
const foo = null ?? "default"; // "default"
const bar = 0 ?? "default"; // 0 (khác với ||)
```

### 3.4. Ternary Operator

```javascript
// Cú pháp: condition ? valueIfTrue : valueIfFalse
const age = 20;
const status = age >= 18 ? "Adult" : "Minor";

// Nested ternary (tránh lạm dụng)
const grade = score >= 90 ? "A" : 
              score >= 80 ? "B" : 
              score >= 70 ? "C" : "F";
```

## 4. Control Flow (Luồng điều khiển)

### 4.1. If-Else Statement

```javascript
const score = 85;

if (score >= 90) {
    console.log("Xuất sắc");
} else if (score >= 80) {
    console.log("Giỏi");
} else if (score >= 70) {
    console.log("Khá");
} else if (score >= 60) {
    console.log("Trung bình");
} else {
    console.log("Yếu");
}

// Truthy và Falsy values
// Falsy: false, 0, "", null, undefined, NaN
// Truthy: Tất cả các giá trị khác

if ("") {
    console.log("Không chạy"); // "" là falsy
}

if ("hello") {
    console.log("Chạy"); // "hello" là truthy
}
```

### 4.2. Switch Statement

```javascript
const day = "Monday";

switch (day) {
    case "Monday":
        console.log("Đầu tuần");
        break;
    case "Friday":
        console.log("Cuối tuần");
        break;
    case "Saturday":
    case "Sunday":
        console.log("Nghỉ");
        break;
    default:
        console.log("Ngày thường");
}
```

### 4.3. Loops

```javascript
// For loop
for (let i = 0; i < 5; i++) {
    console.log(i); // 0, 1, 2, 3, 4
}

// While loop
let count = 0;
while (count < 5) {
    console.log(count);
    count++;
}

// Do-While loop
let num = 0;
do {
    console.log(num);
    num++;
} while (num < 5);

// For...of (iterate over values) - ES6
const arr = [10, 20, 30];
for (const value of arr) {
    console.log(value); // 10, 20, 30
}

// For...in (iterate over keys)
const obj = {a: 1, b: 2, c: 3};
for (const key in obj) {
    console.log(key, obj[key]); // a 1, b 2, c 3
}
```

## 5. Functions

### 5.1. Function Declaration

```javascript
// Traditional function
function greet(name) {
    return `Hello, ${name}!`;
}

console.log(greet("Thiện")); // "Hello, Thiện!"

// Function với default parameters (ES6)
function multiply(a, b = 1) {
    return a * b;
}

console.log(multiply(5)); // 5 (b = 1)
console.log(multiply(5, 3)); // 15
```

### 5.2. Function Expression

```javascript
const add = function(a, b) {
    return a + b;
};

console.log(add(3, 4)); // 7
```

### 5.3. Arrow Functions (ES6)

```javascript
// Cú pháp ngắn gọn
const square = (x) => x * x;
const sum = (a, b) => a + b;

// Với một tham số, có thể bỏ dấu ngoặc
const double = x => x * 2;

// Với nhiều dòng, cần dấu {} và return
const complexFunc = (x, y) => {
    const result = x * y;
    return result + 10;
};

// Arrow function không có 'this' riêng
const person = {
    name: "Thiện",
    sayHi: function() {
        setTimeout(() => {
            console.log(`Hi, I'm ${this.name}`); // 'this' từ person
        }, 1000);
    }
};
```

### 5.4. Rest Parameters và Spread Operator

```javascript
// Rest parameters - Thu thập tham số thành array
function sum(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3, 4, 5)); // 15

// Spread operator - Trải array thành các phần tử riêng
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

const obj1 = {a: 1, b: 2};
const obj2 = {c: 3, d: 4};
const merged = {...obj1, ...obj2}; // {a: 1, b: 2, c: 3, d: 4}
```

## 6. Arrays

### 6.1. Array Methods

```javascript
const numbers = [1, 2, 3, 4, 5];

// map - Biến đổi từng phần tử
const doubled = numbers.map(x => x * 2); // [2, 4, 6, 8, 10]

// filter - Lọc phần tử
const evens = numbers.filter(x => x % 2 === 0); // [2, 4]

// reduce - Gộp thành một giá trị
const sum = numbers.reduce((acc, curr) => acc + curr, 0); // 15

// find - Tìm phần tử đầu tiên thỏa điều kiện
const found = numbers.find(x => x > 3); // 4

// some - Kiểm tra có ít nhất một phần tử thỏa
const hasEven = numbers.some(x => x % 2 === 0); // true

// every - Kiểm tra tất cả phần tử thỏa
const allPositive = numbers.every(x => x > 0); // true

// forEach - Lặp qua từng phần tử
numbers.forEach((num, index) => {
    console.log(`Index ${index}: ${num}`);
});
```

### 6.2. Destructuring (ES6)

```javascript
// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first); // 1
console.log(second); // 2
console.log(rest); // [3, 4, 5]

// Object destructuring
const user = {name: "Thiện", age: 20, city: "HCM"};
const {name, age} = user;
console.log(name); // "Thiện"

// Với alias
const {name: userName, age: userAge} = user;
console.log(userName); // "Thiện"
```

## 7. Modern JavaScript (ES6+)

### 7.1. Template Literals

```javascript
const name = "Thiện";
const age = 20;

// Old way
const message1 = "My name is " + name + " and I'm " + age + " years old.";

// ES6 way
const message2 = `My name is ${name} and I'm ${age} years old.`;

// Multi-line
const html = `
    <div>
        <h1>${name}</h1>
        <p>Age: ${age}</p>
    </div>
`;
```

### 7.2. Promises và Async/Await

```javascript
// Promise
function fetchData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Data loaded");
        }, 1000);
    });
}

fetchData()
    .then(data => console.log(data))
    .catch(error => console.error(error));

// Async/Await (ES2017)
async function loadData() {
    try {
        const data = await fetchData();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}
```

## 8. Best Practices

```javascript
// ✅ 1. Sử dụng strict mode
"use strict";

// ✅ 2. Const/let thay vì var
const API_KEY = "abc123";
let counter = 0;

// ✅ 3. === thay vì ==
if (value === 10) { }

// ✅ 4. Arrow functions cho callbacks
arr.map(x => x * 2);

// ✅ 5. Destructuring
const {name, age} = user;

// ✅ 6. Template literals
const msg = `Hello, ${name}!`;

// ✅ 7. Optional chaining (ES2020)
const city = user?.address?.city;

// ✅ 8. Nullish coalescing
const value = input ?? "default";
```

## Kết luận

JavaScript là ngôn ngữ mạnh mẽ và linh hoạt, không ngừng phát triển với các tính năng mới mỗi năm. Nắm vững các khái niệm cơ bản như biến, kiểu dữ liệu, functions, và arrays là nền tảng để bạn có thể tiến xa hơn với các framework hiện đại như React, Vue, hoặc Node.js.

Trong bài viết tiếp theo, chúng ta sẽ tìm hiểu về DOM Manipulation - cách JavaScript tương tác với HTML để tạo ra các trang web động.

## Tài liệu tham khảo

- [MDN Web Docs - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- "You Don't Know JS" - Kyle Simpson
- "Eloquent JavaScript" - Marijn Haverbeke
- [JavaScript.info](https://javascript.info/)
- ECMAScript Specifications