class AliciaAI {
    constructor() {
        this.elements = {
            chatForm: document.getElementById('chat-form'),
            userInput: document.getElementById('user-input'),
            messagesWrapper: document.getElementById('messages'),
            voiceToggle: document.getElementById('voice-toggle'),
            themeToggle: document.getElementById('theme-toggle'),
            clearChat: document.getElementById('clear-chat'),
            sendBtn: document.getElementById('send-btn'),
            imageGenBtn: document.getElementById('image-gen-btn'),
            charCounter: document.querySelector('.char-counter'),
            welcomeMessage: document.getElementById('welcome-message'),
            modelSelect: document.getElementById('model-select'),
            modelOptions: Array.from(document.querySelectorAll('.model-option')),
        };

        this.state = {
            voiceEnabled: false,
            isLoading: false,
            messageCount: 0,
            selectedModel: 'chatgpt'
        };

        this.config = {
            maxMessageLength: 2000,
            autoResizeMaxHeight: 220
        };

        this.setup();
    }

    setup() {
        this.setupEventListeners();
        this.setupTheme();
        this.setupAutoResize();
        this.loadChatHistory();
        this.ensureModelSelection();
    }

    setupEventListeners() {
        this.elements.chatForm.addEventListener('submit', (e) => this.handleSubmit(e));
        this.elements.userInput.addEventListener('input', () => {
            this.autoResizeTextarea();
            this.updateCharCounter();
            this.updateSendButton();
        });
        this.elements.voiceToggle.addEventListener('click', () => this.toggleVoice());
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.elements.clearChat.addEventListener('click', () => this.clearChat());
        this.elements.imageGenBtn.addEventListener('click', () => this.generateImage());
        this.elements.sendBtn.addEventListener('click', (e) => {
        });

        this.elements.modelOptions.forEach(opt => {
            opt.addEventListener('click', (e) => {
                this.elements.modelOptions.forEach(o => {
                    o.setAttribute('aria-checked', 'false');
                });
                opt.setAttribute('aria-checked', 'true');
                this.state.selectedModel = opt.dataset.model;
            });
        });

        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                if (!this.state.isLoading) {
                    this.handleSubmit(new Event('submit'));
                }
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.clearChat();
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('copy-btn')) {
                const pre = e.target.closest('.code-block').querySelector('pre');
                if (pre) {
                    this.copyToClipboard(pre.textContent || '');
                    e.target.textContent = 'Copied';
                    setTimeout(() => e.target.textContent = 'Copy', 1400);
                }
            }

