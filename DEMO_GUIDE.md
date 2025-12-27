# 🎯 HƯỚNG DẪN DEMO PORTFOLIO - Trần Thanh Thiện

## 📋 Checklist Chuẩn bị (5 phút trước demo)

### ✅ Technical Setup
- [ ] Chạy `hugo server` - đảm bảo site đang chạy
- [ ] Mở browser ở chế độ full screen (F11)
- [ ] Clear cache và cookies (Ctrl + Shift + Delete)
- [ ] Test cả Light mode và Dark mode
- [ ] Test chuyển đổi ngôn ngữ (Tiếng Việt ↔ English)
- [ ] Đóng tất cả tabs không cần thiết
- [ ] Chuẩn bị backup slides/notes nếu cần

### ✅ Content Preparation
- [ ] Đọc lại nội dung các dự án chính
- [ ] Chuẩn bị câu trả lời cho câu hỏi thường gặp
- [ ] Có sẵn GitHub repos để show code nếu được hỏi
- [ ] Chuẩn bị metrics/numbers quan trọng (85% F1-Macro, 12K samples, etc.)

---

## 🎬 TRÌNH TỰ DEMO (15-20 phút)

### **PHẦN 1: GIỚI THIỆU TỔNG QUAN** (2-3 phút)

#### 1.1 Landing Page - First Impression
**URL:** `http://localhost:1313/NetworkingPrograming/`

**Script:**
> "Xin chào, tôi là Trần Thanh Thiện, sinh viên năm 4 HUTECH, chuyên về AI Engineering. 
> Đây là portfolio của tôi, được build bằng Hugo và deploy trên GitHub Pages."

**Điểm nhấn:**
- ✨ Giới thiệu ngắn gọn về bản thân
- 🎓 GPA 3.65/4.0
- 🤖 Focus: Machine Learning, NLP, RAG Systems

**Demo actions:**
1. Scroll từ từ qua Hero section
2. Highlight social links (GitHub, LinkedIn)
3. Click "Tải CV" để show CV page (mở tab mới)
4. Quay lại trang chính

---

### **PHẦN 2: TECHNICAL SKILLS** (2 phút)

#### 2.1 About Me Section
**Scroll đến:** `#about`

**Script:**
> "Về kỹ năng, tôi có kinh nghiệm với full stack AI development..."

**Điểm nhấn:**
- 🐍 **Backend:** Python, FastAPI, PyTorch
- ⚛️ **Frontend:** React, TypeScript, TailwindCSS
- 🤖 **AI/ML:** PhoBERT, Transformers, LangChain
- 🗄️ **Databases:** Supabase pgvector, PostgreSQL

**Demo actions:**
1. Scroll qua skills list
2. Nhấn mạnh: "Không chỉ làm model, mà còn deploy production-ready systems"

---

### **PHẦN 3: DỰ ÁN CHÍNH** (10-12 phút) ⭐ QUAN TRỌNG NHẤT

#### 3.1 SafeSense-Vi - Hate Speech Detection (4 phút)
**Scroll đến:** `#projects` → Click "Chi tiết"

**Script:**
> "Dự án đầu tiên là SafeSense-Vi - hệ thống phát hiện hate speech tiếng Việt.
> Đây là research project với dataset 12,695 samples được gán nhãn thủ công."

**Điểm nhấn chính:**
- 📊 **Metrics:** F1-Macro 85% (impressive cho Vietnamese NLP)
- 🏷️ **Dataset:** 12,695 samples, 6 categories
- 🔧 **Tech:** PhoBERT fine-tuning, Active Learning
- 💡 **Innovation:** 
  - Context-aware labeling methodology
  - Teencode normalization (251+ rules)
  - Intensity preservation

**Demo flow:**
1. **Show blog post** - scroll qua các sections:
   - Problem Statement
   - Dataset Statistics (show charts nếu có)
   - Model Architecture
   - Results & Metrics
   
2. **Highlight challenges:**
   - Imbalanced data → Active Learning
   - Teencode → Custom preprocessing
   - Context-dependent labels

