let API = "http://localhost:5000/api/products";
let cartCount = 0;

// Load Products
fetch(API)
.then(res => res.json())
.then(data => {
    let container = document.getElementById("products");

    data.forEach(p => {
        container.innerHTML += `
        <div class="card">
            <img src="${p.image}">
            <h4>${p.name}</h4>
            <p>₹${p.price}</p>
            <button onclick="addCart()">Add to Cart</button>
        </div>`;
    });
});

// Cart
function addCart() {
    cartCount++;
    document.getElementById("cart-count").innerText = cartCount + " 🛒";
}