---
title: "DOM Manipulation: Thay đổi trang web theo ý muốn"
date: 2025-12-19T10:00:00+07:00
draft: false
description: "Hướng dẫn chi tiết về DOM (Document Object Model), cách sử dụng JavaScript để truy xuất, thao tác, và tạo các phần tử HTML động, cùng với event handling và best practices."
image: "/NetworkingPrograming/images/projects/js-dom.jpg"
tags: ["JavaScript", "DOM", "Frontend", "Web Development"]
categories: ["Web Development"]
---

## Giới thiệu

**DOM (Document Object Model)** là cầu nối quan trọng nhất giữa JavaScript và HTML. Nó cho phép JavaScript "nhìn thấy" và "thao tác" với mọi phần tử trên trang web - từ việc thay đổi nội dung text, thêm/xóa elements, đến tạo hiệu ứng animation phức tạp. Nếu HTML là "bộ xương", CSS là "da thịt", thì JavaScript thông qua DOM chính là "hệ thần kinh" giúp trang web sống động và tương tác.

## 1. DOM là gì?

### 1.1. Định nghĩa

**DOM (Document Object Model)** là một giao diện lập trình (API) cho phép các ngôn ngữ như JavaScript truy cập và thao tác với cấu trúc, nội dung, và style của tài liệu HTML/XML.

Khi trình duyệt load một trang HTML, nó sẽ tạo ra một **DOM Tree** - cấu trúc cây biểu diễn toàn bộ tài liệu.

### 1.2. DOM Tree Structure

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <h1 id="title">Welcome</h1>
    <p class="description">This is a paragraph.</p>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
  </body>
</html>
```

**DOM Tree tương ứng:**

```
Document
  └─ html
      ├─ head
      │   └─ title
      │       └─ "My Page"
      └─ body
          ├─ h1 (id="title")
          │   └─ "Welcome"
          ├─ p (class="description")
          │   └─ "This is a paragraph."
          └─ ul
              ├─ li
              │   └─ "Item 1"
              └─ li
                  └─ "Item 2"
```

### 1.3. Node Types

Trong DOM, mọi thứ đều là **Node**:

- **Element Node**: Các thẻ HTML (`<div>`, `<p>`, `<h1>`, etc.)
- **Text Node**: Nội dung text bên trong element
- **Attribute Node**: Các thuộc tính (`id`, `class`, `src`, etc.)
- **Comment Node**: Các comment HTML (`<!-- comment -->`)

## 2. Truy xuất Elements (Selecting Elements)

### 2.1. Các phương thức cơ bản

```javascript
// 1. getElementById - Lấy element theo ID (trả về 1 element hoặc null)
const title = document.getElementById("title");
console.log(title); // <h1 id="title">Welcome</h1>

// 2. getElementsByClassName - Lấy elements theo class (trả về HTMLCollection)
const descriptions = document.getElementsByClassName("description");
console.log(descriptions[0]); // Element đầu tiên

// 3. getElementsByTagName - Lấy elements theo tag name
const paragraphs = document.getElementsByTagName("p");
console.log(paragraphs.length); // Số lượng thẻ <p>

// 4. querySelector - Lấy element đầu tiên khớp với CSS selector (ES5)
const firstItem = document.querySelector(".list-item");
const titleById = document.querySelector("#title");
const firstParagraph = document.querySelector("p");

// 5. querySelectorAll - Lấy TẤT CẢ elements khớp (trả về NodeList)
const allItems = document.querySelectorAll(".list-item");
const allParagraphs = document.querySelectorAll("p");

// Lặp qua NodeList
allItems.forEach(item => {
    console.log(item.textContent);
});
```

### 2.2. So sánh các phương thức

| Method | Return Type | Live/Static | Performance |
|--------|-------------|-------------|-------------|
| `getElementById` | Element | N/A | Nhanh nhất |
| `getElementsByClassName` | HTMLCollection | Live | Nhanh |
| `getElementsByTagName` | HTMLCollection | Live | Nhanh |
| `querySelector` | Element | Static | Chậm hơn |
| `querySelectorAll` | NodeList | Static | Chậm nhất |

**Live vs Static:**
- **Live**: Tự động cập nhật khi DOM thay đổi
- **Static**: Snapshot tại thời điểm query

```javascript
const liveList = document.getElementsByClassName("item");
const staticList = document.querySelectorAll(".item");

console.log(liveList.length); // 3
console.log(staticList.length); // 3

// Thêm element mới
const newItem = document.createElement("div");
newItem.className = "item";
document.body.appendChild(newItem);

