let API = "http://localhost:5000/api/products";
let cartCount = 0;
let isLoggedIn = false;

// Authentication Logic
let socialUserName = "";
function updateAuthButton() {
    const authBtn = document.getElementById('auth-btn');
    const userGreeting = document.getElementById('user-greeting');

    if (authBtn) {
        authBtn.innerText = isLoggedIn ? "Logout" : "Login";
    }

    if (userGreeting) {
        if (isLoggedIn) {
            const nameInput = document.getElementById('username');
            const userName = socialUserName ? socialUserName : ((nameInput && nameInput.value) ? nameInput.value : "User");
            userGreeting.innerText = `Welcome back, ${userName}!`;
            setTimeout(() => userGreeting.classList.add('visible'), 10);
        } else {
            userGreeting.classList.remove('visible');
            setTimeout(() => {
                if (!isLoggedIn) userGreeting.innerText = "";
            }, 500);
        }
    }
}

function handleAuth() {
    if (isLoggedIn) {
        isLoggedIn = false;
        socialUserName = "";
        updateAuthButton();
        console.log("User logged out");
    } else {
        openLoginModal();
    }
}

function openLoginModal() {
    document.getElementById('login-modal').classList.add('active');
}

function closeLoginModal() {
    document.getElementById('login-modal').classList.remove('active');
}

function handleLoginSubmit(event) {
    event.preventDefault();
    const submitBtn = event.target.querySelector('.submit-btn');
    
    if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    }

    // Simulate an API call delay
    setTimeout(() => {
        isLoggedIn = true;
        updateAuthButton();
        closeLoginModal();
        
        if (submitBtn) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
        console.log("User logged in");
    }, 1500);
}

function showSocialInputForm(provider) {
    const googleOption = document.getElementById('google-option');
    const gmailOption = document.getElementById('gmail-option');
    const socialDivider = document.querySelector('.social-divider');

    const initialGoogleBtn = googleOption.querySelector('.google-btn-initial');
    const googleInputForm = googleOption.querySelector('.social-input-form');

    const initialGmailBtn = gmailOption.querySelector('.gmail-btn-initial');
    const gmailInputForm = gmailOption.querySelector('.social-input-form');

    if (provider === 'Google') {
        initialGoogleBtn.classList.add('hidden');
        googleInputForm.classList.add('visible');
        gmailOption.classList.add('hidden'); // Hide Gmail option completely
    } else if (provider === 'Gmail') {
        initialGmailBtn.classList.add('hidden');
        gmailInputForm.classList.add('visible');
        googleOption.classList.add('hidden'); // Hide Google option completely
    }
    socialDivider.classList.add('hidden'); // Hide the OR divider
}

function hideSocialInputForm(provider) {
    const googleOption = document.getElementById('google-option');
    const gmailOption = document.getElementById('gmail-option');
    const socialDivider = document.querySelector('.social-divider');

    const initialGoogleBtn = googleOption.querySelector('.google-btn-initial');
    const googleInputForm = googleOption.querySelector('.social-input-form');

    const initialGmailBtn = gmailOption.querySelector('.gmail-btn-initial');
    const gmailInputForm = gmailOption.querySelector('.social-input-form');

    if (provider === 'Google') {
        initialGoogleBtn.classList.remove('hidden');
        googleInputForm.classList.remove('visible');
        googleOption.classList.remove('hidden'); // Show Google option
    } else if (provider === 'Gmail') {
        initialGmailBtn.classList.remove('hidden');
        gmailInputForm.classList.remove('visible');
        gmailOption.classList.remove('hidden'); // Show Gmail option
    }
    socialDivider.classList.remove('hidden'); // Show the OR divider
}

function handleSocialInitialClick(event) {
    const btn = event.currentTarget;
    const provider = btn.classList.contains('google-btn-initial') ? 'Google' : 'Gmail';
    showSocialInputForm(provider);
}

function handleSocialSubmit(event) {
    event.preventDefault();
    const submitBtn = event.currentTarget;
    const provider = submitBtn.classList.contains('google-submit-btn') ? 'Google' : 'Gmail';
    const emailInputId = provider === 'Google' ? 'google-email' : 'gmail-email';
    const emailInput = document.getElementById(emailInputId);
    const userEmail = emailInput ? emailInput.value : '';

    if (!userEmail) {
        alert(`Please enter your ${provider} email.`);
        return;
    }

    if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    }

    // Simulate an API call delay
    setTimeout(() => {
        isLoggedIn = true;
        socialUserName = userEmail.split('@')[0]; // Use part of the email as username
        updateAuthButton();
        closeLoginModal();

        if (submitBtn) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
        console.log(`User logged in via ${provider} with email: ${userEmail}`);
        // Reset form state
        hideSocialInputForm(provider);
        emailInput.value = ''; // Clear input
    }, 1500);
}

function handleForgotPassword(event) {
    event.preventDefault();
    const identifier = prompt("Enter your email or username to reset your password:");
    if (identifier) {
        alert(`A password reset link has been sent to ${identifier}. (Simulation complete)`);
    }
}

