---
title: "Xử lý đa luồng: Để Server phục vụ hàng ngàn khách hàng"
date: 2025-12-19T14:00:00+07:00
draft: false
description: "Tìm hiểu chi tiết về Multi-threading trong Java, cách xây dựng Server có khả năng xử lý đồng thời nhiều Client, và các mô hình concurrency phổ biến."
image: "/images/projects/multithread.png"
tags: ["Java", "Thread", "Socket", "Concurrency", "Performance"]
categories: ["Lập trình mạng"]
---

## Giới thiệu

Một Server chỉ có thể phục vụ một Client tại một thời điểm là hoàn toàn không khả thi trong thực tế. Hãy tưởng tượng Facebook, Zalo hay bất kỳ ứng dụng chat nào chỉ cho phép một người dùng đăng nhập tại một thời điểm - điều đó sẽ là thảm họa! Bài viết này sẽ giải thích chi tiết về **Multi-threading** (Đa luồng) - giải pháp cho phép Server xử lý hàng nghìn kết nối đồng thời.

## 1. Vấn đề của Server đơn luồng

### 1.1. Phân tích kỹ thuật

Khi một Server TCP đơn giản chạy trong một luồng duy nhất (single-threaded), nó gặp phải vấn đề **blocking I/O**:

```java
while (true) {
    Socket client = serverSocket.accept(); // BLOCKING POINT 1
    BufferedReader in = new BufferedReader(
        new InputStreamReader(client.getInputStream())
    );
    String message = in.readLine(); // BLOCKING POINT 2
    // Xử lý message...
}
```

**Vấn đề xảy ra:**

1. **Tại accept()**: Server bị "đóng băng" cho đến khi có Client kết nối
2. **Tại readLine()**: Nếu Client A đã kết nối nhưng chưa gửi dữ liệu, Server sẽ chờ mãi và không thể accept() Client B

Kết quả: Chỉ có thể phục vụ **một Client tại một thời điểm** - hoàn toàn không thực tế!

### 1.2. Minh họa thực tế

Giả sử bạn xây dựng một ứng dụng chat room:
- Client A kết nối và đang gõ tin nhắn (chưa gửi)
- Client B, C, D cố gắng kết nối
- Kết quả: B, C, D phải chờ đến khi A gửi tin nhắn và ngắt kết nối

Điều này rõ ràng là không chấp nhận được!

## 2. Giải pháp: Multi-threading

### 2.1. Ý tưởng cốt lõi

**Mỗi Client một Thread riêng biệt**. Khi có kết nối mới:
1. Main thread tiếp tục lắng nghe (`accept()`) các kết nối mới
2. Mỗi kết nối được xử lý bởi một Worker thread độc lập
3. Các thread chạy song song, không chặn lẫn nhau

### 2.2. Kiến trúc hệ thống

```
Main Thread (Listener)
    │
    ├─> accept() Client 1 ──> Worker Thread 1
    │
    ├─> accept() Client 2 ──> Worker Thread 2
    │
    ├─> accept() Client 3 ──> Worker Thread 3
    │
    └─> accept() Client N ──> Worker Thread N
```

## 3. Triển khai Multi-threaded Server

### 3.1. Cấu trúc tổng quan

Chúng ta cần hai class chính:
1. **MultiThreadedServer**: Main thread lắng nghe kết nối
2. **ClientHandler**: Worker thread xử lý từng Client

### 3.2. Code Server chính

```java
import java.io.*;
import java.net.*;
import java.util.concurrent.*;

public class MultiThreadedServer {
    private static final int PORT = 8888;
    private static final int MAX_THREADS = 100;
    
    // Thread pool để quản lý threads hiệu quả
    private static ExecutorService threadPool = 
        Executors.newFixedThreadPool(MAX_THREADS);
    
    public static void main(String[] args) {
        System.out.println("=== Multi-threaded Server Starting ===");
        
        try (ServerSocket serverSocket = new ServerSocket(PORT)) {
            System.out.println("Server đang lắng nghe tại port: " + PORT);
            System.out.println("Tối đa " + MAX_THREADS + " kết nối đồng thời");
            
            int clientCount = 0;
            
            // Vòng lặp vô hạn để chấp nhận kết nối
            while (true) {
                try {
                    // Chờ kết nối mới (blocking, nhưng không sao vì đây là main thread)
                    Socket clientSocket = serverSocket.accept();
                    clientCount++;
                    
                    System.out.println("\n[" + clientCount + "] Client mới kết nối:");
                    System.out.println("    IP: " + 
                        clientSocket.getInetAddress().getHostAddress());
                    System.out.println("    Port: " + 
                        clientSocket.getPort());
                    
                    // Tạo handler và submit vào thread pool
                    ClientHandler handler = new ClientHandler(clientSocket, clientCount);
                    threadPool.execute(handler);
                    
                    System.out.println("    ✓ Đã giao cho Worker Thread xử lý");
                    
                } catch (IOException e) {
                    System.err.println("Lỗi khi chấp nhận kết nối: " + e.getMessage());
                }
            }
            
        } catch (IOException e) {
            System.err.println("Không thể khởi động Server: " + e.getMessage());
            e.printStackTrace();
        } finally {
            threadPool.shutdown();
        }
    }
}
```

