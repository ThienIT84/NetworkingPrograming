---
title: "Hàm và Sự kiện: Cách JavaScript tương tác với người dùng"
date: 2025-12-19T14:00:00+07:00
draft: false
description: "Tìm hiểu sâu về Functions trong JavaScript, Event Handling, Event Bubbling/Capturing, và các design patterns để xây dựng ứng dụng web tương tác mạnh mẽ."
image: "/images/projects/js-events.jpg"
tags: ["JavaScript", "Events", "Functions", "Event Handling"]
categories: ["Web Development"]
---

## Giới thiệu

Tương tác với người dùng là linh hồn của mọi ứng dụng web. Khi người dùng click vào nút, gõ phím, scroll trang, hoặc di chuyển chuột - tất cả đều là **Events** (sự kiện). **Functions** (hàm) là công cụ để xử lý các events này. Bài viết này sẽ đi sâu vào cách viết functions hiệu quả và xử lý events một cách chuyên nghiệp.

## 1. Functions trong JavaScript

### 1.1. Function Declaration

**Function Declaration** là cách truyền thống để định nghĩa hàm:

```javascript
// Cú pháp cơ bản
function greet(name) {
    return `Xin chào, ${name}!`;
}

console.log(greet("Thiện")); // "Xin chào, Thiện!"

// Function với nhiều tham số
function calculateSum(a, b, c) {
    return a + b + c;
}

console.log(calculateSum(1, 2, 3)); // 6

// Function không có return (return undefined)
function logMessage(message) {
    console.log(message);
    // Không có return → return undefined
}
```

**Đặc điểm:**
- **Hoisting**: Function declarations được "kéo lên" đầu scope
- Có thể gọi trước khi định nghĩa

```javascript
// Hoisting example
sayHello(); // "Hello!" - Hoạt động!

function sayHello() {
    console.log("Hello!");
}
```

### 1.2. Function Expression

**Function Expression** gán hàm cho một biến:

```javascript
// Anonymous function expression
const add = function(a, b) {
    return a + b;
};

console.log(add(5, 3)); // 8

// Named function expression (tốt cho debugging)
const multiply = function multiplyNumbers(a, b) {
    return a * b;
};

console.log(multiply.name); // "multiplyNumbers"
```

**Đặc điểm:**
- **Không hoisting**: Phải định nghĩa trước khi sử dụng
- Có thể dùng làm callback, IIFE

```javascript
// ❌ Error: Cannot access before initialization
calculate(5, 3); 

const calculate = function(a, b) {
    return a + b;
};
```

### 1.3. Arrow Functions (ES6)

**Arrow Functions** là cú pháp ngắn gọn và hiện đại:

```javascript
// Cú pháp cơ bản
const square = (x) => {
    return x * x;
};

// Ngắn gọn hơn: Bỏ {} và return (implicit return)
const square2 = (x) => x * x;

// Một tham số: Bỏ ()
const double = x => x * 2;

// Không có tham số: Cần ()
const sayHi = () => console.log("Hi!");

// Nhiều tham số
const sum = (a, b) => a + b;

// Return object: Cần () để tránh nhầm với {}
const createPerson = (name, age) => ({
    name: name,
    age: age
});

// Hoặc dùng shorthand
const createPerson2 = (name, age) => ({ name, age });
```

**Đặc điểm đặc biệt của Arrow Functions:**

```javascript
// 1. Không có 'this' riêng - kế thừa từ lexical scope
const person = {
    name: "Thiện",
    
    // Regular function: 'this' là person
    greet: function() {
        console.log(`Hi, I'm ${this.name}`);
    },
    
    // Arrow function: 'this' từ outer scope
    greetArrow: () => {
        console.log(`Hi, I'm ${this.name}`); // undefined!
    },
    
    // Use case tốt: Callback trong method
    delayedGreet: function() {
        setTimeout(() => {
            console.log(`Hi, I'm ${this.name}`); // 'this' từ delayedGreet
        }, 1000);
    }
};

person.greet(); // "Hi, I'm Thiện"
person.greetArrow(); // "Hi, I'm undefined"
person.delayedGreet(); // "Hi, I'm Thiện" (sau 1s)

// 2. Không có 'arguments' object
function regularFunc() {
    console.log(arguments); // [1, 2, 3]
}
regularFunc(1, 2, 3);

const arrowFunc = () => {
    console.log(arguments); // ReferenceError!
};

// Dùng rest parameters thay thế
const arrowWithRest = (...args) => {
    console.log(args); // [1, 2, 3]
};
arrowWithRest(1, 2, 3);

// 3. Không thể dùng làm constructor
const Person = (name) => {
    this.name = name;
};
const p = new Person("Thiện"); // TypeError!
```

### 1.4. Default Parameters (ES6)

```javascript
// Old way
function greet(name) {
    name = name || "Guest";
    return `Hello, ${name}!`;
}

