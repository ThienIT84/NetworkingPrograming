---
title: "Làm Sao để 'Chat' với PDF? - Hành Trình Xây Dựng RAG System"
date: 2025-12-27T16:30:00+07:00
draft: false
description: "Câu chuyện về việc xây dựng MindMapNote - hệ thống cho phép bạn 'chat' với tài liệu PDF như đang chat với người thật. Từ ý tưởng đến thực tế, kể bằng ngôn ngữ con người, không phải robot!"
image: "/NetworkingPrograming/images/projects/RAG_chat-app.jpg"
tags: ["Python", "AI", "RAG", "Chatbot", "Case Study"]
categories: ["Lập trình web", "AI/ML"]
author: "Trần Thanh Thiện"
toc: true
---

## 🤔 Vấn Đề: Tôi Lười Đọc Sách

Hãy thành thật đi - ai cũng từng gặp tình huống này:

> **Giảng viên:** "Bài tập tuần này: Đọc 3 paper về Machine Learning, mỗi paper 20 trang."  
> **Tôi:** "Ơ... 60 trang? Chắc đọc lướt thôi..."  
> **Kết quả:** Thi xong không nhớ gì 😅

Rồi một ngày, tôi nghĩ: **"Sao không làm một con AI đọc hộ mình?"**

Không phải AI tóm tắt kiểu "copy-paste 3 câu đầu" - mà là AI **thực sự hiểu** nội dung, có thể **trả lời câu hỏi cụ thể**, và quan trọng nhất: **trích dẫn nguồn** để tôi biết nó không bịa!

Và thế là **MindMapNote** ra đời.

---

## 💡 Ý Tưởng: "ChatGPT Riêng" Cho Tài Liệu

Bạn biết ChatGPT không? Bạn hỏi gì nó cũng trả lời. Nhưng có 2 vấn đề:

1. **Nó không biết tài liệu của bạn** - Bạn upload PDF lên, nó không đọc được
2. **Nó hay bịa** - Hỏi về paper khoa học, nó trả lời nghe có vẻ đúng nhưng... sai bét!

**Solution:** Xây dựng một hệ thống:
- Upload PDF → AI đọc và "ghi nhớ"
- Hỏi câu hỏi → AI tìm trong tài liệu → Trả lời + Trích dẫn nguồn

Nghe đơn giản nhỉ? Nhưng thực tế...

---

## 😅 Thử Nghiệm Đầu Tiên: Thất Bại Toàn Tập

### Attempt #1: "Cho ChatGPT đọc toàn bộ PDF"

**Ý tưởng:** Copy toàn bộ nội dung PDF, paste vào ChatGPT.

**Kết quả:** 
```
❌ Error: Maximum context length exceeded
```

**Lý do:** ChatGPT chỉ nhớ được ~4000 từ. PDF của tôi có 15,000 từ. Fail!

### Attempt #2: "Tóm tắt PDF rồi hỏi"

**Ý tưởng:** Dùng AI tóm tắt PDF thành 1 trang, rồi hỏi dựa trên tóm tắt.

**Kết quả:** Mất hết chi tiết quan trọng. Hỏi về công thức toán → AI không biết vì đã bị tóm tắt mất.

### Attempt #3: "Google mỗi câu hỏi"

**Ý tưởng:** Thôi đọc thủ công, Ctrl+F tìm từ khóa.

**Kết quả:** Mất 30 phút để tìm 1 câu trả lời. Không scale!

---

## 🎯 Giải Pháp: RAG (Retrieval-Augmented Generation)

Sau 3 lần fail, tôi tìm ra **RAG** - một kỹ thuật AI thông minh:

### Cách Hoạt Động (Giải Thích Cho Người Không Biết Code)

Hãy tưởng tượng bạn đang thi vấn đáp:

**Cách thông thường (ChatGPT):**
```
Bạn: "Câu hỏi 1: TCP là gì?"
ChatGPT: *Nhớ lại kiến thức đã học* → Trả lời
```
→ Vấn đề: Nếu không học, không trả lời được!

**Cách RAG (Thông minh hơn):**
```
Bạn: "Câu hỏi 1: TCP là gì?"
AI: *Lật sách* → Tìm trang nói về TCP → Đọc → Trả lời
```
→ Lợi ích: Luôn có nguồn tham khảo, không bịa!

### Quy Trình 3 Bước

**Bước 1: "Ghi Nhớ" Tài Liệu**
- Upload PDF
- AI chia nhỏ thành từng đoạn (chunks)
- Chuyển mỗi đoạn thành "dấu vân tay số" (vector embedding)
- Lưu vào database

**Bước 2: "Tìm Kiếm Thông Minh"**
- Bạn hỏi: "TCP handshake là gì?"
- AI tìm 5 đoạn văn **liên quan nhất** trong tài liệu
- Không phải tìm từ khóa đơn thuần, mà tìm theo **ý nghĩa**

**Bước 3: "Trả Lời Có Căn Cứ"**
- AI đọc 5 đoạn văn đó
- Tổng hợp thành câu trả lời
- Kèm theo: "Thông tin từ trang 15, đoạn 3"

