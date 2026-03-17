document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signin-form');
    const submitBtn = document.getElementById('submit-btn');

    // Add subtle hover effect for inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            const label = input.closest('.form-group').querySelector('label');
            label.style.color = '#a78bfa'; // primary-vibrant
        });

        input.addEventListener('blur', () => {
            const label = input.closest('.form-group').querySelector('label');
            label.style.color = '#94a3b8'; // text-muted
        });
    });

    // Form submission
    window.handleSubmit = async (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Simple validation
        if (password !== confirmPassword) {
            alert('Passwords do not match. Please check and try again.');
            return;
        }

        // Simulating a loading state for premium feel
        submitBtn.disabled = true;
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Creating session...';
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'wait';

        // Simulate network delay
        setTimeout(() => {
            console.log('User signed in:', { name, email });
            
            // Success animation
            submitBtn.innerText = 'Redirecting...';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)'; // Success green
            submitBtn.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.4)';
            
            setTimeout(() => {
                alert(`Welcome back, ${name}!`);
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
                submitBtn.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)';
                form.reset();
            }, 1000);
        }, 1500);
    };
});