// ES6 way
function greet2(name = "Guest") {
    return `Hello, ${name}!`;
}

console.log(greet2()); // "Hello, Guest!"
console.log(greet2("Thiện")); // "Hello, Thiện!"

// Default có thể là expression
function createUser(name, role = "user", id = Date.now()) {
    return { name, role, id };
}

// Default có thể tham chiếu tham số trước
function calculate(a, b = a * 2) {
    return a + b;
}
console.log(calculate(5)); // 15 (5 + 10)
```

### 1.5. Rest Parameters (ES6)

```javascript
// Thu thập tất cả tham số còn lại thành array
function sum(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3)); // 6
console.log(sum(1, 2, 3, 4, 5)); // 15

// Kết hợp với tham số thường
function introduce(greeting, ...names) {
    return `${greeting} ${names.join(", ")}!`;
}

console.log(introduce("Hello", "Alice", "Bob", "Charlie"));
// "Hello Alice, Bob, Charlie!"

// Rest phải là tham số cuối cùng
function invalid(a, ...rest, b) {} // SyntaxError!
```

### 1.6. Higher-Order Functions

**Higher-Order Function** là hàm nhận hàm khác làm tham số hoặc return hàm:

```javascript
// 1. Nhận function làm tham số
function repeat(n, action) {
    for (let i = 0; i < n; i++) {
        action(i);
    }
}

repeat(3, (i) => console.log(`Iteration ${i}`));
// Iteration 0
// Iteration 1
// Iteration 2

// 2. Return function
function multiplier(factor) {
    return (number) => number * factor;
}

const double = multiplier(2);
const triple = multiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

// 3. Ví dụ thực tế: Debounce
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

const debouncedSearch = debounce((query) => {
    console.log(`Searching for: ${query}`);
}, 300);

// Chỉ log lần cuối sau 300ms
debouncedSearch("a");
debouncedSearch("ab");
debouncedSearch("abc"); // Chỉ cái này được log
```

## 2. Events (Sự kiện)

### 2.1. Event Basics

**Event** là hành động xảy ra trong trình duyệt mà JavaScript có thể phản ứng:

```javascript
const button = document.getElementById("myButton");

// addEventListener(eventType, handler, options)
button.addEventListener("click", function(event) {
    console.log("Button clicked!");
    console.log("Event type:", event.type); // "click"
    console.log("Target:", event.target); // <button>
});

// Arrow function
button.addEventListener("click", (e) => {
    console.log("Clicked with arrow function");
});

// Named function (dễ remove)
function handleClick(e) {
    console.log("Clicked!");
}
button.addEventListener("click", handleClick);

// Remove event listener
button.removeEventListener("click", handleClick);
```

### 2.2. Common Event Types

#### a) Mouse Events

```javascript
const element = document.getElementById("box");

// Click events
element.addEventListener("click", (e) => {
    console.log("Single click");
});

element.addEventListener("dblclick", (e) => {
    console.log("Double click");
});

element.addEventListener("contextmenu", (e) => {
    e.preventDefault(); // Ngăn context menu
    console.log("Right click");
});

// Mouse movement
element.addEventListener("mouseenter", (e) => {
    console.log("Mouse entered");
});

element.addEventListener("mouseleave", (e) => {
    console.log("Mouse left");
});

element.addEventListener("mousemove", (e) => {
    console.log(`Mouse at: ${e.clientX}, ${e.clientY}`);
});

// Mouse button states
element.addEventListener("mousedown", (e) => {
    console.log("Mouse button pressed");
});

element.addEventListener("mouseup", (e) => {
    console.log("Mouse button released");
});
```

#### b) Keyboard Events

```javascript
const input = document.getElementById("textInput");

// keydown - Khi nhấn phím (lặp lại nếu giữ)
input.addEventListener("keydown", (e) => {
    console.log("Key down:", e.key);
    console.log("Key code:", e.code);
    console.log("Ctrl pressed:", e.ctrlKey);
    console.log("Shift pressed:", e.shiftKey);
    console.log("Alt pressed:", e.altKey);
});

// keyup - Khi thả phím
input.addEventListener("keyup", (e) => {
    console.log("Key up:", e.key);
});

// Ví dụ: Phím tắt Ctrl+S
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "s") {
        e.preventDefault(); // Ngăn save page
        console.log("Save triggered!");
    }
});

// Ví dụ: Enter để submit
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        console.log("Submit:", input.value);
    }
});
```

#### c) Form Events

```javascript
const form = document.getElementById("myForm");
const input = document.getElementById("email");

