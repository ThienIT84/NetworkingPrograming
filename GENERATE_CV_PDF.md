# 📄 Hướng dẫn tạo CV PDF

## Cách 1: Print to PDF (Đơn giản nhất)

### Bước 1: Mở CV HTML
```
http://localhost:1313/NetworkingPrograming/cv.html
```

### Bước 2: Print
- Windows: `Ctrl + P`
- Mac: `Cmd + P`

### Bước 3: Cấu hình Print
- **Destination**: Save as PDF
- **Layout**: Portrait
- **Paper size**: A4
- **Margins**: None hoặc Minimum
- **Scale**: 100%
- **Background graphics**: ✅ Checked

### Bước 4: Save
- Lưu vào: `static/cv.pdf`
- Tên file: `cv.pdf`

### Bước 5: Update hugo.yaml
File đã được cấu hình sẵn để trỏ đến `/NetworkingPrograming/cv.pdf`

---

## Cách 2: Sử dụng Browser DevTools

### Chrome/Edge:
1. Mở cv.html
2. F12 → Console
3. Chạy lệnh:
```javascript
window.print();
```
4. Save as PDF

---

## Cách 3: Sử dụng wkhtmltopdf (Professional)

### Cài đặt:
```bash
# Windows (Chocolatey)
choco install wkhtmltopdf

# Or download from: https://wkhtmltopdf.org/downloads.html
```

### Generate PDF:
```bash
# Start Hugo server first
hugo server

# In another terminal
wkhtmltopdf http://localhost:1313/NetworkingPrograming/cv.html static/cv.pdf
```

---

## Cách 4: Sử dụng Puppeteer (Automated)

### Tạo file `generate-cv-pdf.js`:
```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:1313/NetworkingPrograming/cv.html', {
    waitUntil: 'networkidle0'
  });
  
  await page.pdf({
    path: 'static/cv.pdf',
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0',
      right: '0',
      bottom: '0',
      left: '0'
    }
  });
  
  await browser.close();
  console.log('✅ CV PDF generated successfully!');
})();
```

### Chạy:
```bash
# Install puppeteer
npm install puppeteer

# Start Hugo server
hugo server

# Generate PDF
node generate-cv-pdf.js
```

---

## Cách 5: Online Tools

### Sử dụng:
1. **HTML to PDF**: https://www.html2pdf.com/
2. **PDF Crowd**: https://pdfcrowd.com/
3. **CloudConvert**: https://cloudconvert.com/html-to-pdf

### Steps:
1. Copy toàn bộ HTML từ cv.html
2. Paste vào tool
3. Convert to PDF
4. Download và lưu vào `static/cv.pdf`

---

## ✅ Sau khi có cv.pdf

### Kiểm tra:
1. File `static/cv.pdf` đã tồn tại
2. Build Hugo: `hugo --cleanDestinationDir`
3. File sẽ được copy vào `public/cv.pdf`
4. Test link: `http://localhost:1313/NetworkingPrograming/cv.pdf`

### Nút "Tải CV" sẽ hoạt động:
- Click nút → Download cv.pdf
- Hoặc mở trong tab mới

---

## 🎯 Khuyến nghị

**Cách tốt nhất**: Cách 1 (Print to PDF)
- ✅ Đơn giản
- ✅ Không cần cài đặt
- ✅ Giữ nguyên styling
- ✅ Nhanh chóng

**Cách chuyên nghiệp**: Cách 4 (Puppeteer)
- ✅ Tự động hóa
- ✅ Có thể script
- ✅ Chất lượng cao
- ✅ Dễ update

---

## 📝 Checklist

- [ ] Mở cv.html trong browser
- [ ] Print to PDF (Ctrl + P)
- [ ] Cấu hình: A4, Portrait, No margins
- [ ] Enable background graphics
- [ ] Save as `static/cv.pdf`
- [ ] Build Hugo
- [ ] Test download button
- [ ] Verify PDF quality

---

**Thời gian**: ~2 phút  
**Độ khó**: ⭐ (Rất dễ)