console.log(liveList.length); // 4 (tự động cập nhật!)
console.log(staticList.length); // 3 (không thay đổi)
```

### 2.3. Advanced Selectors

```javascript
// Kết hợp nhiều selectors
const activeButton = document.querySelector("button.active");
const firstListItem = document.querySelector("ul > li:first-child");
const checkedInputs = document.querySelectorAll("input[type='checkbox']:checked");

// Attribute selectors
const externalLinks = document.querySelectorAll("a[href^='http']");
const pdfLinks = document.querySelectorAll("a[href$='.pdf']");
const dataElements = document.querySelectorAll("[data-id]");

// Pseudo-classes
const evenRows = document.querySelectorAll("tr:nth-child(even)");
const lastParagraph = document.querySelector("p:last-of-type");
```

## 3. Thao tác nội dung (Content Manipulation)

### 3.1. textContent vs innerHTML vs innerText

```javascript
const element = document.getElementById("content");

// 1. textContent - Lấy/set text thuần túy (bao gồm cả text ẩn)
element.textContent = "Hello World"; // An toàn, không parse HTML
console.log(element.textContent); // "Hello World"

// 2. innerHTML - Lấy/set HTML (có thể chứa tags)
element.innerHTML = "<strong>Bold Text</strong>"; // Parse HTML
console.log(element.innerHTML); // "<strong>Bold Text</strong>"

// ⚠️ XSS Risk với innerHTML
const userInput = "<img src=x onerror='alert(\"XSS\")'>";
element.innerHTML = userInput; // NGUY HIỂM!

// 3. innerText - Giống textContent nhưng tôn trọng CSS styling
element.innerText = "Visible Text"; // Không lấy text ẩn (display: none)
```

**Best Practice:**
```javascript
// ✅ GOOD: Dùng textContent cho text thuần
element.textContent = userInput;

// ✅ GOOD: Dùng createElement cho HTML động
const strong = document.createElement("strong");
strong.textContent = "Bold Text";
element.appendChild(strong);

// ❌ BAD: innerHTML với user input
element.innerHTML = userInput; // XSS vulnerability!
```

### 3.2. Thay đổi Attributes

```javascript
const image = document.querySelector("img");

// getAttribute - Lấy giá trị attribute
const src = image.getAttribute("src");
console.log(src); // "image.jpg"

// setAttribute - Set giá trị attribute
image.setAttribute("src", "new-image.jpg");
image.setAttribute("alt", "New Image");

// removeAttribute - Xóa attribute
image.removeAttribute("title");

// hasAttribute - Kiểm tra có attribute không
if (image.hasAttribute("data-id")) {
    console.log("Has data-id");
}

// Direct property access (khuyến khích cho common attributes)
image.src = "another-image.jpg";
image.alt = "Another Image";
image.className = "thumbnail";
image.id = "main-image";
```

### 3.3. Data Attributes (HTML5)

```html
<div id="user" data-user-id="123" data-role="admin" data-active="true">
    User Info
</div>
```

```javascript
const user = document.getElementById("user");

// Cách 1: getAttribute
const userId = user.getAttribute("data-user-id"); // "123"

// Cách 2: dataset (ES5) - Khuyến khích
const userId2 = user.dataset.userId; // "123" (camelCase!)
const role = user.dataset.role; // "admin"
const isActive = user.dataset.active; // "true" (string)

// Set data attribute
user.dataset.lastLogin = "2025-12-22";
// Tạo: data-last-login="2025-12-22"
```

## 4. Thao tác Styles

### 4.1. Inline Styles

```javascript
const box = document.getElementById("box");

// Set individual style
box.style.backgroundColor = "blue";
box.style.width = "200px";
box.style.height = "200px";
box.style.borderRadius = "10px";

// Lưu ý: CSS property names → camelCase
// background-color → backgroundColor
// font-size → fontSize
// border-radius → borderRadius

// Set multiple styles
Object.assign(box.style, {
    backgroundColor: "red",
    width: "300px",
    height: "300px",
    transform: "rotate(45deg)"
});

// Get computed style (bao gồm cả CSS từ stylesheet)
const computedStyle = window.getComputedStyle(box);
console.log(computedStyle.backgroundColor); // "rgb(255, 0, 0)"
console.log(computedStyle.width); // "300px"
```

### 4.2. CSS Classes (Khuyến khích)

```javascript
const element = document.querySelector(".box");

// className - Thay thế toàn bộ classes
element.className = "box active"; // Ghi đè tất cả classes

// classList - API hiện đại (ES5)
element.classList.add("highlight"); // Thêm class
element.classList.remove("active"); // Xóa class
element.classList.toggle("visible"); // Toggle (có → xóa, không → thêm)
element.classList.replace("old-class", "new-class"); // Thay thế

