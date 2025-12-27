# 🤖 Hướng dẫn Deploy RAG Chat - Đơn giản & Miễn phí

## 🎯 Tổng quan

**Mục tiêu**: Deploy RAG chatbot lên Vercel (free) để hoạt động trên GitHub Pages

**Thời gian**: ~30 phút  
**Chi phí**: $0 (Free tier)  
**Độ khó**: ⭐⭐ (Trung bình)

---

## 📋 Yêu cầu

### Đã có:
- ✅ GitHub account
- ✅ Portfolio trên GitHub Pages
- ✅ RAG code (MindMapNote project)

### Cần tạo:
- [ ] Vercel account (free)
- [ ] Supabase account (free) - nếu chưa có

---

## 🚀 Phương án đơn giản nhất

### Option 1: Sử dụng Gemini API (KHUYẾN NGHỊ)

**Ưu điểm:**
- ✅ Hoàn toàn miễn phí
- ✅ Không cần backend phức tạp
- ✅ Chạy trực tiếp trên frontend
- ✅ Không cần Vercel/Railway

**Cách hoạt động:**
```
User → Frontend (GitHub Pages) → Gemini API → Response
```

**Không cần:**
- ❌ Backend server
- ❌ Database
- ❌ Vector embeddings
- ❌ Deployment phức tạp

---

## 📝 Implementation - Simple RAG

### Step 1: Tạo Gemini API Key

1. Truy cập: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy API key

### Step 2: Tạo Simple RAG Widget

```javascript
// static/js/simple-rag.js

class SimpleRAG {
    constructor() {
        this.apiKey = 'YOUR_GEMINI_API_KEY'; // Hoặc lưu trong env
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        this.context = this.loadBlogContext();
    }

    // Load blog content as context
    loadBlogContext() {
        return `
        Bạn là AI assistant cho blog về Network Programming của Trần Thanh Thiện.
        
        Các chủ đề chính:
        1. SafeSense-Vi: Hate Speech Detection với PhoBERT (85% F1-Macro)
        2. MindMapNote: RAG System với pgvector
        3. Prepro TOEIC: EdTech platform với AI
        
        Tech stack: Python, PyTorch, FastAPI, React, TypeScript
        
        Trả lời câu hỏi về các dự án này một cách chuyên nghiệp.
        `;
    }

    async chat(userMessage) {
        try {
            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `${this.context}\n\nUser: ${userMessage}\n\nAssistant:`
                        }]
                    }]
                })
            });

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('RAG Error:', error);
            return 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.';
        }
    }
}

// Initialize
window.simpleRAG = new SimpleRAG();
```

### Step 3: Update Chat Widget

```javascript
// static/js/chat-widget.js

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Show user message
    addMessage(message, 'user');
    input.value = '';
    
    // Show loading
    showLoading();
    
    // Get response from Simple RAG
    const response = await window.simpleRAG.chat(message);
    
    // Hide loading and show response
    hideLoading();
    addMessage(response, 'assistant');
}
```

---

## 🔒 Bảo mật API Key

### Option A: Environment Variable (Vercel)

```javascript
// vercel.json
{
  "env": {
    "GEMINI_API_KEY": "@gemini-api-key"
  }
}

// In code
const apiKey = process.env.GEMINI_API_KEY;
```

### Option B: Serverless Function (Vercel)

```javascript
// api/chat.js
export default async function handler(req, res) {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Call Gemini API
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        }
    );
    
    const data = await response.json();
    res.json({ response: data.candidates[0].content.parts[0].text });
}
```

---

## 🎨 Complete Implementation

### File Structure:
```
NetworkingPrograming/
├── static/
│   ├── js/
│   │   ├── simple-rag.js       (NEW)
│   │   └── chat-widget.js      (UPDATE)
│   └── css/
│       └── chat-widget.css
├── api/                         (NEW - for Vercel)
│   └── chat.js
├── vercel.json                  (NEW)
└── .env.local                   (NEW)
```

### vercel.json:
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "public"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/public/$1"
    }
  ]
}
```

---

## 📦 Deployment Steps

### Step 1: Prepare Code

```bash
# 1. Add Vercel config
# Create vercel.json (see above)

# 2. Add API endpoint
mkdir -p api
# Create api/chat.js (see above)

