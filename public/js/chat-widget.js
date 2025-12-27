// =====================================================
// BLOG AI CHAT ASSISTANT - JAVASCRIPT
// =====================================================

(function () {
    'use strict';

    // Configuration
    const CONFIG = {
        // RAG Backend API endpoint
        API_ENDPOINT: 'http://localhost:8000/chat',
        // Set to false to use real backend, true for mock demo
        USE_MOCK: false,
        // Số lượng nguồn tham khảo tối đa
        MAX_SOURCES: 3
    };

    // Current Language
    const currentLang = document.documentElement.lang || 'vi';

    // Initialize chat when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChat);
    } else {
        initChat();
    }

    function initChat() {
        const chatContainer = document.getElementById('blog-chat-assistant');
        if (!chatContainer) return;

        setupEventListeners();
        displayWelcomeMessage();
        setupExampleQuestions();
        loadApiKey(); // Load saved API key from localStorage
    }

    function setupEventListeners() {
        const sendBtn = document.getElementById('blog-chat-send-btn');
        const input = document.getElementById('blog-chat-input');

        if (sendBtn) {
            sendBtn.addEventListener('click', handleSendMessage);
        }

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                }
            });
        }

        // Settings modal event listeners
        setupSettingsModal();
    }

    function setupSettingsModal() {
        const settingsBtn = document.getElementById('chat-settings-btn');
        const modal = document.getElementById('chat-settings-modal');
        const closeBtn = modal?.querySelector('.chat-modal-close');
        const saveBtn = document.getElementById('save-settings-btn');

        if (settingsBtn && modal) {
            settingsBtn.addEventListener('click', () => {
                modal.style.display = 'flex';
            });
        }

        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', saveApiKey);
        }

        // Close modal when clicking outside
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    }

    function loadApiKey() {
        try {
            const savedKey = localStorage.getItem('gemini_api_key');
            const input = document.getElementById('gemini-api-key');
            if (savedKey && input) {
                input.value = savedKey;
            }
        } catch (error) {
            console.error('Error loading API key:', error);
        }
    }

    function saveApiKey() {
        try {
            const input = document.getElementById('gemini-api-key');
            const modal = document.getElementById('chat-settings-modal');

            if (input) {
                const apiKey = input.value.trim();
                if (apiKey) {
                    localStorage.setItem('gemini_api_key', apiKey);

                    // Show success message
                    const saveBtn = document.getElementById('save-settings-btn');
                    const originalText = saveBtn.textContent;
                    saveBtn.textContent = '✅ Saved!';
                    saveBtn.style.background = '#10b981';

                    setTimeout(() => {
                        saveBtn.textContent = originalText;
                        saveBtn.style.background = '';
                        if (modal) {
                            modal.style.display = 'none';
                        }
                    }, 1500);
                } else {
                    // Remove API key if empty
                    localStorage.removeItem('gemini_api_key');
                    if (modal) {
                        modal.style.display = 'none';
                    }
                }
            }
        } catch (error) {
            console.error('Error saving API key:', error);
            alert('Error saving API key. Please try again.');
        }
    }

    function setupExampleQuestions() {
        const chips = document.querySelectorAll('.example-chip');
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                const question = chip.textContent;
                const input = document.getElementById('blog-chat-input');
                if (input) {
                    input.value = question;
                    handleSendMessage();
                }
            });
        });
    }

    function displayWelcomeMessage() {
        // Welcome message is now handled by Hugo i18n in HTML
        // This function might be needed if we reset the chat
    }

    async function handleSendMessage() {
        const input = document.getElementById('blog-chat-input');
        const sendBtn = document.getElementById('blog-chat-send-btn');

        if (!input || !input.value.trim()) return;

        const question = input.value.trim();
        input.value = '';
        sendBtn.disabled = true;

        // Display user message
        addMessage('user', question);

        // Show loading indicator
        const loadingId = addLoadingMessage();

        try {
            // Get response from API
            const response = await getAIResponse(question);

            // Remove loading indicator
            removeMessage(loadingId);

            // Display AI response
            addMessage('assistant', response.answer, response.sources);

        } catch (error) {
            console.error('Error getting AI response:', error);
            removeMessage(loadingId);
            const errorMsg = currentLang === 'vp' ? 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau. 🙏' : 'Sorry, an error occurred. Please try again later. 🙏';
            addMessage('assistant', errorMsg);
        } finally {
            sendBtn.disabled = false;
            input.focus();
        }
    }

    function addMessage(role, content, sources = []) {
        const messagesContainer = document.getElementById('blog-chat-messages');
        if (!messagesContainer) return;

        // Remove welcome message if exists (check for any existing initial content)
        // Note: In new design, the welcome message is part of header, not message area.
        // But if there were any placeholders:
        // const welcomeMsg = messagesContainer.querySelector('.welcome-message');
        // if (welcomeMsg) welcomeMsg.remove();

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message message-${role}`;

        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';

        // Format content (support markdown-like formatting)
        bubbleDiv.innerHTML = formatMessage(content);

        // Add citations if available
        if (sources && sources.length > 0) {
            const citationsDiv = document.createElement('div');
            citationsDiv.className = 'message-citations';
            const sourceLabel = currentLang === 'en' ? 'Sources:' : 'Nguồn:';
            citationsDiv.innerHTML = `<strong>📚 ${sourceLabel}</strong> `;

            sources.forEach(source => {
                const link = document.createElement('a');
                // Get URL from source
                let url = source.url || '';
                
                // Handle different URL formats
                if (url && !url.startsWith('http')) {
                    // If URL starts with /blogs/, use it as-is with base path
                    if (url.startsWith('/blogs/')) {
                        url = `/NetworkingPrograming${url}`;
                    } 
                    // If URL is /cv.html, use it as-is
                    else if (url === '/cv.html') {
                        url = `/NetworkingPrograming${url}`;
                    }
                    // Otherwise, assume it's a blog post slug
                    else {
                        url = `/NetworkingPrograming/blogs/${url}`;
                    }
                }
                
                link.href = url;
                link.className = 'citation-link';
                link.textContent = source.title || 'Blog Post';
                link.target = '_blank';
                citationsDiv.appendChild(link);
            });

            bubbleDiv.appendChild(citationsDiv);
        }


        messageDiv.appendChild(bubbleDiv);
        messagesContainer.appendChild(messageDiv);

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        return messageDiv.id = `msg-${Date.now()}`;
    }

    function addLoadingMessage() {
        const messagesContainer = document.getElementById('blog-chat-messages');
        if (!messagesContainer) return;

        const loadingDiv = document.createElement('div');
        const loadingId = `loading-${Date.now()}`;
        loadingDiv.id = loadingId;
        loadingDiv.className = 'chat-message message-assistant';
        const thinkingText = currentLang === 'en' ? 'Thinking' : 'Đang suy nghĩ';

        loadingDiv.innerHTML = `
            <div class="message-bubble message-loading">
                <span>${thinkingText}</span>
                <div class="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        messagesContainer.appendChild(loadingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        return loadingId;
    }

    function removeMessage(messageId) {
        const message = document.getElementById(messageId);
        if (message) {
            message.remove();
        }
    }

    function formatMessage(text) {
        // Simple markdown-like formatting
        let formatted = text;

        // Code blocks
        formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');

        // Inline code
        formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Bold
        formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

        // Line breaks
        formatted = formatted.replace(/\n/g, '<br>');

        return formatted;
    }

    async function getAIResponse(question) {
        if (CONFIG.USE_MOCK) {
            // Mock response for development/demo
            return getMockResponse(question);
        }

        // Real API call to RAG backend
        const response = await fetch(CONFIG.API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question: question,
                k: CONFIG.MAX_SOURCES
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        
        // Transform API response to expected format
        return {
            answer: data.answer || 'Không tìm thấy câu trả lời phù hợp.',
            sources: data.sources || []
        };
    }

    function getMockResponse(question) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const responses = {
                    vi: {
                        tcp: {
                            answer: `**TCP 3-Way Handshake** là quá trình thiết lập kết nối TCP gồm 3 bước:\n\n1. **SYN**: Client gửi gói tin SYN (Synchronize) đến Server\n2. **SYN-ACK**: Server phản hồi bằng gói tin SYN-ACK (Synchronize-Acknowledge)\n3. **ACK**: Client gửi gói tin ACK (Acknowledge) xác nhận\n\nSau khi hoàn tất 3 bước này, kết nối TCP được thiết lập và dữ liệu có thể truyền đi hai chiều.`,
                            sources: [
                                { title: 'Java Socket: Cơ bản', url: '/blogs/java-socket-co-ban/' },
                                { title: 'TCP vs UDP', url: '/blogs/tcp-vs-udp/' } // URL simplified for bilingual
                            ]
                        },
                        udp: {
                            answer: `**So sánh TCP và UDP:**\n\n**TCP (Transmission Control Protocol):**\n- Hướng kết nối (connection-oriented)\n- Đảm bảo dữ liệu đến đích đầy đủ, đúng thứ tự\n- Chậm hơn nhưng đáng tin cậy\n- Dùng cho: Web, Email, File transfer\n\n**UDP (User Datagram Protocol):**\n- Không kết nối (connectionless)\n- Không đảm bảo dữ liệu đến đích\n- Nhanh hơn nhưng kém tin cậy\n- Dùng cho: Streaming, Gaming, VoIP`,
                            sources: [
                                { title: 'TCP vs UDP: So sánh chi tiết', url: '/blogs/tcp-vs-udp/' },
                                { title: 'Java UDP Protocol', url: '/blogs/java-udp-protocol/' }
                            ]
                        },
                        socket: {
                            answer: `**Code mẫu Java Socket Server:**\n\n\`\`\`java\nimport java.io.*;\nimport java.net.*;\n\npublic class SimpleServer {\n    public static void main(String[] args) {\n        try (ServerSocket serverSocket = new ServerSocket(1234)) {\n            System.out.println("Server đang lắng nghe...");\n            Socket clientSocket = serverSocket.accept();\n            \n            BufferedReader in = new BufferedReader(\n                new InputStreamReader(clientSocket.getInputStream())\n            );\n            PrintWriter out = new PrintWriter(\n                clientSocket.getOutputStream(), true\n            );\n            \n            String message = in.readLine();\n            out.println("Server nhận: " + message);\n        } catch (IOException e) {\n            e.printStackTrace();\n        }\n    }\n}\n\`\`\``,
                            sources: [
                                { title: 'Java Socket: Cơ bản', url: '/blogs/java-socket-co-ban/' },
                                { title: 'Multi-threading Socket', url: '/blogs/java-multi-threading-socket/' }
                            ]
                        },
                        ssl: {
                            answer: `**SSL/TLS** (Secure Sockets Layer / Transport Layer Security) là giao thức mã hóa để bảo mật kết nối mạng.\n\n**Cách hoạt động:**\n1. **Handshake**: Client và Server thỏa thuận thuật toán mã hóa\n2. **Certificate Exchange**: Server gửi certificate để xác thực\n3. **Key Exchange**: Trao đổi khóa mã hóa\n4. **Encrypted Communication**: Dữ liệu được mã hóa truyền đi\n\n**Ưu điểm:**\n- Bảo mật dữ liệu\n- Xác thực server\n- Toàn vẹn dữ liệu`,
                            sources: [
                                { title: 'Java SSL/TLS', url: '/blogs/java-ssl-tls/' }
                            ]
                        },
                        default: {
                            answer: 'Xin lỗi, tôi chưa tìm thấy thông tin phù hợp trong các bài blog. Bạn có thể thử hỏi về TCP, UDP, Java Socket, hoặc SSL/TLS không? 🤔',
                            sources: []
                        }
                    },
                    en: {
                        tcp: {
                            answer: `**TCP 3-Way Handshake** is the process of establishing a TCP connection in 3 steps:\n\n1. **SYN**: Client sends SYN packet to Server\n2. **SYN-ACK**: Server responds with SYN-ACK\n3. **ACK**: Client sends ACK to confirm\n\nAfter these 3 steps, the connection is established and data can flow both ways.`,
                            sources: [
                                { title: 'Java Socket Basics', url: '/blogs/java-socket-co-ban/' },
                                { title: 'TCP vs UDP', url: '/blogs/tcp-vs-udp/' }
                            ]
                        },
                        udp: {
                            answer: `**TCP vs UDP Comparison:**\n\n**TCP:**\n- Connection-oriented\n- Reliable, ordered delivery\n- Slower overhead\n- Uses: Web, Email\n\n**UDP:**\n- Connectionless\n- Unreliable, no ordering\n- Fast, low overhead\n- Uses: Streaming, Gaming`,
                            sources: [
                                { title: 'TCP vs UDP Detailed', url: '/blogs/tcp-vs-udp/' }
                            ]
                        },
                        socket: {
                            answer: `**Java Socket Server Code Sample:**\n\n\`\`\`java\n// (Same code as VN version)\nimport java.io.*;\nimport java.net.*;\n// ... code ...\n\`\`\``,
                            sources: [
                                { title: 'Java Socket Basics', url: '/blogs/java-socket-co-ban/' }
                            ]
                        },
                        ssl: {
                            answer: `**SSL/TLS** is a cryptographic protocol for secure communication.\n\n**How it works:**\n1. **Handshake**\n2. **Certificate Exchange**\n3. **Key Exchange**\n4. **Encrypted Communication**`,
                            sources: [
                                { title: 'Java SSL/TLS', url: '/blogs/java-ssl-tls/' }
                            ]
                        },
                        default: {
                            answer: 'Sorry, I couldn\'t find relevant info. Try asking about TCP, UDP, Java Socket, or SSL/TLS! 🤔',
                            sources: []
                        }
                    }
                };

                const langData = responses[currentLang] || responses['en']; // Fallback to EN if VI not found (though VI is default) or just use logic below

                // Find matching response logic
                const lowerQuestion = question.toLowerCase();
                let response = null;

                // Simple keyword matching
                if (lowerQuestion.includes('tcp') || lowerQuestion.includes('handshake')) {
                    response = (responses[currentLang] || responses.en).tcp;
                } else if (lowerQuestion.includes('udp')) {
                    response = (responses[currentLang] || responses.en).udp;
                } else if (lowerQuestion.includes('socket') || lowerQuestion.includes('code') || lowerQuestion.includes('server')) {
                    response = (responses[currentLang] || responses.en).socket;
                } else if (lowerQuestion.includes('ssl') || lowerQuestion.includes('tls') || lowerQuestion.includes('security') || lowerQuestion.includes('bảo mật')) {
                    response = (responses[currentLang] || responses.en).ssl;
                }

                if (!response) {
                    response = (responses[currentLang] || responses.en).default;
                }

                resolve(response);
            }, 1000);
        });
    }

    // Export for debugging
    window.BlogChat = {
        sendMessage: handleSendMessage,
        addMessage: addMessage
    };

})();