// Kiểm tra có class không
if (element.classList.contains("active")) {
    console.log("Element is active");
}

// Thêm nhiều classes
element.classList.add("class1", "class2", "class3");
```

**Best Practice:**
```javascript
// ❌ BAD: Inline styles (khó maintain)
element.style.backgroundColor = "red";
element.style.fontSize = "20px";

// ✅ GOOD: CSS classes (separation of concerns)
element.classList.add("highlighted");

/* CSS */
.highlighted {
    background-color: red;
    font-size: 20px;
}
```

## 5. Tạo và Xóa Elements

### 5.1. Tạo Elements

```javascript
// 1. createElement - Tạo element mới
const newDiv = document.createElement("div");
newDiv.textContent = "I'm a new div!";
newDiv.className = "box";
newDiv.id = "new-box";

// 2. createTextNode - Tạo text node
const textNode = document.createTextNode("Hello World");

// 3. appendChild - Thêm vào cuối
document.body.appendChild(newDiv);

// 4. insertBefore - Thêm vào trước element khác
const container = document.getElementById("container");
const firstChild = container.firstChild;
container.insertBefore(newDiv, firstChild);

// 5. append (ES6) - Thêm nhiều nodes/strings
container.append(newDiv, "Some text", anotherElement);

// 6. prepend (ES6) - Thêm vào đầu
container.prepend(newDiv);

// 7. insertAdjacentHTML - Thêm HTML string
element.insertAdjacentHTML("beforebegin", "<p>Before</p>");
element.insertAdjacentHTML("afterbegin", "<p>First child</p>");
element.insertAdjacentHTML("beforeend", "<p>Last child</p>");
element.insertAdjacentHTML("afterend", "<p>After</p>");
```

### 5.2. Ví dụ thực tế: Tạo danh sách động

```javascript
const fruits = ["Apple", "Banana", "Orange", "Mango"];
const ul = document.createElement("ul");
ul.className = "fruit-list";

fruits.forEach(fruit => {
    const li = document.createElement("li");
    li.textContent = fruit;
    li.className = "fruit-item";
    
    // Thêm event listener
    li.addEventListener("click", () => {
        alert(`You clicked ${fruit}`);
    });
    
    ul.appendChild(li);
});

document.body.appendChild(ul);
```

### 5.3. Xóa Elements

```javascript
const element = document.getElementById("to-remove");

// Cách 1: remove() - Modern (ES6)
element.remove();

// Cách 2: removeChild() - Old way
const parent = element.parentNode;
parent.removeChild(element);

// Xóa tất cả children
const container = document.getElementById("container");
while (container.firstChild) {
    container.removeChild(container.firstChild);
}

// Hoặc đơn giản hơn:
container.innerHTML = ""; // Xóa tất cả (nhưng không remove event listeners!)

// Cách tốt nhất:
container.replaceChildren(); // ES2021
```

## 6. Traversing DOM (Di chuyển trong DOM)

### 6.1. Parent, Children, Siblings

```javascript
const element = document.getElementById("current");

// Parent
const parent = element.parentNode; // Bất kỳ node nào
const parentElement = element.parentElement; // Chỉ element node

// Children
const children = element.children; // HTMLCollection (chỉ elements)
const childNodes = element.childNodes; // NodeList (tất cả nodes)
const firstChild = element.firstElementChild;
const lastChild = element.lastElementChild;

// Siblings
const nextSibling = element.nextElementSibling;
const prevSibling = element.previousElementSibling;

// Closest ancestor matching selector (ES6)
const closestForm = element.closest("form");
const closestContainer = element.closest(".container");
```

### 6.2. Ví dụ: Navigation trong table

```javascript
const cell = document.querySelector("td");

// Lên hàng
const row = cell.parentElement; // <tr>

// Lên table
const table = row.closest("table");

// Sang cell bên cạnh
const nextCell = cell.nextElementSibling;

// Xuống hàng dưới
const nextRow = row.nextElementSibling;
const cellBelow = nextRow?.children[cell.cellIndex];
```

## 7. Event Handling

### 7.1. addEventListener

```javascript
const button = document.getElementById("myButton");

// Cách 1: addEventListener (Khuyến khích)
button.addEventListener("click", function(event) {
    console.log("Button clicked!");
    console.log("Event:", event);
    console.log("Target:", event.target);
});

// Arrow function
button.addEventListener("click", (e) => {
    console.log("Clicked with arrow function");
});

// Cách 2: Inline event handler (Không khuyến khích)
button.onclick = function() {
    console.log("Old way");
};

// Cách 3: HTML attribute (Tránh!)
// <button onclick="handleClick()">Click</button>
```

### 7.2. Event Types

```javascript
const input = document.querySelector("input");
const form = document.querySelector("form");

