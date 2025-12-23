---
title: "TCP và UDP: Chọn 'ngựa' nào cho ứng dụng mạng?"
date: 2025-12-19T14:00:00+07:00
draft: false
description: "So sánh chuyên sâu giữa hai giao thức truyền tải phổ biến nhất - TCP và UDP, phân tích ưu nhược điểm, use cases, và hướng dẫn lựa chọn giao thức phù hợp cho từng loại ứng dụng."
image: "/images/projects/tcp-udp.jpg"
tags: ["Java", "Network", "Protocol", "TCP", "UDP"]
categories: ["Lập trình mạng"]
---

## Giới thiệu

Trong lập trình mạng, việc lựa chọn giữa **TCP** và **UDP** là một quyết định kiến trúc quan trọng, ảnh hưởng trực tiếp đến hiệu năng, độ tin cậy và trải nghiệm người dùng của ứng dụng. Giống như việc chọn phương tiện vận chuyển - đôi khi bạn cần dịch vụ chuyển phát nhanh đảm bảo (TCP), đôi khi bạn chỉ cần gửi thư thường nhanh chóng (UDP). Bài viết này sẽ phân tích sâu sắc cả hai giao thức để giúp bạn đưa ra quyết định đúng đắn.

## 1. Tổng quan về Transport Layer

### 1.1. Vị trí trong mô hình OSI/TCP-IP

Cả TCP và UDP đều thuộc **Transport Layer (Tầng Giao vận)** - tầng thứ 4 trong mô hình OSI:

```
┌─────────────────────────────────┐
│   Application Layer (HTTP, FTP) │ Layer 7
├─────────────────────────────────┤
│   Presentation Layer            │ Layer 6
├─────────────────────────────────┤
│   Session Layer                 │ Layer 5
├─────────────────────────────────┤
│ ► Transport Layer (TCP/UDP) ◄   │ Layer 4  ← Chúng ta đang ở đây
├─────────────────────────────────┤
│   Network Layer (IP)            │ Layer 3
├─────────────────────────────────┤
│   Data Link Layer               │ Layer 2
├─────────────────────────────────┤
│   Physical Layer                │ Layer 1
└─────────────────────────────────┘
```

**Nhiệm vụ của Transport Layer:**
- Cung cấp giao tiếp end-to-end giữa các ứng dụng
- Phân đoạn (segmentation) và tái lắp ráp (reassembly) dữ liệu
- Kiểm soát lỗi (error control)
- Kiểm soát luồng (flow control)
- Multiplexing/Demultiplexing qua port numbers

## 2. TCP (Transmission Control Protocol)

### 2.1. Đặc điểm cốt lõi

**TCP** là giao thức **hướng kết nối** (connection-oriented), được định nghĩa trong RFC 793.

**Đặc điểm chính:**

1. **Connection-oriented**: Phải thiết lập kết nối trước khi truyền dữ liệu
2. **Reliable**: Đảm bảo dữ liệu đến đích đầy đủ, không lỗi
3. **Ordered**: Dữ liệu đến đúng thứ tự gửi
4. **Flow Control**: Điều chỉnh tốc độ gửi dựa trên khả năng nhận
5. **Congestion Control**: Tránh làm quá tải mạng
6. **Full-duplex**: Truyền hai chiều đồng thời

### 2.2. Three-Way Handshake

Quá trình thiết lập kết nối TCP:

```
Client                                Server
  │                                      │
  │─────── SYN (seq=100) ──────────────>│  1. Client gửi SYN
  │                                      │
  │<──── SYN-ACK (seq=300, ack=101) ────│  2. Server phản hồi SYN-ACK
  │                                      │
  │─────── ACK (ack=301) ──────────────>│  3. Client gửi ACK
  │                                      │
  │         Kết nối đã được thiết lập    │
  │<═══════ Truyền dữ liệu ═══════════>│
```

**Giải thích:**
- **SYN** (Synchronize): Yêu cầu đồng bộ sequence number
- **ACK** (Acknowledge): Xác nhận đã nhận
- **seq**: Sequence number - số thứ tự gói tin
- **ack**: Acknowledgment number - xác nhận đã nhận đến byte nào

