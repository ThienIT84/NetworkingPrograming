---
title: "Tự làm Chatbot AI tích hợp vào Website bằng Fetch API"
date: 2025-12-19T15:00:00+07:00
draft: false
description: "Hướng dẫn chi tiết cách sử dụng JavaScript Fetch API để kết nối với các API AI (OpenAI, Gemini, Claude), xây dựng chatbot tương tác, và xử lý streaming responses."
image: "/NetworkingPrograming/images/projects/chatbot-api.jpg"
tags: ["JavaScript", "API", "Chatbot", "AI", "Fetch", "Async"]
categories: ["Web Development"]
---

## Giới thiệu

Trong kỷ nguyên AI, việc tích hợp chatbot thông minh vào website không còn là điều xa vời. Với **Fetch API** - một công cụ mạnh mẽ có sẵn trong JavaScript hiện đại, bạn có thể dễ dàng kết nối với các Large Language Models (LLM) như GPT, Gemini, Claude để tạo ra trải nghiệm tương tác ấn tượng. Bài viết này sẽ hướng dẫn bạn từ cơ bản đến nâng cao về cách xây dựng chatbot AI.

## 1. Fetch API - Nền tảng giao tiếp mạng

### 1.1. Fetch API là gì?

**Fetch API** là một interface hiện đại trong JavaScript để thực hiện các HTTP requests. Nó thay thế cho `XMLHttpRequest` cũ kỹ với cú pháp đơn giản hơn và hỗ trợ Promises.

**Đặc điểm:**
- Built-in trong mọi trình duyệt hiện đại
- Sử dụng Promises → dễ kết hợp với async/await
- Hỗ trợ đầy đủ HTTP methods (GET, POST, PUT, DELETE, etc.)
- Streaming support
- CORS-aware

### 1.2. Cú pháp cơ bản

```javascript
// GET request đơn giản
fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

// Với async/await (khuyến khích)
async function getData() {
    try {
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
}
```

### 1.3. HTTP Methods

```javascript
// GET - Lấy dữ liệu
const response = await fetch('https://api.example.com/users');

// POST - Gửi dữ liệu
const response = await fetch('https://api.example.com/users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: 'Thiện',
        email: 'thien@example.com'
    })
});

// PUT - Cập nhật toàn bộ
const response = await fetch('https://api.example.com/users/123', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: 'Thanh Thiện',
        email: 'thanhthien@example.com'
    })
});

// PATCH - Cập nhật một phần
const response = await fetch('https://api.example.com/users/123', {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: 'newemail@example.com'
    })
});

// DELETE - Xóa
const response = await fetch('https://api.example.com/users/123', {
    method: 'DELETE'
});
```

### 1.4. Headers và Authentication

```javascript
// Headers cơ bản
const response = await fetch('https://api.example.com/data', {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'MyApp/1.0'
    }
});

// Bearer Token Authentication
const response = await fetch('https://api.example.com/protected', {
    headers: {
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'Content-Type': 'application/json'
    }
});

// API Key Authentication
const response = await fetch('https://api.example.com/data', {
    headers: {
        'X-API-Key': 'your-api-key-here'
    }
});

// Basic Authentication
const username = 'user';
const password = 'pass';
const credentials = btoa(`${username}:${password}`);

const response = await fetch('https://api.example.com/data', {
    headers: {
        'Authorization': `Basic ${credentials}`
    }
});
```

### 1.5. Response Handling

```javascript
const response = await fetch('https://api.example.com/data');

// Kiểm tra status
console.log(response.status); // 200, 404, 500, etc.
console.log(response.ok); // true nếu status 200-299

if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
}

// Parse response
const jsonData = await response.json(); // JSON
const textData = await response.text(); // Plain text
const blobData = await response.blob(); // Binary (images, files)
const formData = await response.formData(); // Form data
const arrayBuffer = await response.arrayBuffer(); // Raw binary

// Headers
console.log(response.headers.get('Content-Type'));
console.log(response.headers.get('Date'));

// Clone response (chỉ đọc được 1 lần)
const clone = response.clone();
const data1 = await response.json();
const data2 = await clone.json();
```

## 2. Kết nối với AI APIs

### 2.1. OpenAI API (GPT)

```javascript
const OPENAI_API_KEY = 'your-api-key-here';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

async function chatWithGPT(userMessage, conversationHistory = []) {
    try {
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo', // hoặc 'gpt-4'
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant.'
                    },
                    ...conversationHistory,
                    {
                        role: 'user',
                        content: userMessage
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error.message);
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        
        return aiResponse;

    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw error;
    }
}

// Sử dụng
const answer = await chatWithGPT('Xin chào! Bạn là ai?');
console.log('AI:', answer);
```