// Mouse events
element.addEventListener("click", handler);
element.addEventListener("dblclick", handler);
element.addEventListener("mouseenter", handler);
element.addEventListener("mouseleave", handler);
element.addEventListener("mousemove", handler);

// Keyboard events
input.addEventListener("keydown", handler);
input.addEventListener("keyup", handler);
input.addEventListener("keypress", handler); // Deprecated

// Form events
form.addEventListener("submit", handler);
input.addEventListener("change", handler);
input.addEventListener("input", handler); // Real-time input
input.addEventListener("focus", handler);
input.addEventListener("blur", handler);

// Window events
window.addEventListener("load", handler); // Page fully loaded
window.addEventListener("DOMContentLoaded", handler); // DOM ready
window.addEventListener("resize", handler);
window.addEventListener("scroll", handler);
```

### 7.3. Event Object

```javascript
button.addEventListener("click", (event) => {
    // Prevent default behavior
    event.preventDefault(); // Ngăn submit form, ngăn link navigate
    
    // Stop propagation
    event.stopPropagation(); // Ngăn event bubbling
    
    // Event properties
    console.log(event.type); // "click"
    console.log(event.target); // Element được click
    console.log(event.currentTarget); // Element có listener
    console.log(event.clientX, event.clientY); // Mouse position
    console.log(event.key); // Key pressed (keyboard events)
});
```

### 7.4. Event Delegation

```javascript
// ❌ BAD: Gắn listener cho từng item (tốn memory)
const items = document.querySelectorAll(".item");
items.forEach(item => {
    item.addEventListener("click", handleClick);
});

// ✅ GOOD: Event delegation (1 listener cho parent)
const list = document.getElementById("list");
list.addEventListener("click", (e) => {
    if (e.target.classList.contains("item")) {
        handleClick(e);
    }
});

// Hoặc dùng closest
list.addEventListener("click", (e) => {
    const item = e.target.closest(".item");
    if (item) {
        console.log("Clicked item:", item);
    }
});
```

## 8. Performance Best Practices

### 8.1. Minimize Reflows và Repaints

```javascript
// ❌ BAD: Nhiều reflows
for (let i = 0; i < 1000; i++) {
    const div = document.createElement("div");
    div.textContent = i;
    document.body.appendChild(div); // Reflow mỗi lần!
}

// ✅ GOOD: Batch DOM updates
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
    const div = document.createElement("div");
    div.textContent = i;
    fragment.appendChild(div);
}
document.body.appendChild(fragment); // Chỉ 1 reflow!
```

### 8.2. Cache DOM References

```javascript
// ❌ BAD: Query lại mỗi lần
for (let i = 0; i < 100; i++) {
    document.getElementById("counter").textContent = i;
}

// ✅ GOOD: Cache reference
const counter = document.getElementById("counter");
for (let i = 0; i < 100; i++) {
    counter.textContent = i;
}
```

### 8.3. Debouncing và Throttling

```javascript
// Debounce - Chỉ chạy sau khi user ngừng action
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

const searchInput = document.getElementById("search");
searchInput.addEventListener("input", debounce((e) => {
    console.log("Search:", e.target.value);
}, 300));

// Throttle - Giới hạn số lần chạy trong khoảng thời gian
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

window.addEventListener("scroll", throttle(() => {
    console.log("Scrolled");
}, 100));
```

## 9. Ví dụ thực tế: Todo List

```javascript
const todoInput = document.getElementById("todo-input");
const addButton = document.getElementById("add-button");
const todoList = document.getElementById("todo-list");

addButton.addEventListener("click", addTodo);
todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTodo();
});

function addTodo() {
    const text = todoInput.value.trim();
    if (!text) return;
    
    const li = document.createElement("li");
    li.className = "todo-item";
    
    const span = document.createElement("span");
    span.textContent = text;
    
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => li.remove());
    
    li.appendChild(span);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
    
    todoInput.value = "";
    todoInput.focus();
}
```

## Kết luận

DOM Manipulation là kỹ năng cốt lõi của mọi web developer. Hiểu rõ cách truy xuất, thao tác elements, xử lý events, và optimize performance sẽ giúp bạn xây dựng các ứng dụng web mượt mà và hiệu quả. Trong bài viết tiếp theo, chúng ta sẽ tìm hiểu về Functions và Events - cách tổ chức code JavaScript một cách chuyên nghiệp hơn.

## Tài liệu tham khảo

- [MDN - DOM Introduction](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)
- [JavaScript.info - DOM](https://javascript.info/document)
- "DOM Enlightenment" - Cody Lindley
- W3C DOM Specifications