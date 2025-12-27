# 🤖 Blog AI Chat Assistant

## Overview
AI-powered chatbot integrated into the blog page that answers questions about Network Programming topics using RAG (Retrieval-Augmented Generation) technology.

## Features
- ✅ Interactive chat interface
- ✅ Real-time responses (mock mode for demo)
- ✅ Source citations linking to blog posts
- ✅ Example questions for easy start
- ✅ Responsive design
- ✅ Dark mode support

## Files Created
```
static/
├── css/
│   └── chat-widget.css          # Chat UI styling
└── js/
    └── chat-widget.js            # Chat functionality

layouts/
├── partials/
│   └── blog-chat.html            # Chat widget HTML
└── shortcodes/
    └── blog-chat.html            # Hugo shortcode

content/blogs/
└── _index.md                     # Updated with chat section
```

## Current Status: DEMO MODE

The chatbot is currently running in **mock mode** with pre-defined responses for demonstration purposes.

### Mock Responses Available:
- TCP 3-way handshake
- TCP vs UDP comparison
- Java Socket Server code examples
- SSL/TLS explanation
- Multi-threading concepts

### To Enable Real RAG Backend:

1. **Update API endpoint** in `static/js/chat-widget.js`:
   ```javascript
   const CONFIG = {
       API_ENDPOINT: 'https://your-rag-api.railway.app/api/chat',
       USE_MOCK: false  // Set to false
   };
   ```

2. **Deploy RAG backend** (see Backend Setup below)

## Backend Setup (Optional)

### Option 1: Use Existing RAG Project
If you already have a RAG backend from your project:
1. Add CORS configuration for GitHub Pages domain
2. Create `/api/chat` endpoint that accepts:
   ```json
   {
     "question": "string",
     "user_id": "string"
   }
   ```
3. Return format:
   ```json
   {
     "answer": "string",
     "sources": [
       {"title": "string", "url": "string"}
     ]
   }
   ```

### Option 2: Create New Backend
See `implementation_plan.md` for detailed backend setup instructions.

## Testing Locally

1. **Start Hugo server:**
   ```bash
   hugo server -D
   ```

2. **Navigate to blog page:**
   ```
   http://localhost:1313/NetworkingPrograming/blogs/
   ```

3. **Test chat widget:**
   - Try example questions
   - Type custom questions
   - Verify mock responses work

## Demo Script for Instructor

**Opening:**
> "Thầy/Cô để em demo một feature đặc biệt - AI Chat Assistant được tích hợp vào blog."

**Demo Steps:**
1. Scroll to chat widget on blog page
2. Click an example question: "Giải thích TCP 3-way handshake"
3. Show response with source citations
4. Click citation link to navigate to blog post
5. Explain RAG technology:
   > "Chatbot này sử dụng RAG - Retrieval-Augmented Generation. Nó search trong 13 bài blog bằng semantic search, sau đó dùng LLM để tổng hợp câu trả lời. Hiện tại em đang dùng mock responses để demo, nhưng backend thực tế đã được implement trong đồ án chuyên ngành của em."

**Key Points to Highlight:**
- ✅ Kết hợp 2 projects (Network Programming + AI/ML)
- ✅ Interactive user experience
- ✅ Source citations for credibility
- ✅ Modern web technologies

## Customization

### Add More Mock Responses
Edit `static/js/chat-widget.js`, function `getMockResponse()`:
```javascript
const responses = {
    'your_keyword': {
        answer: 'Your answer here...',
        sources: [
            { title: 'Blog Title', url: '/path/to/blog/' }
        ]
    }
};
```

### Styling
Modify `static/css/chat-widget.css` to change:
- Colors
- Fonts
- Layout
- Animations

## Troubleshooting

### Chat widget not showing
- Check Hugo server is running
- Verify shortcode syntax in `_index.md`
- Check browser console for errors

### Responses not working
- Verify `chat-widget.js` is loaded
- Check `USE_MOCK` is set to `true`
- Open browser console to see errors

### Styling issues
- Clear browser cache
- Check `chat-widget.css` is loaded
- Verify CSS file path in partial

## Future Enhancements

- [ ] Connect to real RAG backend
- [ ] Add conversation history
- [ ] Support file upload for context
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Analytics tracking

## Technical Stack

- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Framework:** Hugo Static Site Generator
- **Backend (planned):** FastAPI + LangChain + Supabase
- **AI:** RAG (Retrieval-Augmented Generation)
- **Deployment:** GitHub Pages (frontend)

## Credits

Built by Trần Thanh Thiện as part of Network Programming course project.
Integrates RAG technology from AI/ML specialization project.
