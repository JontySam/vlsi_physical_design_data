document.addEventListener("DOMContentLoaded", () => {
    // Sticky header logic
    const header = document.getElementById('main-header');
    const mainContainer = document.querySelector('main.container');

    if (header && mainContainer) {
        mainContainer.addEventListener('scroll', () => {
            if (mainContainer.scrollTop > 50) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        });
    }
    // Scroll-reveal animation logic
    const scrollElements = document.querySelectorAll(".scroll-reveal");
    if (scrollElements.length > 0) {
        const observerOptions = {
            threshold: 0.1
        };
        // Use the main container as the scroll root for intersection observer
        if (mainContainer) {
            observerOptions.root = mainContainer;
        }

        const elementObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        scrollElements.forEach(el => elementObserver.observe(el));
    }

    // Helper function for copy button state
    function setCopyButtonState(button, message, success) {
        const originalText = 'Copy';
        button.innerText = message;
        if (success) button.classList.add('copy-btn-success');

        setTimeout(() => {
            button.innerText = originalText;
            if (success) button.classList.remove('copy-btn-success');
        }, 2000);
    }

    // Copy to clipboard function
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const preElement = button.parentElement;
            const codeElement = preElement.querySelector('code');
            navigator.clipboard.writeText(codeElement.innerText).then(() => {
                setCopyButtonState(button, 'Copied!', true);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                setCopyButtonState(button, 'Failed!', false);
            });
        });
    });

    // Mobile navigation toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const pageNav = document.querySelector('.page-nav');

    if (mobileNavToggle && pageNav) {
        mobileNavToggle.addEventListener('click', () => {
            const isVisible = pageNav.getAttribute('data-visible') === 'true';
            if (isVisible) {
                pageNav.setAttribute('data-visible', 'false');
                mobileNavToggle.setAttribute('aria-expanded', 'false');
            } else {
                pageNav.setAttribute('data-visible', 'true');
                mobileNavToggle.setAttribute('aria-expanded', 'true');
            }
        });
    }
});