### 2.2. Google Gemini API

```javascript
const GEMINI_API_KEY = 'your-gemini-api-key';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

async function chatWithGemini(userMessage) {
    try {
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: userMessage
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        return aiResponse;

    } catch (error) {
        console.error('Gemini API Error:', error);
        throw error;
    }
}

// Sử dụng
const answer = await chatWithGemini('Giải thích về lập trình mạng');
console.log('Gemini:', answer);
```

### 2.3. Anthropic Claude API

```javascript
const CLAUDE_API_KEY = 'your-claude-api-key';
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

async function chatWithClaude(userMessage) {
    try {
        const response = await fetch(CLAUDE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 1024,
                messages: [{
                    role: 'user',
                    content: userMessage
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`Claude API error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.content[0].text;
        
        return aiResponse;

    } catch (error) {
        console.error('Claude API Error:', error);
        throw error;
    }
}
```

## 3. Xây dựng Chatbot UI

### 3.1. HTML Structure

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Chatbot</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="chat-container">
        <div class="chat-header">
            <h2>🤖 AI Assistant</h2>
            <button id="clearBtn">Clear Chat</button>
        </div>
        
        <div id="chatMessages" class="chat-messages">
            <!-- Messages sẽ được thêm vào đây -->
        </div>
        
        <div class="chat-input-container">
            <textarea 
                id="userInput" 
                placeholder="Nhập tin nhắn của bạn..."
                rows="1"
            ></textarea>
            <button id="sendBtn">
                <span>Send</span>
                <span class="loading" style="display: none;">...</span>
            </button>
        </div>
    </div>
    
    <script src="chatbot.js"></script>
</body>
</html>
```

### 3.2. CSS Styling

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.chat-container {
    width: 100%;
    max-width: 800px;
    height: 600px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.chat-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chat-header h2 {
    font-size: 24px;
}

#clearBtn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    transition: background 0.3s;
}

#clearBtn:hover {
    background: rgba(255, 255, 255, 0.3);
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background: #f5f5f5;
}

.message {
    margin-bottom: 16px;
    display: flex;
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.message.user {
    justify-content: flex-end;
}

.message-content {
    max-width: 70%;
    padding: 12px 16px;
    border-radius: 18px;
    line-height: 1.5;
}

.message.user .message-content {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-bottom-right-radius: 4px;
}

.message.ai .message-content {
    background: white;
    color: #333;
    border-bottom-left-radius: 4px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.chat-input-container {
    padding: 20px;
    background: white;
    border-top: 1px solid #e0e0e0;
    display: flex;
    gap: 10px;
}

#userInput {
    flex: 1;
    padding: 12px;
    border: 2px solid #e0e0e0;
    border-radius: 24px;
    font-size: 14px;
    resize: none;
    font-family: inherit;
    transition: border-color 0.3s;
}

#userInput:focus {
    outline: none;
    border-color: #667eea;
}

#sendBtn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 24px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: transform 0.2s;
}

#sendBtn:hover {
    transform: scale(1.05);
}

#sendBtn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.typing-indicator {
    display: flex;
    gap: 4px;
    padding: 12px 16px;
}

.typing-indicator span {
    width: 8px;
    height: 8px;
    background: #999;
    border-radius: 50%;
    animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes typing {
    0%, 60%, 100% {
        transform: translateY(0);
    }
    30% {
        transform: translateY(-10px);
    }
}
```

### 3.3. JavaScript Logic

```javascript
// Configuration
const API_CONFIG = {
    provider: 'openai', // 'openai', 'gemini', hoặc 'claude'
    apiKey: 'your-api-key-here',
    model: 'gpt-3.5-turbo'
};

// State
let conversationHistory = [];
let isProcessing = false;

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadChatHistory();
    setupEventListeners();
});

function setupEventListeners() {
    sendBtn.addEventListener('click', handleSend);
    
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });
    
    clearBtn.addEventListener('click', clearChat);
    
    // Auto-resize textarea
    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = userInput.scrollHeight + 'px';
    });
}

async function handleSend() {
    const message = userInput.value.trim();
    
    if (!message || isProcessing) return;
    
    // Add user message
    addMessage(message, 'user');
    conversationHistory.push({role: 'user', content: message});
    
    // Clear input
    userInput.value = '';
    userInput.style.height = 'auto';
    
    // Show typing indicator
    const typingId = showTypingIndicator();
    
    // Disable input
    isProcessing = true;
    sendBtn.disabled = true;
    
    try {
        // Get AI response
        const aiResponse = await getAIResponse(message);
        
        // Remove typing indicator
        removeTypingIndicator(typingId);
        
        // Add AI message
        addMessage(aiResponse, 'ai');
        conversationHistory.push({role: 'assistant', content: aiResponse});
        
        // Save to localStorage
        saveChatHistory();
        
    } catch (error) {
        removeTypingIndicator(typingId);
        addMessage('Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.', 'ai');
        console.error('Error:', error);
    } finally {
        isProcessing = false;
        sendBtn.disabled = false;
        userInput.focus();
    }
}

