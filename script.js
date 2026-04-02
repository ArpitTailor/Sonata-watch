let API = "http://localhost:5000/api/products";
let cartCount = 0;

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
function addCart(productName = "item") { // Added a default parameter for better context
    cartCount++;
    updateCartDisplay();
    console.log(`Added "${productName}" to cart. Total items: ${cartCount}`);
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
            productCard.classList.add('card', 'Sub'); // Assuming 'Sub' is the styling for individual product cards
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
            button.addEventListener('click', (event) => addCart(event.target.dataset.productName));
        });

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
});