// submit - Khi form được submit
form.addEventListener("submit", (e) => {
    e.preventDefault(); // Ngăn reload page
    
    const formData = new FormData(form);
    console.log("Form data:", Object.fromEntries(formData));
});

// input - Mỗi khi giá trị thay đổi (real-time)
input.addEventListener("input", (e) => {
    console.log("Current value:", e.target.value);
});

// change - Khi giá trị thay đổi và blur
input.addEventListener("change", (e) => {
    console.log("Final value:", e.target.value);
});

// focus - Khi element được focus
input.addEventListener("focus", (e) => {
    e.target.style.backgroundColor = "lightyellow";
});

// blur - Khi element mất focus
input.addEventListener("blur", (e) => {
    e.target.style.backgroundColor = "";
});
```

#### d) Window Events

```javascript
// load - Khi trang load xong (bao gồm images, CSS)
window.addEventListener("load", () => {
    console.log("Page fully loaded");
});

// DOMContentLoaded - Khi DOM ready (không chờ images)
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM ready");
});

// resize - Khi window thay đổi kích thước
window.addEventListener("resize", () => {
    console.log(`Window size: ${window.innerWidth}x${window.innerHeight}`);
});

// scroll - Khi scroll
window.addEventListener("scroll", () => {
    console.log("Scroll position:", window.scrollY);
});

// beforeunload - Trước khi rời trang
window.addEventListener("beforeunload", (e) => {
    e.preventDefault();
    e.returnValue = ""; // Hiện confirm dialog
});
```

### 2.3. Event Object Properties

```javascript
element.addEventListener("click", (event) => {
    // Target và currentTarget
    console.log(event.target); // Element được click
    console.log(event.currentTarget); // Element có listener
    
    // Mouse position
    console.log(event.clientX, event.clientY); // Relative to viewport
    console.log(event.pageX, event.pageY); // Relative to document
    console.log(event.screenX, event.screenY); // Relative to screen
    
    // Keyboard modifiers
    console.log(event.ctrlKey); // Ctrl pressed?
    console.log(event.shiftKey); // Shift pressed?
    console.log(event.altKey); // Alt pressed?
    console.log(event.metaKey); // Cmd (Mac) / Win key
    
    // Event info
    console.log(event.type); // "click"
    console.log(event.timeStamp); // Timestamp
    console.log(event.isTrusted); // User-generated or script?
});
```

### 2.4. Event Bubbling và Capturing

**Event Propagation** có 3 phases:

```
1. Capturing Phase (từ window → target)
2. Target Phase (tại element được click)
3. Bubbling Phase (từ target → window)
```

```html
<div id="outer">
    <div id="middle">
        <button id="inner">Click Me</button>
    </div>
</div>
```

```javascript
const outer = document.getElementById("outer");
const middle = document.getElementById("middle");
const inner = document.getElementById("inner");

// Bubbling (default)
outer.addEventListener("click", () => console.log("Outer"));
middle.addEventListener("click", () => console.log("Middle"));
inner.addEventListener("click", () => console.log("Inner"));

// Click button → Output:
// Inner
// Middle
// Outer

// Capturing (useCapture = true)
outer.addEventListener("click", () => console.log("Outer"), true);
middle.addEventListener("click", () => console.log("Middle"), true);
inner.addEventListener("click", () => console.log("Inner"), true);

// Click button → Output:
// Outer
// Middle
// Inner

// stopPropagation - Ngăn bubbling/capturing
inner.addEventListener("click", (e) => {
    e.stopPropagation();
    console.log("Inner only");
});
// Click button → Output: Inner only

// stopImmediatePropagation - Ngăn cả listeners khác trên cùng element
inner.addEventListener("click", (e) => {
    e.stopImmediatePropagation();
    console.log("First listener");
});
inner.addEventListener("click", () => {
    console.log("Second listener"); // Không chạy!
});
```

### 2.5. Event Delegation

**Event Delegation** là kỹ thuật gắn listener vào parent thay vì từng child:

```javascript
// ❌ BAD: Gắn listener cho từng item
const items = document.querySelectorAll(".item");
items.forEach(item => {
    item.addEventListener("click", handleClick);
});

// ✅ GOOD: Event delegation
const list = document.getElementById("list");
list.addEventListener("click", (e) => {
    // Kiểm tra element được click
    if (e.target.classList.contains("item")) {
        handleClick(e);
    }
    
    // Hoặc dùng closest (tốt hơn cho nested elements)
    const item = e.target.closest(".item");
    if (item) {
        console.log("Clicked item:", item.dataset.id);
    }
});