### 2.3. Cấu trúc TCP Header

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|          Source Port          |       Destination Port        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                        Sequence Number                        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Acknowledgment Number                      |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|  Data |       |C|E|U|A|P|R|S|F|                               |
| Offset| Rsrvd |W|C|R|C|S|S|Y|I|            Window             |
|       |       |R|E|G|K|H|T|N|N|                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|           Checksum            |         Urgent Pointer        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Options                    |    Padding    |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

**Kích thước:** 20-60 bytes (20 bytes cơ bản + tối đa 40 bytes options)

### 2.4. Cơ chế đảm bảo tin cậy

#### a) Acknowledgment (ACK)

Mỗi segment được gửi phải nhận được ACK từ bên nhận:

```
Sender                          Receiver
  │─── Segment 1 (seq=1000) ───>│
  │                              │
  │<──── ACK (ack=1500) ─────────│  Xác nhận đã nhận 500 bytes
  │                              │
  │─── Segment 2 (seq=1500) ───>│
```

#### b) Retransmission (Gửi lại)

Nếu không nhận được ACK trong thời gian timeout, TCP sẽ gửi lại:

```
Sender                          Receiver
  │─── Segment 1 ──────────────>│
  │                              │
  │     (Packet bị mất)          │
  │                              │
  │  ⏰ Timeout!                 │
  │                              │
  │─── Segment 1 (Resend) ─────>│  Gửi lại
  │                              │
  │<──── ACK ────────────────────│  OK!
```

#### c) Flow Control - Sliding Window

TCP sử dụng **sliding window** để kiểm soát lượng dữ liệu gửi:

```java
// Receiver thông báo window size trong ACK
// Sender chỉ gửi tối đa window size bytes mà chưa nhận ACK

Window Size = 4000 bytes

Sender có thể gửi:
[Seq 1000-5000] mà không cần chờ ACK
```

### 2.5. Triển khai TCP trong Java

```java
import java.io.*;
import java.net.*;

public class TCPExample {
    
    // TCP Server
    public static class Server {
        public static void main(String[] args) throws IOException {
            ServerSocket serverSocket = new ServerSocket(8080);
            System.out.println("TCP Server lắng nghe tại port 8080");
            
            while (true) {
                Socket clientSocket = serverSocket.accept();
                System.out.println("Client kết nối: " + 
                    clientSocket.getInetAddress());
                
                // Xử lý trong thread riêng
                new Thread(() -> handleClient(clientSocket)).start();
            }
        }
        
        private static void handleClient(Socket socket) {
            try (
                BufferedReader in = new BufferedReader(
                    new InputStreamReader(socket.getInputStream())
                );
                PrintWriter out = new PrintWriter(
                    socket.getOutputStream(), true
                )
            ) {
                String message;
                while ((message = in.readLine()) != null) {
                    System.out.println("Nhận: " + message);
                    out.println("Echo: " + message);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    
    // TCP Client
    public static class Client {
        public static void main(String[] args) throws IOException {
            Socket socket = new Socket("localhost", 8080);
            
            PrintWriter out = new PrintWriter(
                socket.getOutputStream(), true
            );
            BufferedReader in = new BufferedReader(
                new InputStreamReader(socket.getInputStream())
            );
            
            // Gửi tin nhắn
            out.println("Hello TCP Server!");
            
            // Nhận phản hồi
            String response = in.readLine();
            System.out.println("Server: " + response);
            
            socket.close();
        }
    }
}
```

## 3. UDP (User Datagram Protocol)

### 3.1. Đặc điểm cốt lõi

**UDP** là giao thức **không kết nối** (connectionless), được định nghĩa trong RFC 768.

**Đặc điểm chính:**

1. **Connectionless**: Không cần thiết lập kết nối
2. **Unreliable**: Không đảm bảo dữ liệu đến đích
3. **Unordered**: Không đảm bảo thứ tự
4. **No Flow Control**: Không điều chỉnh tốc độ gửi
5. **No Congestion Control**: Không quan tâm tình trạng mạng
6. **Lightweight**: Header nhỏ gọn (8 bytes)
7. **Fast**: Tốc độ cao, độ trễ thấp

### 3.2. Cấu trúc UDP Header

```
 0      7 8     15 16    23 24    31
+--------+--------+--------+--------+
|   Source Port   | Destination Port|
+--------+--------+--------+--------+
|     Length      |    Checksum     |
+--------+--------+--------+--------+
|                                   |
|          Data (Payload)           |
|                                   |
+-----------------------------------+
```

**Kích thước:** Chỉ 8 bytes (so với TCP 20-60 bytes)

