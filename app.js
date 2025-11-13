(function () {
    // Page navigation
    [...document.querySelectorAll(".control")].forEach(button => {
        button.addEventListener("click", function() {
            document.querySelector(".active-btn").classList.remove("active-btn");
            this.classList.add("active-btn");
            document.querySelector(".active").classList.remove("active");
            document.getElementById(button.dataset.id).classList.add("active");
        })
    });
    
    // Theme switcher
    document.querySelector(".theme-btn").addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
    });
    
    // Animate progress bars when About section is active
    const observeProgressBars = () => {
        const progressBars = document.querySelectorAll('.progress span');
        const aboutSection = document.getElementById('about');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    progressBars.forEach(bar => {
                        bar.style.width = '0%';
                        setTimeout(() => {
                            bar.style.width = bar.className === 'python' ? '90%' :
                                             bar.className === 'ml' ? '85%' :
                                             bar.className === 'sql' ? '88%' :
                                             bar.className === 'flask' ? '85%' :
                                             bar.className === 'viz' ? '87%' :
                                             bar.className === 'stats' ? '83%' : '0%';
                        }, 100);
                    });
                }
            });
        }, { threshold: 0.5 });
        
        if (aboutSection) {
            observer.observe(aboutSection);
        }
    };
    
    // Initialize animations
    observeProgressBars();
    
    // Add typing effect to headline (optional enhancement)
    const typeWriter = (element, text, speed = 100) => {
        let i = 0;
        element.innerHTML = '';
        const type = () => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        type();
    };
    
    // Smooth scroll for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
})();
