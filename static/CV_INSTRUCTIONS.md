# Hướng dẫn thêm CV

## Bước 1: Tạo file CV của bạn

Bạn cần tạo file CV dạng PDF với tên `cv.pdf` và đặt vào thư mục này (`static/`).

## Bước 2: Đặt file vào đúng vị trí

```
NetworkingPrograming/
└── static/
    └── cv.pdf  ← Đặt file CV của bạn ở đây
```

## Bước 3: Kiểm tra

Sau khi đặt file `cv.pdf` vào thư mục `static/`, nút "📄 Tải xuống CV (PDF)" trên trang chủ sẽ hoạt động.

URL của CV sẽ là: `/NetworkingPrograming/cv.pdf`

## Lưu ý

- File phải có tên chính xác là `cv.pdf` (chữ thường)
- Định dạng phải là PDF
- Nếu bạn muốn đổi tên file, hãy cập nhật trong `hugo.yaml` tại dòng:
  ```yaml
  url: "/NetworkingPrograming/cv.pdf"
  ```

## Gợi ý tạo CV

Bạn có thể tạo CV bằng:
- Microsoft Word → Export to PDF
- Google Docs → Download as PDF
- LaTeX (Overleaf)
- Canva
- Online CV builders (cvmkr.com, resume.io, etc.)

## Template CV gợi ý

Nội dung CV nên bao gồm:
1. **Thông tin cá nhân**: Họ tên, email, phone, GitHub
2. **Học vấn**: Trường, ngành, GPA, thời gian
3. **Kỹ năng**: Python, Java, ML/AI, Network Programming
4. **Dự án**: Chat App, Blog, ML projects
5. **Chứng chỉ** (nếu có): Coursera, Kaggle, etc.
6. **Ngôn ngữ**: Tiếng Việt, Tiếng Anh

---

**Sau khi thêm file cv.pdf, bạn có thể xóa file hướng dẫn này.**
