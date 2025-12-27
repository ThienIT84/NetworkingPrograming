# 📝 CHANGELOG - Multilingual Fixes

## Date: December 27, 2025

---

## 🔧 Issues Fixed

### 1. ❌ Navbar Duplication on English Version
**Problem**: Menu items appeared twice when switching to English
**Root Cause**: `disableAbout: false` in English config → theme rendered both default + custom menus
**Solution**: Set all `disable*` to `true` in English navbar config

### 2. ❌ About Me Content Not Synchronized
**Problem**: 
- Vietnamese: Updated with SafeSense-Vi, MindMapNote, Prepro TOEIC
- English: Old content about Network Programming with Java Socket
**Solution**: Updated English About Me to match Vietnamese version

### 3. ❌ Skills List Inconsistent
**Problem**:
- Vietnamese: TypeScript, Groq API, LangChain, Sentence Transformers
- English: Java, C++, Keras, scikit-learn (outdated)
**Solution**: Synchronized skills list to reflect current tech stack

### 4. ❌ Contact Section Incomplete
**Problem**:
- English version missing email display with icon
- Different email addresses (thientt.dev vs Thientran805954)
- No formatting or emoji
**Solution**: Added email display, unified email, added formatting

### 5. ❌ Anchor Links Not Working on /en/
**Problem**: `#about` doesn't work on `/en/` URL
**Solution**: Changed all anchor links from `#about` to `/#about`

---

## ✅ Changes Made

### File: `hugo.yaml`

#### 1. English Navbar Configuration (Line ~470-480)
```yaml
# BEFORE
navbar:
  menus:
    disableAbout: false
    disableExperience: false
    # ... all false

# AFTER
navbar:
  menus:
    disableAbout: true
    disableExperience: true
    # ... all true
```

#### 2. Menu URLs - Both Languages (Line ~45-55, ~425-435)
```yaml
# BEFORE
menu:
  main:
    - url: "#about"
    - url: "#experience"

# AFTER
menu:
  main:
    - url: "/#about"
    - url: "/#experience"
```

#### 3. English About Me Content (Line ~530-560)
```yaml
# BEFORE
content: |-
  A dedicated 4th-year IT student... passionate about Network Programming, 
  having hands-on experience in building secure, scalable applications 
  using Java Sockets and TCP/UDP protocols.

skills:
  items:
    - "**Programming Languages:** Python, Java, JavaScript, C++"
    - "**AI/ML Frameworks:** PyTorch, TensorFlow, Keras, scikit-learn"

# AFTER
content: |-
  A 4th-year IT student... I have practical experience in building 
  production-ready AI systems:
  
  - **SafeSense-Vi**: Hate Speech Detection with PhoBERT, 85% F1-Macro
  - **MindMapNote**: RAG System with pgvector
  - **Prepro TOEIC**: EdTech platform with AI question generation

skills:
  items:
    - "**Programming Languages:** Python, TypeScript, JavaScript, SQL"
    - "**AI/ML Frameworks:** PyTorch, TensorFlow, Transformers, LangChain"
    - "**AI Tools:** Groq API, Ollama, Apify, Sentence Transformers"
```

#### 4. English Contact Section (Line ~756-775)
```yaml
# BEFORE
contact:
  title: "Get In Touch"
  content: "Feel free to reach out if you'd like to discuss..."
  btnLink: mailto:Thientran805954@gmail.com

# AFTER
contact:
  title: "Get In Touch"
  content: |-
    I'm always open to connecting and discussing:
    
    🤖 **AI/Machine Learning Projects** - RAG, NLP, Computer Vision
    🌐 **Network Programming** - Socket Programming, TCP/UDP
    💼 **Internship/Job Opportunities** - AI Engineer, Backend Developer
    📚 **Knowledge Sharing** - Technical Writing, Open Source
  email:
    title: "📧 Email"
    content: thientt.dev@gmail.com
  btnLink: mailto:thientt.dev@gmail.com
```

---

## 📊 Impact

### Before Fix:
- ❌ Navbar: 14 items on English (duplicated)
- ❌ About: Outdated content on English
- ❌ Skills: Inconsistent between languages
- ❌ Contact: Missing email display on English
- ❌ Anchor links: Not working on /en/

### After Fix:
- ✅ Navbar: 7 items on both languages
- ✅ About: Synchronized content
- ✅ Skills: Consistent tech stack
- ✅ Contact: Full email display
- ✅ Anchor links: Working on all URLs

---

## 🧪 Testing

### Test Results:
```
✅ Navbar display: VI (7 items), EN (7 items)
✅ About Me content: Synchronized
✅ Skills list: Synchronized
✅ Contact section: Synchronized
✅ Anchor links: Working on both /  and /en/
✅ Language switcher: Smooth transition
✅ Build: Successful (3838ms)
```

---

## 📚 Documentation

Created/Updated files:
- ✅ `FIX_NAVBAR_MULTILINGUAL.md` - Detailed technical documentation
- ✅ `CHANGELOG_MULTILINGUAL_FIX.md` - This file (summary)

---

## 🚀 Deployment

```bash
# Build command
hugo --cleanDestinationDir

# Build stats
Pages: VI (169), EN (9)
Total time: 3838ms
Status: ✅ Success
```

---

## 👥 Team Notes

**For future updates:**
1. Always update BOTH languages when changing content
2. Keep skills list synchronized with current tech stack
3. Use `/#anchor` for all anchor links in multilingual sites
4. Test on both languages before committing
5. Disable theme's default menus when using custom menus

---

**Fixed by**: Kiro AI Assistant  
**Reviewed by**: Trần Thanh Thiện  
**Status**: ✅ Completed & Deployed