3. **Show GitHub repo** (nếu có thời gian):
   - Dataset structure
   - Training code
   - Evaluation metrics

**Câu hỏi có thể gặp:**
- *"Tại sao chọn PhoBERT?"* → Pre-trained cho tiếng Việt, SOTA performance
- *"Làm sao handle imbalanced data?"* → Active Learning + class weights
- *"Dataset từ đâu?"* → Crawl từ social media (Facebook) + manual labeling

---

#### 3.2 MindMapNote - RAG System (4 phút)
**Back to Projects** → Click "Chi tiết" (MindMapNote)

**Script:**
> "Dự án thứ hai là MindMapNote - RAG system cho phép 'chat' với PDF documents.
> Đây là full-stack application với vector database và semantic search."

**Điểm nhấn chính:**
- 🔍 **Core Feature:** Semantic search với pgvector
- 🧠 **Architecture:** 
  - Vector embeddings (Sentence Transformers)
  - Hybrid retrieval (Internal + Web search)
  - Multi-LLM support (Gemini, GPT-4, Ollama)
- 📚 **Use Case:** Study assistant, document Q&A

**Demo flow:**
1. **Explain RAG concept:**
   - "RAG = Retrieval-Augmented Generation"
   - "Không chỉ chat, mà chat với context từ documents"

2. **Show architecture:**
   - PDF → Chunking → Embeddings → pgvector
   - Query → Semantic search → Context → LLM → Response

3. **Highlight technical depth:**
   - Cosine similarity for retrieval
   - Context window optimization
   - Source citation

**Câu hỏi có thể gặp:**
- *"Tại sao dùng pgvector?"* → Native PostgreSQL, production-ready, free
- *"Chunking strategy?"* → Recursive character splitting, overlap 200 chars
- *"Accuracy?"* → Context-aware, cite sources, user can verify

---

#### 3.3 Prepro TOEIC - EdTech Platform (3 phút)
**Back to Projects** → Click "Xem chi tiết" (Prepro TOEIC)

**Script:**
> "Dự án cuối là Prepro TOEIC - nền tảng học TOEIC với AI question generation.
> Đây là production app với MVC architecture và 95% test coverage."

**Điểm nhấn chính:**
- 🎓 **Domain:** EdTech, Language Learning
- 🤖 **AI Feature:** Auto-generate questions với Groq (Llama 3.1-8B)
- 🧠 **Algorithm:** Spaced Repetition (SM-2) cho optimal retention
- 📊 **Analytics:** Real-time dashboard cho giáo viên

**Demo flow:**
1. **Show business value:**
   - Giảm workload cho giáo viên (auto-generate questions)
   - Tăng hiệu quả học (Spaced Repetition)
   - Data-driven insights

2. **Highlight engineering:**
   - MVC architecture
   - 95% test coverage
   - Type-safe với TypeScript
   - State management với Zustand

**Câu hỏi có thể gặp:**
- *"Tại sao chọn Groq?"* → Fast inference, free tier, good quality
- *"Spaced Repetition hoạt động thế nào?"* → SM-2 algorithm, adjust intervals based on performance
- *"Production-ready?"* → Yes, có testing, error handling, analytics

---

### **PHẦN 4: EXPERIENCE & EDUCATION** (2 phút)

#### 4.1 Experience Section
**Scroll đến:** `#experience`

**Script ngắn gọn:**
> "Về kinh nghiệm, tôi đã thực tập tại Tech Startup làm AI Engineer,
> và làm Research Assistant tại HUTECH AI Lab."

**Điểm nhấn:**
- Hands-on experience với production ML
- Research experience với academic projects

#### 4.2 Education Section
**Scroll đến:** `#education`

**Script:**
> "Tôi đang học năm 4 tại HUTECH, major Machine Learning & AI, GPA 3.65/4.0"

**Highlight coursework:**
- Deep Learning & Neural Networks
- Natural Language Processing
- Computer Vision
- Network Programming

---

### **PHẦN 5: CERTIFICATIONS** (1 phút)

**Scroll đến:** `#achievements`

