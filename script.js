let API = "http://localhost:5000/api/products";
let cart = [];
let isLoggedIn = false;
const cartSuccessSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');

// Authentication Logic
let socialUserName = "";
function updateAuthButton() {
    const authBtn = document.getElementById('auth-btn');
    const userGreeting = document.getElementById('user-greeting');

    if (authBtn) {
        authBtn.innerHTML = isLoggedIn ? "🚪 Logout" : "👤 Login";
    }

    if (userGreeting) {
        if (isLoggedIn) {
            const nameInput = document.getElementById('username');
            const userName = socialUserName ? socialUserName : ((nameInput && nameInput.value) ? nameInput.value : "User");
            userGreeting.innerText = `Hello, ${userName}`;
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
    // Reset to login view for the next time it's opened
    showLogin();
}

function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('active');
    });
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

function showSignUp(e) {
    if (e) e.preventDefault();
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('auth-modal-title').innerText = "Create an Account";
}

function showLogin(e) {
    if (e) e.preventDefault();
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('auth-modal-title').innerText = "Login to Sonata";
}

function handleSignUpSubmit(event) {
    event.preventDefault();
    const submitBtn = event.target.querySelector('.submit-btn');
    
    if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    }

    setTimeout(() => {
        alert("Account created successfully! Please login with your credentials.");
        showLogin();
        if (submitBtn) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }, 1500);
}

function handleForgotPassword(event) {
    event.preventDefault();
    closeLoginModal();
    openRecoveryModal();
}

function openRecoveryModal() {
    document.getElementById('recovery-modal').classList.add('active');
}

function closeRecoveryModal() {
    document.getElementById('recovery-modal').classList.remove('active');
}

function handleRecoverySubmit(event) {
    event.preventDefault();
    const submitBtn = event.target.querySelector('.submit-btn');
    const email = document.getElementById('recovery-email').value;

    if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    }

    // Simulate API call to send reset link
    setTimeout(() => {
        alert(`A password reset link has been sent to ${email}.`);
        closeRecoveryModal();
        
        if (submitBtn) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }, 1500);
}

function toggleSocialForm(optionId, show) {
    const option = document.getElementById(optionId);
    const initialBtn = option.querySelector('.social-btn-initial');
    const form = option.querySelector('.social-input-form');
    
    if (show) {
        initialBtn.classList.add('hidden');
        form.classList.add('visible');
    } else {
        initialBtn.classList.remove('hidden');
        form.classList.remove('visible');
    }
}

function selectSocialAccount(email, provider) {
    socialUserName = email.split('@')[0];
    performSocialLogin(null, provider);
}