---

## 🏗️ Xây Dựng Hệ Thống

### Tech Stack (Không Sợ, Giải Thích Dễ Hiểu!)

**Frontend (Giao diện):**
- React - Để làm web đẹp
- TypeScript - Để code ít bug hơn

**Backend (Bộ não):**
- Python + FastAPI - Xử lý logic
- Sentence Transformers - Chuyển text thành số
- pgvector - Database lưu "dấu vân tay" của text

**AI Models:**
- Google Gemini - Trả lời câu hỏi (FREE!)
- Ollama - Chạy AI local (riêng tư, không tốn tiền)

### Kiến Trúc Hệ Thống (Vẽ Bằng Emoji!)

```
📱 User Interface (React)
    ↓ "Hỏi: TCP là gì?"
    
🧠 Backend (Python)
    ↓ Tìm kiếm trong database
    
💾 Vector Database (Supabase)
    ↓ Trả về 5 đoạn văn liên quan
    
🤖 AI (Gemini/Ollama)
    ↓ Đọc + Tổng hợp
    
💬 Câu trả lời + Nguồn trích dẫn
```

---

## 🎨 Features "Xịn Xò"

### 1. Hybrid Search: Tìm Cả Trong Lẫn Ngoài

Đôi khi tài liệu của bạn không đủ thông tin. Ví dụ:
- Bạn hỏi: "Tin tức AI mới nhất 2025?"
- Tài liệu của bạn: Viết năm 2023

**Solution:** Tìm kiếm kết hợp:
- **Internal**: Trong tài liệu của bạn
- **External**: Google search real-time (qua Tavily API)

Kết quả: Vừa có thông tin từ sách, vừa có tin tức mới nhất!

### 2. Multi-LLM: Chọn AI Theo Ý Thích

Giống như chọn nhà hàng ăn:
- **Gemini** (Google): Miễn phí, nhanh, tốt cho sinh viên
- **GPT-4** (OpenAI): Trả tiền, thông minh hơn, cho dân pro
- **Claude** (Anthropic): Giỏi phân tích, cho researcher
- **Ollama** (Local): Chạy trên máy, riêng tư 100%

### 3. Source Citation: Không Bao Giờ Bịa

Mỗi câu trả lời đều kèm:
- 📄 Tên file PDF
- 📖 Số trang
- 📊 Độ chính xác (similarity score)

Ví dụ:
> **Câu hỏi:** "TCP 3-way handshake là gì?"  
> **Trả lời:** "TCP 3-way handshake là quá trình thiết lập kết nối gồm 3 bước: SYN, SYN-ACK, ACK..."  
> **Nguồn:** `networking-textbook.pdf`, trang 45, độ chính xác 92%

---

## 😂 Những Lỗi "Hài Hước" Khi Làm

### Bug #1: AI Trả Lời... Tiếng Trung

**Tình huống:** Upload tài liệu tiếng Việt, hỏi tiếng Việt, AI trả lời tiếng Trung!

**Nguyên nhân:** Model embedding không hỗ trợ tiếng Việt tốt.

**Fix:** Đổi sang model `multilingual-mpnet` - Hỗ trợ 50+ ngôn ngữ, kể cả tiếng Việt!

### Bug #2: "Tìm Kiếm Quá Thông Minh"

**Tình huống:** 
- Hỏi: "TCP là gì?"
- AI trả lời về... "UDP"

**Nguyên nhân:** Vector search tìm theo "ý nghĩa", nên thấy TCP và UDP giống nhau (đều là giao thức mạng).

**Fix:** Tăng số lượng chunks từ 3 lên 5, để có nhiều context hơn.

### Bug #3: Server Crash Vì... Quá Nhanh

**Tình huống:** Test với 100 requests cùng lúc → Server chết!

**Nguyên nhân:** Model embedding load 100 lần → Hết RAM.

**Fix:** Load model 1 lần duy nhất khi start server, reuse cho mọi requests.

---

## 📊 Kết Quả Thực Tế

### Performance

| Thao tác | Thời gian | Cảm nhận |
|----------|-----------|----------|
| Upload PDF | 15-20s | ☕ Uống nước đợi |
| Tìm kiếm | 80ms | ⚡ Nhanh như chớp |
| Trả lời AI | 2-3s | 🚀 Chấp nhận được |
| **Tổng cộng** | **~3s** | 😊 Hài lòng |

### So Sánh Với Cách Cũ

**Trước khi có RAG:**
- Đọc 1 paper: 2-3 giờ
- Tìm 1 thông tin: 10-15 phút
- Nhớ được: 30% sau 1 tuần

**Sau khi có RAG:**
- "Đọc" 1 paper: 20 giây (upload)
- Tìm 1 thông tin: 3 giây
- Nhớ được: 100% (vì AI nhớ hộ!)

---

## 🎓 Bài Học Rút Ra

### 1. "Perfect is the enemy of good"