            if (e.target && e.target.classList.contains('collapse-toggle')) {
                const wrapper = e.target.closest('.message');
                if (!wrapper) return;
                const content = wrapper.querySelector('.collapsible-content');
                if (!content) return;
                const isCollapsed = content.getAttribute('data-collapsed') === 'true';
                content.setAttribute('data-collapsed', String(!isCollapsed));
                e.target.textContent = isCollapsed ? 'Show less' : 'Show more';
            }
        });
    }

    ensureModelSelection() {
        const selected = this.elements.modelOptions.find(o => o.getAttribute('aria-checked') === 'true');
        if (selected) this.state.selectedModel = selected.dataset.model;
    }

    setupTheme() {
        const savedTheme = localStorage.getItem('alicia-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    setupAutoResize() {
        this.autoResizeTextarea();
    }

    autoResizeTextarea() {
        const textarea = this.elements.userInput;
        textarea.style.height = 'auto';
        const newHeight = Math.min(textarea.scrollHeight, this.config.autoResizeMaxHeight);
        textarea.style.height = newHeight + 'px';
    }

    updateSendButton() {
        const hasText = this.elements.userInput.value.trim().length > 0;
        this.elements.sendBtn.disabled = !hasText || this.state.isLoading;
    }

    updateCharCounter() {
        const currentLength = this.elements.userInput.value.length;
        this.elements.charCounter.textContent = `${currentLength}/${this.config.maxMessageLength}`;
        if (currentLength > this.config.maxMessageLength * 0.9) {
            this.elements.charCounter.style.color = 'var(--text-secondary)';
        } else {
            this.elements.charCounter.style.color = 'var(--text-tertiary)';
        }
    }

    async handleSubmit(e) {
        if (e && e.preventDefault) e.preventDefault();
        const text = this.elements.userInput.value.trim();
        if (!text || this.state.isLoading) return;
        if (text.length > this.config.maxMessageLength) {
            this.showToast('Message too long. Please keep it under 2000 characters.', 'error');
            return;
        }

        this.hideWelcomeMessage();
        this.appendUserMessage(text);
        this.elements.userInput.value = '';
        this.updateCharCounter();
        this.autoResizeTextarea();

        await this.sendMessage(text);
    }

    appendUserMessage(text) {
        const el = document.createElement('div');
        el.className = 'message user-message';
        const content = document.createElement('div');
        content.className = 'message-content';
        content.textContent = text;
        el.appendChild(content);
        this.elements.messagesWrapper.appendChild(el);
        this.scrollToBottom();
        this.state.messageCount++;
        this.saveChatHistory();
    }

    appendLoadingMessage() {
        const el = document.createElement('div');
        el.className = 'message ai-message';
        const bubble = document.createElement('div');
        bubble.className = 'loading-bubble';
        bubble.setAttribute('aria-hidden', 'true');
        for (let i = 0; i < 3; i++) {
            const d = document.createElement('div');
            d.className = 'dot';
            bubble.appendChild(d);
        }
        el.appendChild(bubble);
        this.elements.messagesWrapper.appendChild(el);
        this.scrollToBottom();
        return el;
    }

    removeElement(el) {
        if (el && el.parentNode) el.parentNode.removeChild(el);
    }

    async sendMessage(text) {
        this.state.isLoading = true;
        this.elements.sendBtn.classList.add('loading');
        const loadingEl = this.appendLoadingMessage();

        const model = this.state.selectedModel || 'chatgpt';

        try {
            if (model === 'chatgpt') {
                const question = text;
                const { data } = await axios.post(
                    'https://aliicia.my.id/api/chatgpt',
                    { message: `${question}` },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                let answer = data?.response || 'Failed to get response.';
                this.displayAIResponse(answer);

            } else if (model === 'wormgpt') {
                const q = text;
                const { data } = await axios.post(
                    'https://aliicia.my.id/api/wormgpt',
                    { message: `${q}` },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                let ans = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Gagal mendapatkan jawaban.';
                this.displayAIResponse(ans);
            } else {
                this.displayAIResponse("Model not supported.");
            }

        } catch (err) {
            console.error('Error fetching AI:', err);
            this.displayAIResponse('Failed to connect to AI. Please try again later.');
        } finally {
            this.state.isLoading = false;
            this.elements.sendBtn.classList.remove('loading');
            this.removeElement(loadingEl);
            this.saveChatHistory();
        }
    }
     
    displayAIResponse(markdownText) {
        const el = document.createElement('div');
        el.className = 'message ai-message';

        const html = this.renderMarkdown(markdownText || '');
        const container = document.createElement('div');
        container.className = 'message-content';
 
        const THRESHOLD = 700; 
        if ((markdownText || '').length > THRESHOLD) {
            const short = html.substring(0, 600);
            const fullWrapper = document.createElement('div');
            fullWrapper.className = 'collapsible-content';
            fullWrapper.setAttribute('data-collapsed', 'true');
            fullWrapper.innerHTML = short + '...';
            container.appendChild(fullWrapper);

            const fullHidden = document.createElement('div');
            fullHidden.className = 'collapsible-content hidden-full';
            fullHidden.style.display = 'none';
            fullHidden.setAttribute('data-collapsed', 'false');
            fullHidden.innerHTML = html;
            container.appendChild(fullHidden);

            const btn = document.createElement('button');
            btn.className = 'collapse-toggle';
            btn.type = 'button';
            btn.textContent = 'Show more';
            btn.addEventListener('click', () => {
                const isShown = fullHidden.style.display === 'block';
                if (isShown) {
                    fullHidden.style.display = 'none';
                    fullWrapper.style.display = 'block';
                    btn.textContent = 'Show more';
                } else {
                    fullHidden.style.display = 'block';
                    fullWrapper.style.display = 'none';
                    btn.textContent = 'Show less';
                }
                this.scrollToBottom();
            });
            container.appendChild(btn);
        } else {
            container.innerHTML = html;
        }

        el.appendChild(container);
        this.elements.messagesWrapper.appendChild(el);
        this.scrollToBottom();
        this.state.messageCount++;

        this.attachCopyButtons(el);
        this.saveChatHistory();
        if (this.state.voiceEnabled) this.speakText(this.stripMarkdown(markdownText || ''));
    }

    renderMarkdown(md) {
        if (!md) return '';

 
        let text = md.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

 
 
 
 
        text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (m, lang, code) => {
            const language = lang || 'text';
            const safeCode = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return `<div class="code-block"><div class="code-bar"><span class="code-lang">${language}</span><button class="copy-btn" type="button">Copy</button></div><pre><code class="language-${language}">${safeCode}</code></pre></div>`;
        });

        text = text.replace(/`([^`]+)`/g, (m, c) => {
            return `<code>${c}</code>`;
        });

        text = text.replace(/\*\*([^*]+)\*\*/g, (m, c) => {
            return `<strong>${c}</strong>`;
        });

        text = text.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        text = text.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        text = text.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        text = text.replace(/^\s*[-*] (.*)/gim, '<li>$1</li>');
        text = text.replace(/(<li>[\s\S]*?<\/li>)/gim, (m) => {
 
            const lis = m.replace(/\n/g, '');
            return `<ul>${lis.replace(/<\/li><ul>/g,'</li>')}</ul>`;
        });
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

 
        const paragraphs = text.split(/\n{2,}/).map(p => {
 
            if (/^<(h1|h2|h3|ul|div|pre|blockquote|p|code|img)/i.test(p.trim())) return p;
            return `<p>${p.trim()}</p>`;
        });

        return paragraphs.join('\n');
    }

    stripMarkdown(md) {
        if (!md) return '';
        return md.replace(/```[\s\S]*?```/g, '') 
                 .replace(/```.*$/g, '')
                 .replace(/[`*_\[\]]/g, '')
                 .replace(/\[(.*?)\]\((.*?)\)/g, '$1');
    }

    attachCopyButtons(container) {
        const blocks = container.querySelectorAll('.code-block');
        blocks.forEach(block => {
            const btn = block.querySelector('.copy-btn');
            if (btn) return;  
            const bar = document.createElement('div');
            bar.className = 'code-bar';
            const lang = block.querySelector('pre code')?.className?.replace('language-','') || 'text';
            const langSpan = document.createElement('span');
            langSpan.className = 'code-lang';
            langSpan.textContent = lang;
            const copyBtn = document.createElement('button');
            copyBtn.type = 'button';
            copyBtn.className = 'copy-btn';
            copyBtn.textContent = 'Copy';
            bar.appendChild(langSpan);
            bar.appendChild(copyBtn);
            block.insertBefore(bar, block.firstChild);
        });
    }

    copyToClipboard(text) {
        if (!navigator.clipboard) {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
            return;
        }
        navigator.clipboard.writeText(text).catch(() => {});
    }

    speakText(text) {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'id-ID';
        utter.rate = 1;
        utter.pitch = 1;
        window.speechSynthesis.speak(utter);
    }

    hideWelcomeMessage() {
        if (this.elements.welcomeMessage && this.state.messageCount === 0) {
            this.elements.welcomeMessage.style.opacity = '0';
            this.elements.welcomeMessage.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (this.elements.welcomeMessage) this.elements.welcomeMessage.style.display = 'none';
            }, 280);
        }
    }

    scrollToBottom() {
        const chatWrapper = document.querySelector('.chat-wrapper');
        if (chatWrapper) chatWrapper.scrollTop = chatWrapper.scrollHeight + 200;
    }

    async generateImage() {
        const prompt = window.prompt('Describe the image you want to generate:');
        if (!prompt) return;
        this.hideWelcomeMessage();
        this.appendUserMessage(`Generate image: ${prompt}`);
        this.state.isLoading = true;
        const loadingEl = this.appendLoadingMessage();
        try {
            const apiKey = 'hg_ErF1719272617189';  
            const resp = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ inputs: prompt })
            });
            if (!resp.ok) throw new Error('Image API error');
            const blob = await resp.blob();
            const imageUrl = URL.createObjectURL(blob);
            this.removeElement(loadingEl);
            this.appendImageMessage(imageUrl, prompt);
        } catch (err) {
            console.error(err);
            this.removeElement(loadingEl);
            this.displayAIResponse('Failed to generate image.');
        } finally {
            this.state.isLoading = false;
            this.saveChatHistory();
        }
    }

    appendImageMessage(url, alt) {
        const el = document.createElement('div');
        el.className = 'message ai-message image-message';
        const img = document.createElement('img');
        img.src = url;
        img.alt = alt;
        img.loading = 'lazy';
        el.appendChild(img);
        this.elements.messagesWrapper.appendChild(el);
        this.scrollToBottom();
        this.state.messageCount++;
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        const msg = document.createElement('div');
        msg.className = 'toast-message';
        msg.textContent = message;
        toast.appendChild(msg);
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 340);
        }, 3200);
    }

    clearChat() {
        this.elements.messagesWrapper.innerHTML = '';
        this.state.messageCount = 0;
        if (this.elements.welcomeMessage) {
            this.elements.welcomeMessage.style.display = '';
            this.elements.welcomeMessage.style.opacity = '1';
            this.elements.welcomeMessage.style.transform = 'translateY(0)';
        }
        localStorage.removeItem('alicia-chat-history');
        this.showToast('Chat cleared', 'info');
    }

    saveChatHistory() {
        const messages = Array.from(this.elements.messagesWrapper.children).map(el => {
            const isUser = el.classList.contains('user-message');
            let content = ''; 
            const mc = el.querySelector('.message-content');
            if (mc) content = mc.textContent || '';
            const isImage = el.querySelector('img') !== null;
            return { role: isUser ? 'user' : 'ai', content, isImage, model: this.state.selectedModel };
        });
        localStorage.setItem('alicia-chat-history', JSON.stringify(messages));
    }

    loadChatHistory() {
        try {
            const hist = JSON.parse(localStorage.getItem('alicia-chat-history') || '[]');
            if (!Array.isArray(hist) || hist.length === 0) return;
            this.hideWelcomeMessage();
            hist.forEach(msg => {
                if (msg.isImage) {
                    const el = document.createElement('div');
                    el.className = 'message ai-message';
                    const content = document.createElement('div');
                    content.className = 'message-content small-muted';
                    content.textContent = '[Previously generated image]';
                    el.appendChild(content);
                    this.elements.messagesWrapper.appendChild(el);
                } else {
                    const el = document.createElement('div');
                    el.className = `message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`;
                    const content = document.createElement('div');
                    content.className = 'message-content';
                    content.innerHTML = this.renderMarkdown(msg.content);
                    el.appendChild(content);
                    this.elements.messagesWrapper.appendChild(el);
                }
                this.state.messageCount++;
            });
            this.scrollToBottom();
        } catch (err) {
            console.error('Failed to load chat history', err);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.Alicia = new AliciaAI();
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('SW registration failed', err);
        });
    });
}