**Script ngắn:**
> "Tôi có một số certifications về JavaScript và Networking Basics từ Cisco."

**Demo actions:**
- Scroll qua các certificates
- Click vào PDF nếu được hỏi

---

### **PHẦN 6: BLOG & TECHNICAL WRITING** (2 phút)

#### 6.1 Blog Section
**Click:** "Blog" trên navbar

**Script:**
> "Ngoài code, tôi còn viết technical blog để document learning journey."

**Demo actions:**
1. Show blog listing page
2. Click vào 1-2 blog posts
3. Highlight:
   - Technical depth
   - Code examples
   - Clear explanations
   - Dark mode support (toggle để show)

---

### **PHẦN 7: MULTILINGUAL & RESPONSIVE** (1 phút)

#### 7.1 Language Switching
**Demo actions:**
1. Click language toggle (EN/VI)
2. Show content được translate đầy đủ
3. Highlight: "Portfolio hỗ trợ đa ngôn ngữ"

#### 7.2 Responsive Design
**Demo actions:**
1. Resize browser window (hoặc F12 → Device toolbar)
2. Show mobile view
3. Highlight: "Responsive design, mobile-friendly"

---

### **PHẦN 8: BONUS - TẾT THEME** (30 giây) 🎊

**Demo actions:**
1. Click nút Tết (🎊) ở góc phải dưới
2. Show animations: pháo hoa, hoa mai, lì xì, đèn lồng
3. Script: "Bonus feature - Tết theme với animations"
4. Click lại để tắt

**Lưu ý:** Chỉ demo nếu còn thời gian, không bắt buộc

---

## 🎯 CLOSING (1 phút)

### Summary Script:
> "Tóm lại, portfolio này showcase 3 dự án chính:
> 
> 1. **SafeSense-Vi** - NLP research với 85% F1-Macro
> 2. **MindMapNote** - Production RAG system
> 3. **Prepro TOEIC** - Full-stack EdTech platform
> 
> Tất cả đều là production-ready code với proper testing và documentation.
> 
> Cảm ơn mọi người đã lắng nghe. Tôi sẵn sàng trả lời câu hỏi!"

---

## ❓ Q&A PREPARATION

### Câu hỏi thường gặp:

#### **Technical Questions:**

**Q: "Bạn deploy portfolio này như thế nào?"**
A: "Hugo static site generator + GitHub Pages. Free, fast, và easy to maintain."

**Q: "Tại sao chọn Hugo thay vì React/Next.js?"**
A: "Portfolio là static content, không cần dynamic rendering. Hugo build nhanh hơn và SEO tốt hơn."

**Q: "Có CI/CD không?"**
A: "Yes, GitHub Actions auto-deploy khi push to main branch."

---

#### **Project-Specific Questions:**

**SafeSense-Vi:**
- Q: "Dataset quality như thế nào?"
- A: "Manual labeling bởi 3 annotators, inter-annotator agreement 0.82 Cohen's Kappa"

- Q: "Production deployment?"
- A: "Có thể deploy lên Hugging Face Spaces hoặc FastAPI + Docker"

**MindMapNote:**
- Q: "Latency bao nhiêu?"
- A: "Semantic search ~100ms, full response ~2-3s (depends on LLM)"

- Q: "Scale được không?"
- A: "Yes, pgvector support millions of vectors, có thể add caching"

**Prepro TOEIC:**
- Q: "AI generate questions accurate không?"
- A: "Có human review, accuracy ~85%, teacher có thể edit"

- Q: "Monetization strategy?"
- A: "Freemium model - free basic, premium for advanced features"

---

#### **Career Questions:**

**Q: "Bạn muốn làm gì sau khi tốt nghiệp?"**
A: "AI Engineer hoặc ML Engineer, focus on NLP và RAG systems. Muốn làm ở startup hoặc product company."

**Q: "Strengths của bạn?"**
A: "Full-stack AI development - từ research, training model, đến deploy production. Có thể làm end-to-end."