// Ưu điểm:
// 1. Ít listeners hơn → ít memory
// 2. Hoạt động với elements được thêm sau
// 3. Dễ quản lý
```

### 2.6. Custom Events

```javascript
// Tạo custom event
const myEvent = new CustomEvent("userLogin", {
    detail: {
        username: "thien",
        timestamp: Date.now()
    },
    bubbles: true,
    cancelable: true
});

// Listen custom event
document.addEventListener("userLogin", (e) => {
    console.log("User logged in:", e.detail.username);
});

// Dispatch event
document.dispatchEvent(myEvent);

// Ví dụ thực tế: Component communication
class ShoppingCart {
    addItem(item) {
        // ... add logic ...
        
        const event = new CustomEvent("itemAdded", {
            detail: { item, total: this.total }
        });
        document.dispatchEvent(event);
    }
}

// Listener ở component khác
document.addEventListener("itemAdded", (e) => {
    updateCartUI(e.detail.total);
});
```

## 3. Ví dụ thực tế

### 3.1. Interactive Form Validation

```javascript
const form = document.getElementById("registerForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Real-time validation
emailInput.addEventListener("input", (e) => {
    const email = e.target.value;
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    if (isValid) {
        e.target.classList.remove("invalid");
        e.target.classList.add("valid");
    } else {
        e.target.classList.remove("valid");
        e.target.classList.add("invalid");
    }
});

// Password strength indicator
passwordInput.addEventListener("input", (e) => {
    const password = e.target.value;
    const strength = calculatePasswordStrength(password);
    updateStrengthIndicator(strength);
});

// Form submission
form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    if (validateForm()) {
        const formData = {
            email: emailInput.value,
            password: passwordInput.value
        };
        submitForm(formData);
    }
});

function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
}
```

### 3.2. Drag and Drop

```javascript
const draggable = document.getElementById("draggable");
const dropzone = document.getElementById("dropzone");

// Make element draggable
draggable.draggable = true;

draggable.addEventListener("dragstart", (e) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.innerHTML);
    e.target.style.opacity = "0.5";
});

draggable.addEventListener("dragend", (e) => {
    e.target.style.opacity = "1";
});

// Dropzone events
dropzone.addEventListener("dragover", (e) => {
    e.preventDefault(); // Allow drop
    e.dataTransfer.dropEffect = "move";
    dropzone.classList.add("drag-over");
});

dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("drag-over");
});

dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/html");
    dropzone.innerHTML = data;
    dropzone.classList.remove("drag-over");
});
```

### 3.3. Infinite Scroll

```javascript
let page = 1;
let loading = false;

window.addEventListener("scroll", () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    
    // Khi scroll gần đến cuối
    if (scrollTop + clientHeight >= scrollHeight - 100 && !loading) {
        loadMoreContent();
    }
});

async function loadMoreContent() {
    loading = true;
    
    try {
        const response = await fetch(`/api/posts?page=${page}`);
        const posts = await response.json();
        
        posts.forEach(post => {
            const element = createPostElement(post);
            document.getElementById("posts").appendChild(element);
        });
        
        page++;
    } catch (error) {
        console.error("Error loading posts:", error);
    } finally {
        loading = false;
    }
}
```

## 4. Best Practices

### 4.1. Event Listener Management

```javascript
// ✅ GOOD: Named functions (dễ remove)
function handleClick(e) {
    console.log("Clicked");
}
button.addEventListener("click", handleClick);
button.removeEventListener("click", handleClick);

// ❌ BAD: Anonymous functions (không thể remove)
button.addEventListener("click", () => {
    console.log("Clicked");
});

// ✅ GOOD: Cleanup khi không cần
class Component {
    constructor() {
        this.handleClick = this.handleClick.bind(this);
        this.button.addEventListener("click", this.handleClick);
    }
    
    destroy() {
        this.button.removeEventListener("click", this.handleClick);
    }
}
```

### 4.2. Performance Optimization

```javascript
// Debounce cho input
const debouncedSearch = debounce((query) => {
    searchAPI(query);
}, 300);

input.addEventListener("input", (e) => {
    debouncedSearch(e.target.value);
});

// Throttle cho scroll
const throttledScroll = throttle(() => {
    updateScrollPosition();
}, 100);

window.addEventListener("scroll", throttledScroll);

// Passive listeners cho scroll performance
window.addEventListener("scroll", handleScroll, { passive: true });
```

## Kết luận

Functions và Events là hai trụ cột của JavaScript tương tác. Hiểu rõ cách viết functions hiệu quả, xử lý events đúng cách, và áp dụng các patterns như event delegation sẽ giúp bạn xây dựng ứng dụng web mượt mà, hiệu năng cao và dễ bảo trì.

## Tài liệu tham khảo

- [MDN - Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [MDN - Events](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events)
- "JavaScript: The Good Parts" - Douglas Crockford
- "Eloquent JavaScript" - Marijn Haverbeke