Ban đầu tôi muốn làm "siêu phẩm":
- Support mọi file format (PDF, DOCX, PPT, ...)
- AI siêu thông minh
- UI siêu đẹp

**Kết quả:** Mất 2 tuần mà chưa làm được gì!

**Bài học:** Làm MVP (Minimum Viable Product) trước:
- Chỉ support PDF
- Dùng AI free (Gemini)
- UI đơn giản

Sau đó mới cải tiến dần!

### 2. "User feedback > Your assumptions"

Tôi nghĩ user sẽ thích:
- Nhiều options để customize
- Nhiều AI models để chọn
- Nhiều settings phức tạp

**Thực tế:** User chỉ cần:
- Upload PDF
- Hỏi câu hỏi
- Nhận câu trả lời

**Bài học:** Làm đơn giản, dễ dùng. Đừng over-engineer!

### 3. "Open source saves time"

Thay vì tự code mọi thứ từ đầu:
- Dùng Supabase → Tiết kiệm 1 tháng làm backend
- Dùng LangChain → Tiết kiệm 2 tuần làm RAG pipeline
- Dùng shadcn/ui → Tiết kiệm 1 tuần làm UI

**Bài học:** Đừng ngại dùng thư viện/framework. Thời gian là vàng!

---

## 🚀 Tương Lai

### Những Gì Sẽ Làm Tiếp

**Short-term (1-2 tháng):**
- [ ] Support DOCX, TXT files
- [ ] Conversation memory (nhớ câu hỏi trước)
- [ ] Export chat history to PDF

**Mid-term (3-6 tháng):**
- [ ] Mobile app (React Native)
- [ ] Collaborative features (share docs với team)
- [ ] Analytics dashboard

**Long-term (1 năm):**
- [ ] AI tự động tóm tắt tài liệu
- [ ] Flashcards tự động từ PDF
- [ ] Integration với Notion, Google Drive

---

## 💬 Kết Luận

Xây dựng RAG system không khó như tưởng tượng. Quan trọng là:

1. **Hiểu vấn đề thực tế** - Đừng làm tech vì tech
2. **Start small** - MVP trước, hoàn thiện sau
3. **Leverage open source** - Đứng trên vai người khổng lồ
4. **Listen to users** - Họ biết họ cần gì hơn bạn

Và quan trọng nhất: **Đừng sợ fail!** Tôi đã fail 3 lần trước khi tìm ra RAG. Mỗi lần fail là một bài học.

---

## 🎁 Bonus: Demo Thực Tế

Muốn thử? Đây là flow thực tế:

**1. Upload PDF**
```
User: *Kéo thả file networking-textbook.pdf*
System: ✅ Đã upload! Đang xử lý... (15s)
System: ✅ Hoàn tất! Bạn có thể hỏi câu hỏi rồi.
```

**2. Hỏi câu hỏi**
```
User: "TCP 3-way handshake hoạt động như thế nào?"

System: *Đang tìm kiếm...* (80ms)
System: *Đang tạo câu trả lời...* (2s)

AI: "TCP 3-way handshake là quá trình thiết lập kết nối gồm 3 bước:

1. **SYN**: Client gửi gói tin SYN đến Server
2. **SYN-ACK**: Server phản hồi SYN-ACK
3. **ACK**: Client gửi ACK xác nhận

Sau 3 bước này, kết nối TCP được thiết lập."

📚 Nguồn: networking-textbook.pdf, trang 45 (độ chính xác: 94%)
```

**3. Hỏi tiếp**
```
User: "Tại sao cần 3 bước, không phải 2 bước?"

AI: "Cần 3 bước để đảm bảo cả Client và Server đều:
- Xác nhận được khả năng gửi dữ liệu
- Xác nhận được khả năng nhận dữ liệu
- Đồng bộ sequence numbers

Nếu chỉ 2 bước, Server không biết Client có nhận được SYN-ACK không."

📚 Nguồn: networking-textbook.pdf, trang 46 (độ chính xác: 91%)
```

---

## 📚 Tài Liệu Tham Khảo

**Cho người mới bắt đầu:**
- [RAG for Beginners](https://youtu.be/Sg-jLHRTufQ?si=JMNiKojbKqGkq0J3) - Video giải thích dễ hiểu
- [LangChain Crash Course](https://python.langchain.com/) - Học RAG trong 1 giờ

**Cho người muốn đi sâu:**
- [RAG Paper (Lewis et al., 2020)](https://arxiv.org/abs/2005.11401) - Paper gốc về RAG
- [pgvector Documentation](https://github.com/pgvector/pgvector) - Vector database

**Community:**
- [r/MachineLearning](https://congdongai.vn/) - Hỏi đáp về AI
- [LangChain Discord](https://discord.gg/langchain) - Cộng đồng RAG

---

*Bài viết được viết bởi Trần Thanh Thiện - Một sinh viên lười đọc sách, nhưng thích làm AI đọc hộ 😄*

*📧 Có câu hỏi? Comment bên dưới hoặc DM mình!*  
*⭐ Nếu thấy hay, cho mình một star trên GitHub nhé!*