async function getAIResponse(message) {
    const url = 'https://api.openai.com/v1/chat/completions';
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_CONFIG.apiKey}`
        },
        body: JSON.stringify({
            model: API_CONFIG.model,
            messages: [
                {
                    role: 'system',
                    content: 'Bạn là một trợ lý AI thông minh và hữu ích. Hãy trả lời bằng tiếng Việt.'
                },
                ...conversationHistory.slice(-10), // Giữ 10 tin nhắn gần nhất
                {
                    role: 'user',
                    content: message
                }
            ],
            temperature: 0.7,
            max_tokens: 500
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error.message);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const id = 'typing-' + Date.now();
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai';
    messageDiv.id = id;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content typing-indicator';
    contentDiv.innerHTML = '<span></span><span></span><span></span>';
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return id;
}

function removeTypingIndicator(id) {
    const element = document.getElementById(id);
    if (element) {
        element.remove();
    }
}

function clearChat() {
    if (confirm('Bạn có chắc muốn xóa toàn bộ cuộc trò chuyện?')) {
        chatMessages.innerHTML = '';
        conversationHistory = [];
        localStorage.removeItem('chatHistory');
    }
}

function saveChatHistory() {
    localStorage.setItem('chatHistory', JSON.stringify(conversationHistory));
}

function loadChatHistory() {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
        conversationHistory = JSON.parse(saved);
        conversationHistory.forEach(msg => {
            addMessage(msg.content, msg.role === 'user' ? 'user' : 'ai');
        });
    }
}
```

## 4. Streaming Responses

### 4.1. Server-Sent Events (SSE)

```javascript
async function streamAIResponse(message) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_CONFIG.apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{role: 'user', content: message}],
            stream: true // Enable streaming
        })
    });
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let aiMessage = '';
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai';
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    while (true) {
        const {done, value} = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;
                
                try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices[0]?.delta?.content || '';
                    aiMessage += content;
                    contentDiv.textContent = aiMessage;
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                } catch (e) {
                    console.error('Parse error:', e);
                }
            }
        }
    }
    
    return aiMessage;
}
```

## 5. Error Handling và Best Practices

### 5.1. Comprehensive Error Handling

```javascript
async function robustAPICall(message) {
    const maxRetries = 3;
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{role: 'user', content: message}]
                }),
                signal: AbortSignal.timeout(30000) // 30s timeout
            });
            
            if (response.status === 429) {
                // Rate limit - wait and retry
                const retryAfter = response.headers.get('Retry-After') || 5;
                await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
                continue;
            }
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'API Error');
            }
            
            const data = await response.json();
            return data.choices[0].message.content;
            
        } catch (error) {
            lastError = error;
            
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            
            if (i === maxRetries - 1) {
                throw lastError;
            }
            
            // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
    }
    
    throw lastError;
}
```

### 5.2. Security Best Practices

```javascript
// ❌ KHÔNG BAO GIỜ làm thế này!
const API_KEY = 'sk-abc123...'; // Hardcode API key trong frontend

// ✅ Sử dụng Backend Proxy
async function secureAPICall(message) {
    // Gọi backend của bạn
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Session token thay vì API key
            'Authorization': `Bearer ${userSessionToken}`
        },
        body: JSON.stringify({message})
    });
    
    return await response.json();
}

// Backend (Node.js Express example)
app.post('/api/chat', authenticateUser, async (req, res) => {
    const {message} = req.body;
    
    // API key được lưu an toàn trên server
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{role: 'user', content: message}]
        })
    });
    
    const data = await response.json();
    res.json(data);
});
```

## Kết luận

Fetch API là công cụ mạnh mẽ để kết nối frontend với các AI services. Kết hợp với các LLM APIs như OpenAI, Gemini, hay Claude, bạn có thể tạo ra những chatbot thông minh và tương tác ngay trên website của mình. Tuy nhiên, hãy nhớ luôn bảo vệ API keys và xử lý errors một cách cẩn thận để đảm bảo trải nghiệm người dùng tốt nhất.

## Tài liệu tham khảo

- [MDN - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Google Gemini API](https://ai.google.dev/docs)
- [Anthropic Claude API](https://docs.anthropic.com/claude/reference)
- [Streaming with Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)