### 3.3. Code ClientHandler

```java
import java.io.*;
import java.net.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ClientHandler implements Runnable {
    private Socket clientSocket;
    private int clientId;
    private BufferedReader in;
    private PrintWriter out;
    
    public ClientHandler(Socket socket, int id) {
        this.clientSocket = socket;
        this.clientId = id;
    }
    
    @Override
    public void run() {
        String threadName = Thread.currentThread().getName();
        System.out.println("[Client " + clientId + "] Handler bắt đầu trên " + threadName);
        
        try {
            // Khởi tạo streams
            in = new BufferedReader(
                new InputStreamReader(clientSocket.getInputStream())
            );
            out = new PrintWriter(
                clientSocket.getOutputStream(), true
            );
            
            // Gửi thông báo chào mừng
            out.println("=== Chào mừng đến Server ===");
            out.println("Bạn là Client #" + clientId);
            out.println("Thread xử lý: " + threadName);
            
            // Vòng lặp xử lý tin nhắn
            String message;
            while ((message = in.readLine()) != null) {
                String timestamp = LocalDateTime.now()
                    .format(DateTimeFormatter.ofPattern("HH:mm:ss"));
                
                System.out.println("[" + timestamp + "][Client " + clientId + "] " + message);
                
                // Kiểm tra lệnh thoát
                if (message.equalsIgnoreCase("bye") || 
                    message.equalsIgnoreCase("exit")) {
                    out.println("Tạm biệt! Ngắt kết nối...");
                    break;
                }
                
                // Echo lại tin nhắn với timestamp
                out.println("[" + timestamp + "] Server nhận: " + message);
            }
            
        } catch (IOException e) {
            System.err.println("[Client " + clientId + "] Lỗi I/O: " + e.getMessage());
        } finally {
            cleanup();
        }
    }
    
    private void cleanup() {
        try {
            if (in != null) in.close();
            if (out != null) out.close();
            if (clientSocket != null && !clientSocket.isClosed()) {
                clientSocket.close();
            }
            System.out.println("[Client " + clientId + "] Đã ngắt kết nối");
        } catch (IOException e) {
            System.err.println("[Client " + clientId + "] Lỗi khi đóng kết nối: " 
                + e.getMessage());
        }
    }
}
```

## 4. Thread Pool vs. Thread mới mỗi lần

### 4.1. Cách tiếp cận cũ (Không khuyến khích)

```java
// Tạo thread mới mỗi khi có kết nối
new Thread(new ClientHandler(socket, clientId)).start();
```

**Vấn đề:**
- Tạo thread rất tốn kém về tài nguyên (memory, CPU)
- Nếu có 10,000 clients → 10,000 threads → Server crash!
- Không kiểm soát được số lượng thread

### 4.2. Cách tiếp cận hiện đại (Khuyến khích)

```java
// Sử dụng Thread Pool
ExecutorService threadPool = Executors.newFixedThreadPool(100);
threadPool.execute(new ClientHandler(socket, clientId));
```

**Ưu điểm:**
- Giới hạn số lượng thread tối đa (ví dụ: 100)
- Tái sử dụng thread (thread reuse) → hiệu quả hơn
- Tự động quản lý vòng đời của thread
- Có hàng đợi (queue) cho các task chờ xử lý

## 5. Các loại Thread Pool

Java cung cấp nhiều loại Thread Pool:

### 5.1. FixedThreadPool

```java
ExecutorService pool = Executors.newFixedThreadPool(10);
```
- Số lượng thread cố định (ví dụ: 10)
- Phù hợp khi biết trước tải (load) của hệ thống

### 5.2. CachedThreadPool

```java
ExecutorService pool = Executors.newCachedThreadPool();
```
- Tạo thread mới khi cần, tái sử dụng thread rảnh
- Phù hợp cho nhiều task ngắn hạn

### 5.3. ScheduledThreadPool

```java
ScheduledExecutorService pool = Executors.newScheduledThreadPool(5);
```
- Cho phép lập lịch task chạy định kỳ
- Phù hợp cho các tác vụ bảo trì, cleanup