**Q: "Weaknesses?"**
A: "Chưa có nhiều experience với distributed systems và MLOps ở scale lớn. Đang học thêm về Kubernetes và model monitoring."

---

## 📊 KEY METRICS ĐỂ NHỚ

### SafeSense-Vi:
- ✅ **F1-Macro:** 85%
- ✅ **Dataset:** 12,695 samples
- ✅ **Categories:** 6 (clean, offensive, hate, spam, toxic, neutral)
- ✅ **Teencode rules:** 251+

### MindMapNote:
- ✅ **Vector DB:** Supabase pgvector
- ✅ **Embeddings:** Sentence Transformers
- ✅ **LLMs:** Gemini, GPT-4, Ollama
- ✅ **Retrieval:** Hybrid (semantic + keyword)

### Prepro TOEIC:
- ✅ **Test Coverage:** 95%
- ✅ **Architecture:** MVC
- ✅ **AI Model:** Groq Llama 3.1-8B
- ✅ **Algorithm:** Spaced Repetition (SM-2)

---

## 🎨 PRESENTATION TIPS

### ✅ DO:
- Nói chậm, rõ ràng
- Maintain eye contact (không chỉ nhìn màn hình)
- Highlight business value, không chỉ technical details
- Show enthusiasm về projects
- Prepare backup plan nếu internet/localhost fail

### ❌ DON'T:
- Đọc slides/code word-by-word
- Spend quá nhiều thời gian vào 1 project
- Apologize về thiếu sót (confident!)
- Skip Q&A session
- Quên test trước khi demo

---

## 🚀 BACKUP PLAN

### Nếu localhost fail:
1. **Plan A:** Deploy lên GitHub Pages trước, demo từ live site
2. **Plan B:** Record video demo trước, play video
3. **Plan C:** Có screenshots sẵn trong slides

### Nếu bị hỏi về code:
- Có GitHub repos mở sẵn trong tabs
- Có thể show specific files/functions
- Explain architecture diagrams

---

## ⏱️ TIME MANAGEMENT

### 15 phút version (Standard):
- Intro: 2 phút
- Skills: 1 phút
- Projects: 9 phút (3 phút/project)
- Experience/Education: 1 phút
- Closing: 1 phút
- Q&A: 5 phút

### 20 phút version (Extended):
- Intro: 3 phút
- Skills: 2 phút
- Projects: 12 phút (4 phút/project)
- Experience/Education: 2 phút
- Blog/Multilingual: 1 phút
- Closing: 1 phút
- Q&A: 5-10 phút

### 10 phút version (Quick):
- Intro: 1 phút
- Projects: 7 phút (focus 2 main projects)
- Closing: 1 phút
- Q&A: 5 phút

---

## 📝 FINAL CHECKLIST

### Ngày hôm trước:
- [ ] Test toàn bộ portfolio
- [ ] Đọc lại content các dự án
- [ ] Chuẩn bị câu trả lời Q&A
- [ ] Sleep well!

### 1 giờ trước demo:
- [ ] Test internet connection
- [ ] Chạy `hugo server`
- [ ] Clear browser cache
- [ ] Đóng apps không cần thiết
- [ ] Có backup plan

### 5 phút trước demo:
- [ ] Deep breath, relax
- [ ] Review key metrics
- [ ] Mở portfolio ở tab đầu tiên
- [ ] Smile và confident!

---

## 🎯 SUCCESS CRITERIA

### Demo thành công khi:
- ✅ Showcase được technical depth của 3 projects
- ✅ Highlight được business value
- ✅ Answer Q&A confidently
- ✅ Leave good impression
- ✅ Get contact/follow-up

---

## 💡 PRO TIPS

1. **Practice 3-5 lần trước** - timing, flow, transitions
2. **Record yourself** - xem lại để improve
3. **Get feedback** - từ bạn bè/thầy cô
4. **Prepare stories** - về challenges và how you solved them
5. **Show passion** - enthusiasm is contagious!

---

**Good luck với demo! 🚀**

*Remember: Bạn đã build những projects tuyệt vời. Chỉ cần confident showcase chúng!*