### 3.3. Triển khai UDP trong Java

```java
import java.net.*;
import java.io.*;

public class UDPExample {
    
    // UDP Server
    public static class Server {
        public static void main(String[] args) throws IOException {
            DatagramSocket socket = new DatagramSocket(9999);
            System.out.println("UDP Server lắng nghe tại port 9999");
            
            byte[] buffer = new byte[1024];
            
            while (true) {
                DatagramPacket packet = new DatagramPacket(
                    buffer, buffer.length
                );
                
                // Nhận packet
                socket.receive(packet);
                
                String message = new String(
                    packet.getData(), 0, packet.getLength()
                );
                System.out.println("Nhận: " + message);
                
                // Gửi phản hồi
                String response = "Echo: " + message;
                byte[] sendData = response.getBytes();
                
                DatagramPacket sendPacket = new DatagramPacket(
                    sendData, sendData.length,
                    packet.getAddress(), packet.getPort()
                );
                
                socket.send(sendPacket);
            }
        }
    }
    
    // UDP Client
    public static class Client {
        public static void main(String[] args) throws IOException {
            DatagramSocket socket = new DatagramSocket();
            
            String message = "Hello UDP Server!";
            byte[] sendData = message.getBytes();
            
            InetAddress serverAddress = InetAddress.getByName("localhost");
            DatagramPacket sendPacket = new DatagramPacket(
                sendData, sendData.length, serverAddress, 9999
            );
            
            // Gửi packet
            socket.send(sendPacket);
            
            // Nhận phản hồi
            byte[] receiveData = new byte[1024];
            DatagramPacket receivePacket = new DatagramPacket(
                receiveData, receiveData.length
            );
            
            socket.setSoTimeout(5000); // Timeout 5s
            socket.receive(receivePacket);
            
            String response = new String(
                receivePacket.getData(), 0, receivePacket.getLength()
            );
            System.out.println("Server: " + response);
            
            socket.close();
        }
    }
}
```

## 4. So sánh chi tiết TCP vs UDP

### 4.1. Bảng so sánh toàn diện

| Tiêu chí | TCP | UDP |
|----------|-----|-----|
| **Loại kết nối** | Connection-oriented | Connectionless |
| **Độ tin cậy** | Đảm bảo 100% | Không đảm bảo |
| **Thứ tự dữ liệu** | Đảm bảo đúng thứ tự | Có thể không đúng thứ tự |
| **Tốc độ** | Chậm hơn (do overhead) | Nhanh hơn |
| **Header size** | 20-60 bytes | 8 bytes |
| **Overhead** | Cao | Thấp |
| **Retransmission** | Có (tự động gửi lại) | Không |
| **Flow control** | Có (sliding window) | Không |
| **Congestion control** | Có (slow start, congestion avoidance) | Không |
| **Error checking** | Có (checksum + ACK) | Có (chỉ checksum) |
| **Broadcasting** | Không hỗ trợ | Hỗ trợ |
| **Multicasting** | Không hỗ trợ | Hỗ trợ |
| **Bandwidth** | Sử dụng nhiều hơn | Sử dụng ít hơn |
| **Latency** | Cao hơn | Thấp hơn |
| **Use case** | Web, Email, File transfer | Streaming, Gaming, VoIP |

### 4.2. So sánh hiệu năng

```
Scenario: Gửi 1MB dữ liệu

TCP:
├─ Thiết lập kết nối: 1.5 RTT (Round Trip Time)
├─ Truyền dữ liệu: ~1000 packets
├─ ACK cho mỗi packet/window
├─ Retransmission nếu mất packet
└─ Tổng thời gian: ~500ms (mạng tốt)

UDP:
├─ Không cần thiết lập kết nối: 0 RTT
├─ Truyền dữ liệu: ~700 packets (ít overhead hơn)
├─ Không ACK
├─ Không retransmission
└─ Tổng thời gian: ~200ms (nhưng có thể mất dữ liệu)
```

### 4.3. Packet Loss Impact

```
TCP với 1% packet loss:
- Throughput giảm ~50% (do retransmission)
- Latency tăng đáng kể
- Vẫn đảm bảo dữ liệu đầy đủ

UDP với 1% packet loss:
- Throughput không đổi
- Latency không đổi
- Mất 1% dữ liệu (có thể chấp nhận được cho video/audio)
```

## 5. Use Cases - Khi nào dùng gì?

