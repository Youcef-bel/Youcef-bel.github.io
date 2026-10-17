(function () {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section[id]');

    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.id;
                navLinks.forEach(link => {
                    const isActive = link.getAttribute('href') === `#${activeId}`;
                    link.classList.toggle('active', isActive);
                });
            }
        });
    }, {
        threshold: 0.4,
        rootMargin: '-10% 0px -45% 0px'
    });

    sections.forEach(section => sectionObserver.observe(section));

    const chatForm = document.getElementById('chat-form');
    if (chatForm) {
        const messageInput = document.getElementById('chat-message');
        const submitButton = chatForm.querySelector('button[type="submit"]');
        const status = document.getElementById('chat-status');
        const reply = document.getElementById('chat-reply');

        chatForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const message = messageInput.value.trim();
            if (!message) {
                messageInput.focus();
                return;
            }

            submitButton.disabled = true;
            chatForm.setAttribute('aria-busy', 'true');
            status.textContent = 'Thinking…';
            status.classList.remove('is-error');
            reply.hidden = true;
            reply.textContent = '';

            try {
                let response;
                for (let attempt = 0; attempt < 2; attempt += 1) {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 90000);

                    try {
                        response = await fetch('https://youcef-ai-assistant.onrender.com/api/chat', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ message }),
                            signal: controller.signal
                        });
                        break;
                    } catch (error) {
                        if (error.name === 'AbortError') {
                            throw new Error('The assistant took too long to respond. It may be starting up; please try again.');
                        }
                        if (!(error instanceof TypeError) || attempt === 1) {
                            throw error;
                        }

                        status.textContent = 'Waking up the assistant… retrying shortly.';
                        await new Promise(resolve => setTimeout(resolve, 1200));
                    } finally {
                        clearTimeout(timeoutId);
                    }
                }

                if (!response.ok) {
                    throw new Error(`The assistant returned an error (${response.status}).`);
                }

                const data = await response.json();
                if (typeof data.reply !== 'string' || !data.reply.trim()) {
                    throw new Error('The assistant returned an empty reply. Please try again.');
                }

                reply.textContent = data.reply;
                reply.hidden = false;
                status.textContent = '';
            } catch (error) {
                status.textContent = error instanceof TypeError
                    ? 'The assistant is temporarily unreachable. Please retry shortly; if this continues, its service may be asleep or unavailable.'
                    : error.message || 'Something went wrong. Please try again.';
                status.classList.add('is-error');
            } finally {
                submitButton.disabled = false;
                chatForm.removeAttribute('aria-busy');
            }
        });
    }

    const lazyImages = document.querySelectorAll('img[data-src]');
    const loadLazyImage = (img) => {
        const src = img.dataset.src;
        if (!src) return;
        img.src = src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
    };

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadLazyImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '50px 0px' });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        lazyImages.forEach(loadLazyImage);
    }

})();