function performSocialLogin(btn, provider) {
    if (btn) {
        btn.classList.add('loading');
        btn.disabled = true;
    }

    // Disable other social buttons during loading
    document.querySelectorAll('.social-btn').forEach(b => { if(b !== btn) b.disabled = true; });

    setTimeout(() => {
        isLoggedIn = true;
        if (!socialUserName) socialUserName = `${provider} User`;
        
        updateAuthButton();
        closeLoginModal();

        if (btn) {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
        // Re-enable all social buttons
        document.querySelectorAll('.social-btn').forEach(b => b.disabled = false);
        
        console.log(`User logged in via ${provider}`);
    }, 1500);
}

function handleSocialLogin(event) {
    const btn = event.currentTarget;
    const provider = btn.classList.contains('google-btn') ? 'Google' : 'Gmail';
    const optionId = provider.toLowerCase() + '-option';

    if (btn.classList.contains('social-btn-initial')) {
        toggleSocialForm(optionId, true);
    } else {
        const emailInput = document.getElementById(`${provider.toLowerCase()}-email`);
        if (emailInput && emailInput.value) {
            socialUserName = emailInput.value.split('@')[0];
        }
        performSocialLogin(btn, provider);
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

// Parallax Effect for the Main Banner
function setupParallax() {
    const bannerImg = document.querySelector('.Top img');
    const bannerTitle = document.querySelector('.Top h1');
    const blobs = document.querySelectorAll('.blob:not(.cursor-blob)');
    if (!bannerImg || !bannerTitle) return;
    
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollValue = window.scrollY;

                // Update scroll progress bar
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (scrollValue / height) * 100;
                const progress = document.getElementById("scroll-progress");
                if (progress) progress.style.width = scrolled + "%";
                
                // Multi-layered parallax using translate3d for GPU acceleration
                // Banner image scales slightly and moves slower than the scroll
                bannerImg.style.transform = `translate3d(0, ${scrollValue * 0.25}px, 0) scale(${1 + scrollValue * 0.00015})`;
                
                // Title skews slightly and fades out progressively as it moves upward
                const titleOpacity = Math.max(0, 1 - scrollValue / 500);
                bannerTitle.style.transform = `translate3d(0, ${scrollValue * -0.15}px, 0) skewX(${scrollValue * 0.02}deg)`;
                bannerTitle.style.opacity = titleOpacity;

                // Subtle parallax for background blobs to enhance the "liquid" depth
                if (blobs[0]) blobs[0].style.translate = `0 ${scrollValue * 0.1}px`;
                if (blobs[1]) blobs[1].style.translate = `0 ${scrollValue * -0.05}px`;
                
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}
// Function to update cart display
function updateCartDisplay() {
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.innerText = totalItems;

        // Add pulse animation if items > 0
        if (totalItems > 0) {
            cartCountElement.style.animation = 'badgePulse 2s infinite';
        }

        const cartBtn = document.getElementById("cart-btn");
        if (cartBtn) {
            cartBtn.classList.remove('cart-bounce');
            void cartBtn.offsetWidth; // Trigger reflow to restart animation
            cartBtn.classList.add('cart-bounce');
        }
    } else {
        console.warn("Cart count element not found! Make sure an element with id 'cart-count' exists.");
    }
}

function openCartModal() {
    renderCartItems();
    document.getElementById('cart-modal').classList.add('active');
}

function closeCartModal() {
    document.getElementById('cart-modal').classList.remove('active');
}

function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    const totalPriceElement = document.getElementById('cart-total-price');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #888; padding: 20px;">Your cart is empty.</p>';
        totalPriceElement.innerText = '₹0';
        document.getElementById('checkout-btn').disabled = true;
        return;
    }

    document.getElementById('checkout-btn').disabled = false;
    container.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemPrice = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
        total += (itemPrice * item.quantity);
        
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>₹${itemPrice}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item-btn" onclick="removeFromCart(${index})">&times;</button>
        `;
        container.appendChild(itemDiv);
    });

    totalPriceElement.innerText = `₹${total}`;
}

function updateQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        updateCartDisplay();
        renderCartItems();
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
    renderCartItems();
}

function openCheckoutModal() {
    // Enforce login only when the user attempts to finalize a purchase.
    if (!isLoggedIn) {
        openLoginModal();
        return;
    }

    closeCartModal();
    // Reset payment details when opening
    const paymentDetailsDiv = document.getElementById('payment-details');
    if (paymentDetailsDiv) paymentDetailsDiv.style.display = 'none';
    
    // Show/hide guest prompt based on login status
    const authPrompt = document.getElementById('checkout-auth-prompt');
    if (authPrompt) {
        authPrompt.style.display = isLoggedIn ? 'none' : 'flex';
    }

    document.getElementById('checkout-modal').classList.add('active');
}

function closeCheckoutModal() {
    document.getElementById('checkout-modal').classList.remove('active');
}

// Cart: Function to add item to cart
function addCart(event, productData = null) { 
    if (!isLoggedIn) {
        alert("Please login to add items to your cart.");
        openLoginModal();
        return;
    }

    // Trigger the ripple effect on the cursor blob
    const cursorBlob = document.querySelector('.cursor-blob');
    if (cursorBlob) {
        cursorBlob.classList.remove('pulse');
        void cursorBlob.offsetWidth; // Trigger reflow to restart animation
        cursorBlob.classList.add('pulse');
    }

    const button = event.target;
    const cartBtn = document.getElementById('cart-btn');
    const productCard = button.closest('.Sub');
    const imgToCopy = productCard ? productCard.querySelector('img') : null;

    const newItem = productData || {
        name: productCard?.querySelector('h4')?.innerText || "Sonata Watch",
        price: productCard?.querySelector('p')?.innerText || "₹2500",
        image: imgToCopy?.src || ""
    };

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(i => i.name === newItem.name);
    
    const addToData = () => {
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({ ...newItem, quantity: 1 });
        }
        updateCartDisplay();
    };

    // Provide immediate visual feedback on the button
    if (button && button.classList.contains('add-to-cart-btn')) {
        const originalText = button.innerText;
        button.innerText = "Added ✓";
        button.classList.add('added');
        setTimeout(() => {
            button.innerText = originalText;
            button.classList.remove('added');
        }, 1500);
    }

    if (!imgToCopy || !cartBtn) {
        addToData();
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
    const cartRect = cartBtn.getBoundingClientRect();

    // Trigger animation in next frame
    setTimeout(() => {
        flyingImg.style.left = `${cartRect.left}px`;
        flyingImg.style.top = `${cartRect.top}px`;
        flyingImg.style.width = '30px';
        flyingImg.style.height = '30px';
        flyingImg.style.opacity = '0.4';
    }, 10);

    flyingImg.addEventListener('transitionend', () => {
        flyingImg.remove();
        addToData();
        
        // Play success sound
        cartSuccessSound.currentTime = 0; // Reset to start for rapid clicks
        cartSuccessSound.play().catch(() => { /* Autoplay block catch */ });
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
        products.forEach((p, index) => {
            // Using template literals and proper event listener assignment
            const productCard = document.createElement('div');
            productCard.classList.add('card', 'Sub', 'reveal'); // Added reveal class
            // Apply staggered transition delay
            productCard.style.transitionDelay = `${index * 0.1}s`;
            productCard.innerHTML = `
                <br>
                <img src="${p.image}" alt="${p.name}">
                <h4>${p.name}</h4>
                <p>₹${p.price}</p>
                <button class="add-to-cart-btn" data-product-name="${p.name}">Add to Cart</button>
                <br><br>
            `;
            container.appendChild(productCard);
            
            // Use a small timeout to ensure the browser registers the element before starting the reveal
            setTimeout(() => productCard.classList.add('active'), 50);
        });

        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const card = event.target.closest('.card');
                const name = card.querySelector('h4').innerText;
                const price = card.querySelector('p').innerText;
                const image = card.querySelector('img').src;
                addCart(event, { name, price, image });
            });
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
    // Handle Preloader removal
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader-wrapper');
        if (loader) {
            loader.classList.add('loaded');
        }
    });

    // Reveal the main header (containing the Login button) on page load
    const header = document.getElementById('main-header');
    if (header) {
        setTimeout(() => header.classList.add('visible'), 100);
    }

    updateCartDisplay(); // Set initial cart count
    loadProducts(); // Fetch and display products
    handleScrollReveal(); // Initialize animations
    setupParallax(); // Initialize banner parallax
    updateAuthButton(); // Set initial state for login button

    // Mouse follower for liquid background
    const cursorBlob = document.querySelector('.cursor-blob');
    const bgBlobs = document.querySelectorAll('.blob:not(.cursor-blob)');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let currentScale = 1;
    let isMouseDown = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    window.addEventListener('mousedown', () => {
        isMouseDown = true;
        if (cursorBlob) {
            // Trigger the pulse/ripple animation
            cursorBlob.classList.remove('pulse');
            void cursorBlob.offsetWidth; // Trigger reflow
            cursorBlob.classList.add('pulse');
        }
    });

    window.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    const smoothMove = () => {
        let targetX = mouseX;
        let targetY = mouseY;
        let targetScale = isMouseDown ? 1.4 : 1; // Grow on click

        // Magnetic attraction logic for interactive elements
        const magnetics = document.querySelectorAll('.add-to-cart-btn, .cart-btn, .auth-btn');
        
        magnetics.forEach(el => {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dx = mouseX - centerX;
            const dy = mouseY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // If mouse is within 150px of a button, gravitate the blob center towards it
            if (distance < 150) {
                targetX = centerX + (dx * 0.3); // 70% pull toward center
                targetY = centerY + (dy * 0.3);
                targetScale = 0.6; // Shrink blob to "focus" on the button
            }
        });

        // Calculate velocity for squash and stretch
        const vx = targetX - currentX;
        const vy = targetY - currentY;
        const speed = Math.sqrt(vx * vx + vy * vy);

        // Linear interpolation (lerp) for smooth trailing effect
        currentX += ta
            cursorBlob.style.transform = `translate(${currentX - 125}px, ${currentY - 125}px) rotate(${rotation}deg) scale(${currentScale * stretch}, ${currentScale / stretch})`;
        }
        // Background blobs react subtly to mouse position for extra depth
        bgBl// Multipl
            const intensity = isMouseDown ? 0.04 : 0.01;
            const shiftX = (mouseX - window.innerWidth / 2) * (intensity * (i + 1));
            const shiftY = (mouseY - window.innerHeight / 2) * (intensity * (i + 1));
            // Use independent translate property to avoid conflicting with CSS animations
            blob.style.translate = `${shiftX}px ${shiftY}px`;
        });

        requestAnimationFrame(smoothMove);
    };
    smoothMove();

    const authBtn = document.getElementById('auth-btn');
    if (authBtn) {
        authBtn.addEventListener('click', handleAuth);
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignUpSubmit);
    }

    const showSignupLink = document.getElementById('show-signup');
    if (showSignupLink) showSignupLink.addEventListener('click', showSignUp);
    const showLoginLink = document.getElementById('show-login');
    if (showLoginLink) showLoginLink.addEventListener('click', showLogin);

    const forgotPw = document.getElementById('forgot-password');
    if (forgotPw) {
        forgotPw.addEventListener('click', handleForgotPassword);
    }

    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) cartBtn.addEventListener('click', openCartModal);

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckoutModal);

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('ship-name').value;
            alert(`Thank you for your purchase, ${name}! Your order has been placed successfully.`);
            cart = [];
            updateCartDisplay();
            closeCheckoutModal();
        });
    }

    // Handle Social Login Buttons
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', handleSocialLogin);
    });
    
    document.querySelectorAll('.social-submit-btn').forEach(btn => {
        btn.addEventListener('click', handleSocialLogin);
    });

    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const optionId = e.target.closest('.social-option').id;
            toggleSocialForm(optionId, false);
        });
    });

    const recoveryForm = document.getElementById('recovery-form');
    if (recoveryForm) {
        recoveryForm.addEventListener('submit', handleRecoverySubmit);
    }

    setupPasswordToggle(); // Initialize password toggle

    // Also handle static buttons in the HTML that aren't loaded via API
    document.querySelectorAll('.Sub button').forEach(button => {
        if (!button.classList.contains('add-to-cart-btn')) {
            button.addEventListener('click', (event) => addCart(event));
        }
    });
});