### 5.1. Dùng TCP khi:

✅ **Cần độ tin cậy tuyệt đối:**
- **Web browsing** (HTTP/HTTPS): Trang web phải load đầy đủ
- **Email** (SMTP, IMAP, POP3): Không thể mất email
- **File transfer** (FTP, SFTP): File phải nguyên vẹn
- **Database connections**: Dữ liệu phải chính xác

✅ **Cần đảm bảo thứ tự:**
- **Chat applications**: Tin nhắn phải đúng thứ tự
- **Remote shell** (SSH): Lệnh phải thực thi đúng thứ tự

✅ **Ứng dụng enterprise:**
- Banking, financial systems
- E-commerce transactions
- Healthcare systems

**Ví dụ code: HTTP Request qua TCP**

```java
Socket socket = new Socket("www.google.com", 80);
PrintWriter out = new PrintWriter(socket.getOutputStream(), true);

out.println("GET / HTTP/1.1");
out.println("Host: www.google.com");
out.println("Connection: close");
out.println();

BufferedReader in = new BufferedReader(
    new InputStreamReader(socket.getInputStream())
);

String line;
while ((line = in.readLine()) != null) {
    System.out.println(line);
}
```

### 5.2. Dùng UDP khi:

✅ **Cần tốc độ và độ trễ thấp:**
- **Online gaming**: Vị trí nhân vật cần cập nhật real-time
- **Live streaming**: Video/audio streaming (YouTube Live, Twitch)
- **VoIP**: Gọi thoại/video (Skype, Zoom, Discord)

✅ **Có thể chấp nhận mất dữ liệu:**
- **IoT sensors**: Mất vài điểm dữ liệu nhiệt độ không quan trọng
- **Multiplayer games**: Mất vài frame không ảnh hưởng nhiều

✅ **Cần broadcasting/multicasting:**
- **Network discovery**: Tìm kiếm thiết bị trong mạng
- **IPTV**: Phát sóng TV qua IP
- **Stock market tickers**: Cập nhật giá chứng khoán

✅ **Ứng dụng đơn giản, request-response ngắn:**
- **DNS queries**: Tra cứu tên miền
- **DHCP**: Cấp phát IP
- **NTP**: Đồng bộ thời gian

**Ví dụ code: DNS Query qua UDP**

```java
DatagramSocket socket = new DatagramSocket();
byte[] query = buildDNSQuery("google.com"); // Simplified

InetAddress dnsServer = InetAddress.getByName("8.8.8.8");
DatagramPacket packet = new DatagramPacket(
    query, query.length, dnsServer, 53
);

socket.send(packet);

byte[] response = new byte[512];
DatagramPacket responsePacket = new DatagramPacket(response, response.length);
socket.receive(responsePacket);

// Parse DNS response...
```

## 6. Hybrid Approaches - Kết hợp cả hai

### 6.1. QUIC Protocol

**QUIC** (Quick UDP Internet Connections) do Google phát triển:
- Sử dụng UDP làm nền tảng
- Thêm reliability, flow control, congestion control
- Nhanh hơn TCP (giảm latency)
- HTTP/3 sử dụng QUIC

```
Traditional HTTP/2 (TCP):
TCP Handshake (1.5 RTT) + TLS Handshake (1-2 RTT) = 2.5-3.5 RTT

HTTP/3 (QUIC over UDP):
Combined Handshake = 0-1 RTT (nhanh hơn 2-3 lần!)
```

### 6.2. WebRTC

**WebRTC** sử dụng cả TCP và UDP:
- **UDP** cho media streams (audio/video)
- **TCP** cho data channels (chat, file transfer)
- Tự động chọn protocol phù hợp

### 6.3. Custom Reliability over UDP

Nhiều game engines tự xây dựng reliability layer trên UDP:

```java
public class ReliableUDP {
    private Map<Integer, Packet> unackedPackets = new HashMap<>();
    private int sequenceNumber = 0;
    
    public void sendReliable(byte[] data) {
        Packet packet = new Packet(sequenceNumber++, data);
        unackedPackets.put(packet.seq, packet);
        
        sendUDP(packet);
        
        // Schedule retransmission if no ACK
        scheduleRetry(packet, 100); // 100ms timeout
    }
    
    public void onReceiveAck(int seq) {
        unackedPackets.remove(seq); // ACK received, no need to retry
    }
}
```