## 6. Vấn đề đồng bộ hóa (Synchronization)

### 6.1. Race Condition

Khi nhiều thread cùng truy cập một tài nguyên chung (ví dụ: danh sách clients), có thể xảy ra **race condition**:

```java
// KHÔNG AN TOÀN!
private static List<ClientHandler> clients = new ArrayList<>();

// Thread 1 và Thread 2 cùng thêm vào list
clients.add(newClient); // Có thể gây lỗi!
```

### 6.2. Giải pháp: Synchronized Collections

```java
// AN TOÀN với multi-threading
private static List<ClientHandler> clients = 
    Collections.synchronizedList(new ArrayList<>());
```

Hoặc sử dụng **ConcurrentHashMap**, **CopyOnWriteArrayList** từ package `java.util.concurrent`.

## 7. Ứng dụng thực tế: Chat Server

Dưới đây là ví dụ về Chat Server cho phép broadcast tin nhắn đến tất cả clients:

```java
import java.util.*;
import java.util.concurrent.*;

public class ChatServer {
    private static Set<PrintWriter> clientWriters = 
        ConcurrentHashMap.newKeySet();
    
    public static void broadcast(String message, PrintWriter sender) {
        for (PrintWriter writer : clientWriters) {
            if (writer != sender) { // Không gửi lại cho người gửi
                writer.println(message);
            }
        }
    }
    
    public static void addClient(PrintWriter writer) {
        clientWriters.add(writer);
        System.out.println("Tổng số clients: " + clientWriters.size());
    }
    
    public static void removeClient(PrintWriter writer) {
        clientWriters.remove(writer);
        System.out.println("Tổng số clients: " + clientWriters.size());
    }
}
```

## 8. Best Practices

### 8.1. Xử lý ngoại lệ đúng cách

```java
try {
    // Code xử lý client
} catch (SocketException e) {
    // Client ngắt kết nối đột ngột
    System.out.println("Client disconnected abruptly");
} catch (IOException e) {
    // Lỗi I/O khác
    e.printStackTrace();
} finally {
    // Luôn cleanup resources
    cleanup();
}
```

### 8.2. Timeout để tránh thread bị treo

```java
clientSocket.setSoTimeout(30000); // 30 giây timeout
```

### 8.3. Graceful Shutdown

```java
Runtime.getRuntime().addShutdownHook(new Thread(() -> {
    System.out.println("\nShutting down server...");
    threadPool.shutdown();
    try {
        if (!threadPool.awaitTermination(60, TimeUnit.SECONDS)) {
            threadPool.shutdownNow();
        }
    } catch (InterruptedException e) {
        threadPool.shutdownNow();
    }
}));
```

## 9. Hiệu năng và Scalability

### 9.1. Giới hạn của Thread-per-Client

Mô hình này có giới hạn:
- Mỗi thread tiêu tốn ~1MB memory
- Hệ điều hành giới hạn số lượng thread (thường ~10,000)
- Context switching giữa nhiều thread tốn CPU

### 9.2. Giải pháp nâng cao: NIO (Non-blocking I/O)

Đối với hệ thống cần xử lý hàng chục nghìn kết nối đồng thời, nên sử dụng:
- **Java NIO** (New I/O) với Selector
- **Netty Framework** - framework NIO mạnh mẽ
- **Reactive Programming** với Project Reactor

## 10. So sánh các mô hình

| Mô hình | Số Clients | Độ phức tạp | Hiệu năng |
|---------|-----------|-------------|-----------|
| Single-threaded | 1 | Thấp | Kém |
| Thread-per-Client | ~1,000 | Trung bình | Tốt |
| Thread Pool | ~10,000 | Trung bình | Rất tốt |
| NIO/Netty | 100,000+ | Cao | Xuất sắc |

## Kết luận

Multi-threading là kỹ thuật thiết yếu để xây dựng Server có khả năng mở rộng. Bằng cách sử dụng Thread Pool và các công cụ đồng bộ hóa phù hợp, chúng ta có thể xây dựng các ứng dụng mạng phục vụ hàng nghìn người dùng đồng thời một cách hiệu quả.

Trong bài viết tiếp theo, chúng ta sẽ tìm hiểu về giao thức UDP - một lựa chọn thay thế cho TCP trong các trường hợp cần tốc độ cao hơn độ tin cậy.

## Tài liệu tham khảo

- "Java Concurrency in Practice" - Brian Goetz
- Oracle Java Tutorials: [Concurrency](https://docs.oracle.com/javase/tutorial/essential/concurrency/)
- "Netty in Action" - Norman Maurer
- Doug Lea's Concurrent Programming in Java