// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form validation and submission handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        const course = document.getElementById('course').value;
        
        // Simple validation
        if (name && email && message) {
            // Display success message
            alert(`Thank you, ${name}! Your message has been received.\n\nCourse: ${course || 'Not selected'}\n\nThis is a demo form - no data was actually submitted.`);
            
            // Reset form
            contactForm.reset();
        } else {
            alert('Please fill in all required fields.');
        }
    });
}

// Add interactive highlighting to code elements
document.addEventListener('DOMContentLoaded', function() {
    // Add a welcome message
    console.log('Welcome to HTML Training with GitHub Copilot!');
    console.log('This project demonstrates HTML, CSS, and JavaScript basics.');
    
    // Highlight current section in navigation
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    function highlightNavigation() {
        let scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.style.opacity = '0.7';
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.style.opacity = '1';
                        link.style.fontWeight = 'bold';
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation);
    highlightNavigation(); // Initial call
});

// Add interactive button effects
document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.addEventListener('mouseenter', function() {
            this.textContent = 'Send Message →';
        });
        
        submitButton.addEventListener('mouseleave', function() {
            this.textContent = 'Submit';
        });
    }
});

// Practice exercise: Add a dynamic counter
let visitCount = localStorage.getItem('visitCount') || 0;
visitCount = parseInt(visitCount) + 1;
localStorage.setItem('visitCount', visitCount);

console.log(`You have visited this page ${visitCount} time(s).`);