# 3. Add environment variable
echo "GEMINI_API_KEY=your_key_here" > .env.local

# 4. Update .gitignore
echo ".env.local" >> .gitignore
```

### Step 2: Deploy to Vercel

```bash
# Option A: Using Vercel CLI
npm install -g vercel
vercel login
vercel --prod

# Option B: Using Vercel Dashboard
# 1. Go to vercel.com
# 2. Import GitHub repo
# 3. Add environment variable
# 4. Deploy
```

### Step 3: Update Frontend

```javascript
// Update API URL in chat-widget.js
const API_URL = 'https://your-project.vercel.app/api/chat';

async function sendMessage() {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
    });
    
    const data = await response.json();
    addMessage(data.response, 'assistant');
}
```

---

## 🎯 Phương án đơn giản hơn nữa

### Option 2: Client-side Only (Không cần backend)

**Ưu điểm:**
- ✅ Cực kỳ đơn giản
- ✅ Không cần deploy backend
- ✅ Chạy 100% trên GitHub Pages

**Nhược điểm:**
- ⚠️ API key visible (có thể bị abuse)
- ⚠️ Giới hạn rate limit

**Implementation:**

```javascript
// static/js/chat-widget.js
const GEMINI_API_KEY = 'YOUR_KEY'; // Hoặc prompt user nhập

async function chat(message) {
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: message }]
                }]
            })
        }
    );
    
    return await response.json();
}
```

**Bảo vệ API key:**
```javascript
// Prompt user to enter their own key
function initChat() {
    let apiKey = localStorage.getItem('gemini_api_key');
    
    if (!apiKey) {
        apiKey = prompt('Enter your Gemini API key (get free at makersuite.google.com):');
        localStorage.setItem('gemini_api_key', apiKey);
    }
    
    return new SimpleRAG(apiKey);
}
```

---

## 💡 So sánh các phương án

| Feature | Client-side | Vercel Serverless | Full Backend |
|---------|------------|-------------------|--------------|
| **Độ khó** | ⭐ Dễ | ⭐⭐ TB | ⭐⭐⭐ Khó |
| **Thời gian** | 10 phút | 30 phút | 2 giờ |
| **Chi phí** | Free | Free | $5/tháng |
| **Bảo mật** | ⚠️ Thấp | ✅ Tốt | ✅ Tốt |
| **Performance** | ✅ Nhanh | ✅ Nhanh | ⚠️ Cold start |
| **Maintenance** | ✅ Dễ | ✅ Dễ | ⚠️ Khó |

---

## 🎯 Khuyến nghị cho bạn

### Phương án tốt nhất: **Vercel Serverless**

**Lý do:**
1. ✅ Free tier đủ dùng
2. ✅ Bảo mật API key
3. ✅ Dễ deploy
4. ✅ Không cần maintain server
5. ✅ Auto-scale

**Steps:**
```bash
# 1. Tạo Gemini API key (5 phút)
# 2. Tạo api/chat.js (10 phút)
# 3. Deploy to Vercel (10 phút)
# 4. Update frontend (5 phút)
# Total: 30 phút
```

---

## 📝 Quick Start Script

Tôi có thể tạo sẵn code cho bạn:

```bash
# 1. Tạo API endpoint
# 2. Tạo Vercel config
# 3. Update chat widget
# 4. Hướng dẫn deploy

# Bạn chỉ cần:
# - Tạo Gemini API key
# - Chạy: vercel --prod
# - Done!
```

---

## ❓ FAQ

**Q: Có cần database không?**  
A: Không! Gemini API đủ cho chat đơn giản.

**Q: Có cần vector embeddings không?**  
A: Không! Có thể dùng context string đơn giản.

**Q: Chi phí bao nhiêu?**  
A: $0 - Gemini free tier: 60 requests/minute

**Q: Có khó không?**  
A: Không! Chỉ cần copy-paste code và deploy.

**Q: Bao lâu hoàn thành?**  
A: 30 phút nếu làm theo hướng dẫn.

---

## 🚀 Bạn muốn tôi làm gì?

**Option 1**: Tôi tạo sẵn code cho Simple RAG (client-side)  
**Option 2**: Tôi tạo sẵn code cho Vercel deployment  
**Option 3**: Tôi hướng dẫn từng bước chi tiết  

Bạn chọn option nào? 🤔
