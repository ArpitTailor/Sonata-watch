// ================= script.js =================
let cart = [];

function addToCart(name, price) {
  cart.push({ name, price });
  updateCart();
}

function updateCart() {
  const list = document.getElementById("cart-items");
  const count = document.getElementById("cart-count");
  const total = document.getElementById("total");

  list.innerHTML = "";
  let sum = 0;

  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ₹${item.price}`;
    list.appendChild(li);
    sum += item.price;
  });

  count.textContent = cart.length;
  total.textContent = sum;
}

// Slider animation
let slides = document.querySelectorAll(".slides img");
let index = 0;

setInterval(() => {
  slides[index].classList.remove("active");
  index = (index + 1) % slides.length;
  slides[index].classList.add("active");
}, 3000);
