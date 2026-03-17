let currentMode = 'signup';
const API_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    // Label focus coloring
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            const label = input.closest('.form-group').querySelector('label');
            if (label) label.style.color = '#a78bfa';
        });

        input.addEventListener('blur', () => {
            const label = input.closest('.form-group').querySelector('label');
            if (label) label.style.color = '#94a3b8';
        });
    });

    // Default mode
    setMode('signup');
});

// Switch between Login and Signup modes
window.setMode = (mode) => {
    currentMode = mode;
    const formTitle = document.getElementById('form-title');
    const formSubtitle = document.getElementById('form-subtitle');
    const nameGroup = document.getElementById('name-group');
    const confirmPasswordGroup = document.getElementById('confirm-password-group');
    const signupToggle = document.getElementById('signup-toggle');
    const loginToggle = document.getElementById('login-toggle');
    const footerText = document.getElementById('footer-text');
    const submitBtn = document.getElementById('submit-btn');

    if (mode === 'login') {
        formTitle.innerText = 'Welcome Back';
        formSubtitle.innerText = 'Please enter your credentials to login';
        nameGroup.classList.add('hidden');
        confirmPasswordGroup.classList.add('hidden');
        signupToggle.classList.remove('active');
        loginToggle.classList.add('active');
        footerText.innerHTML = 'New here? <a href="#" onclick="setMode(\'signup\')">Create an account</a>';
        submitBtn.innerText = 'Login';
    } else {
        formTitle.innerText = 'Create Account';
        formSubtitle.innerText = 'Please enter your details to sign up';
        nameGroup.classList.remove('hidden');
        confirmPasswordGroup.classList.remove('hidden');
        signupToggle.classList.add('active');
        loginToggle.classList.remove('active');
        footerText.innerHTML = 'Already have an account? <a href="#" onclick="setMode(\'login\')">Login</a>';
        submitBtn.innerText = 'Continue';
    }
};

// Form submission handler
window.handleSubmit = async (event) => {
    event.preventDefault();
    const submitBtn = document.getElementById('submit-btn');
    
    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Frontend validations
    if (currentMode === 'signup' && password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Prepare request
    const endpoint = currentMode === 'signup' ? '/register' : '/login';
    const payload = currentMode === 'signup' 
        ? { name, email, password } 
        : { email, password };

    // Set loading state
    submitBtn.disabled = true;
    submitBtn.innerText = currentMode === 'signup' ? 'Creating Account...' : 'Authenticating...';
    submitBtn.style.opacity = '0.7';

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            // SUCCESS
            showAuthStatus(true, currentMode === 'signup' ? 'Account Created!' : 'Authentication Successful');
            const resetTimer = currentMode === 'signup' ? 2500 : 3500;
            setTimeout(() => {
                if (currentMode === 'signup') {
                    setMode('login');
                }
                resetUI();
            }, resetTimer);
        } else {
            // ERROR
            showAuthStatus(false, data.message || 'Authentication Failed');
            shakeCard();
            setTimeout(() => {
                resetUI();
            }, 3000);
        }
    } catch (error) {
        showAuthStatus(false, 'Server Connection Failed');
        shakeCard();
        resetUI();
    }
};

function showAuthStatus(isSuccess, message) {
    const overlay = document.getElementById('success-overlay');
    const successIcon = document.getElementById('success-icon');
    const failureIcon = document.getElementById('failure-icon');
    const statusText = document.getElementById('status-text');

    // Set text
    statusText.innerText = message;

    // Reset icons
    successIcon.classList.add('hidden');
    failureIcon.classList.add('hidden');

    // Show correct icon
    if (isSuccess) {
        successIcon.classList.remove('hidden');
    } else {
        failureIcon.classList.remove('hidden');
    }

    // Show overlay
    overlay.classList.add('show');
    
    // Hide overlay after animation
    setTimeout(() => {
        overlay.classList.remove('show');
    }, 3000);
}

function shakeCard() {
    const card = document.querySelector('.glass-card');
    card.classList.add('shake');
    setTimeout(() => {
        card.classList.remove('shake');
    }, 5000);
}

function resetUI() {
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = false;
    submitBtn.innerText = currentMode === 'signup' ? 'Continue' : 'Login';
    submitBtn.style.opacity = '1';
}