## 7. Decision Tree - Chọn Protocol

```
Bắt đầu
   │
   ├─ Cần đảm bảo 100% dữ liệu đến đích?
   │   ├─ Có → TCP
   │   └─ Không
   │       │
   │       ├─ Cần real-time, low latency?
   │       │   ├─ Có → UDP
   │       │   └─ Không → TCP (an toàn hơn)
   │       │
   │       ├─ Cần broadcasting/multicasting?
   │       │   └─ Có → UDP
   │       │
   │       └─ Bandwidth bị giới hạn?
   │           └─ Có → UDP (ít overhead hơn)
```

## 8. Performance Tuning

### 8.1. TCP Optimization

```java
Socket socket = new Socket();

// Tăng buffer size
socket.setReceiveBufferSize(65536); // 64KB
socket.setSendBufferSize(65536);

// Disable Nagle's algorithm cho low-latency
socket.setTcpNoDelay(true);

// Keep-alive để phát hiện connection chết
socket.setKeepAlive(true);

// Timeout
socket.setSoTimeout(30000); // 30s
```

### 8.2. UDP Optimization

```java
DatagramSocket socket = new DatagramSocket();

// Tăng buffer size
socket.setReceiveBufferSize(65536);
socket.setSendBufferSize(65536);

// Timeout cho receive
socket.setSoTimeout(5000);

// Reuse address (cho multicasting)
socket.setReuseAddress(true);
```

## 9. Common Pitfalls (Lỗi thường gặp)

### 9.1. TCP

❌ **Blocking I/O không xử lý timeout:**
```java
// BAD: Có thể bị treo mãi mãi
socket.getInputStream().read(); 

// GOOD: Set timeout
socket.setSoTimeout(5000);
```

❌ **Không đóng socket đúng cách:**
```java
// BAD
Socket socket = new Socket(...);
// ... use socket ...
// Quên close() → memory leak

// GOOD
try (Socket socket = new Socket(...)) {
    // ... use socket ...
} // Tự động close
```

### 9.2. UDP

❌ **Giả định packet luôn đến:**
```java
// BAD: Không xử lý timeout
socket.receive(packet); // Có thể chờ mãi

// GOOD: Set timeout
socket.setSoTimeout(5000);
try {
    socket.receive(packet);
} catch (SocketTimeoutException e) {
    // Handle timeout
}
```

❌ **Gửi packet quá lớn:**
```java
// BAD: Packet 10KB → fragmentation → mất dữ liệu
byte[] data = new byte[10000];

// GOOD: Giữ dưới MTU (1472 bytes)
byte[] data = new byte[1400];
```

## 10. Real-World Examples

### 10.1. Netflix Streaming

- **TCP** cho: Control messages, metadata, DRM
- **UDP** (QUIC) cho: Video streaming (adaptive bitrate)

### 10.2. Online Gaming (PUBG, Fortnite)

- **UDP** cho: Player positions, movements (60+ updates/second)
- **TCP** cho: Chat messages, inventory updates

### 10.3. Zoom Video Call

- **UDP** cho: Audio/video streams
- **TCP** fallback khi UDP bị firewall chặn

## Kết luận

Lựa chọn giữa TCP và UDP không phải là câu hỏi "cái nào tốt hơn" mà là "cái nào phù hợp hơn". TCP mang lại độ tin cậy và đơn giản trong lập trình, trong khi UDP cung cấp tốc độ và hiệu quả. Hiểu rõ đặc điểm của từng giao thức và yêu cầu của ứng dụng sẽ giúp bạn đưa ra quyết định kiến trúc đúng đắn.

Trong thực tế, nhiều hệ thống hiện đại sử dụng **hybrid approach** - kết hợp cả hai giao thức để tận dụng ưu điểm của từng loại. Xu hướng tương lai là các giao thức như QUIC - xây dựng reliability trên nền tảng UDP để có được cả tốc độ lẫn độ tin cậy.

## Tài liệu tham khảo

- RFC 793: Transmission Control Protocol (TCP)
- RFC 768: User Datagram Protocol (UDP)
- RFC 9000: QUIC - A UDP-Based Multiplayer and Secure Transport
- "Computer Networking: A Top-Down Approach" - Kurose & Ross
- "TCP/IP Illustrated, Volume 1" - W. Richard Stevens
- "High Performance Browser Networking" - Ilya Grigorik
- Google QUIC Documentation