// Password Toggle Logic
function setupPasswordToggle() {
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('password-toggle');

    if (passwordInput && passwordToggle) {
        passwordToggle.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            // Change icon based on visibility
            passwordToggle.innerText = type === 'password' ? '👁️' : '🔒';
        });
    }
}

// Scroll Reveal Logic
function handleScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

// Function to update cart display
function updateCartDisplay() {
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
        cartCountElement.innerText = cartCount + " 🛒";
    } else {
        console.warn("Cart count element not found! Make sure an element with id 'cart-count' exists.");
    }
}

// Cart: Function to add item to cart
// It's better to pass product details if you plan to have a more complex cart
function addCart(event, productName = "item") { 
    const button = event.target;
    const cart = document.getElementById('cart-count');
    const productCard = button.closest('.Sub');
    const imgToCopy = productCard ? productCard.querySelector('img') : null;

    if (!imgToCopy || !cart) {
        cartCount++;
        updateCartDisplay();
        console.log(`Added "${productName}" to cart. Total items: ${cartCount}`);
        return;
    }

    // Create a clone of the product image for the "fly" animation
    const flyingImg = imgToCopy.cloneNode();
    const rect = imgToCopy.getBoundingClientRect();
    
    flyingImg.classList.add('flying-image');
    flyingImg.style.left = `${rect.left}px`;
    flyingImg.style.top = `${rect.top}px`;
    flyingImg.style.width = `${rect.width}px`;
    flyingImg.style.height = `${rect.height}px`;

    document.body.appendChild(flyingImg);

    // Target position (cart icon)
    const cartRect = cart.getBoundingClientRect();

    // Trigger animation in next frame
    setTimeout(() => {
        flyingImg.style.left = `${cartRect.left}px`;
        flyingImg.style.top = `${cartRect.top}px`;
        flyingImg.style.width = '20px';
        flyingImg.style.height = '20px';
        flyingImg.style.opacity = '0.4';
    }, 10);

    flyingImg.addEventListener('transitionend', () => {
        flyingImg.remove();
        cartCount++;
        updateCartDisplay();
        console.log(`Added "${productName}" to cart. Total items: ${cartCount}`);
        cart.style.transform = 'scale(1.5)';
        setTimeout(() => cart.style.transform = 'scale(1)', 200);
    }, { once: true });
}

// Function to load products dynamically
async function loadProducts() {
    try {
        const response = await fetch(API);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        
        const container = document.getElementById("products");
        if (!container) {
            console.error("Products container not found! Make sure an element with id 'products' exists.");
            return;
        }

        container.innerHTML = ''; // Clear any existing static content
        products.forEach(p => {
            // Using template literals and proper event listener assignment
            // It's generally better to use addEventListener instead of onclick in HTML
            const productCard = document.createElement('div');
            productCard.classList.add('card', 'Sub', 'reveal'); // Added reveal class
            productCard.innerHTML = `
                <br>
                <img src="${p.image}" alt="${p.name}">
                <h4>${p.name}</h4>
                <p>₹${p.price}</p>
                <button class="add-to-cart-btn" data-product-name="${p.name}">Add to Cart</button>
                <br><br>
            `;
            container.appendChild(productCard);
        });

        // Attach event listeners after all elements are added to the DOM
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (event) => addCart(event, event.target.dataset.productName));
        });

        // Re-run scroll reveal for dynamic elements
        handleScrollReveal();

    } catch (error) {
        console.error("Error loading products:", error);
        // Optionally display an error message to the user
        document.getElementById("products").innerHTML = "<p>Failed to load products. Please try again later.</p>";
    }
}

// Initialize cart display and load products when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay(); // Set initial cart count
    loadProducts(); // Fetch and display products
    handleScrollReveal(); // Initialize animations
    updateAuthButton(); // Set initial state for login button

    const authBtn = document.getElementById('auth-btn');
    if (authBtn) {
        authBtn.addEventListener('click', handleAuth);
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }

    const forgotPw = document.getElementById('forgot-password');
    if (forgotPw) {
        forgotPw.addEventListener('click', handleForgotPassword);
    }

    // Handle Social Login Buttons (initial buttons)
    document.querySelectorAll('.social-btn-initial').forEach(btn => {
        btn.addEventListener('click', handleSocialInitialClick);
    });

    // Handle Social Submit Buttons
    document.querySelectorAll('.social-submit-btn').forEach(btn => {
        btn.addEventListener('click', handleSocialSubmit);
    });

    // Handle Back Buttons
    document.querySelectorAll('.back-btn').forEach(btn => {
        const provider = btn.closest('#google-option') ? 'Google' : 'Gmail';
        btn.addEventListener('click', () => hideSocialInputForm(provider));
    });

    setupPasswordToggle(); // Initialize password toggle

    // Also handle static buttons in the HTML that aren't loaded via API
    document.querySelectorAll('.Sub button').forEach(button => {
        if (!button.classList.contains('add-to-cart-btn')) {
            button.addEventListener('click', (event) => addCart(event));
        }
    });
});