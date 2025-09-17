document.addEventListener("DOMContentLoaded", () => {
    // Sticky header logic
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Scroll-reveal animation logic
    const scrollElements = document.querySelectorAll(".scroll-reveal");
    if (scrollElements.length > 0) {
        const elementObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        scrollElements.forEach(el => elementObserver.observe(el));
    }

    // Copy to clipboard function
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const preElement = button.parentElement;
            const codeElement = preElement.querySelector('code');
            const textToCopy = codeElement.innerText;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                button.innerText = 'Copied!';
                button.classList.add('copy-btn-success');
                setTimeout(() => {
                    button.innerText = 'Copy';
                    button.classList.remove('copy-btn-success');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                button.innerText = 'Failed!';
                setTimeout(() => {
                    button.innerText = 'Copy';
                }, 2000);
            });
        });
    });
});