const PRODUCTS = {
  apple: { name: "Apple", emoji: "🍏", price: 1.50 },
  banana: { name: "Banana", emoji: "🍌", price: 1.00 },
  lemon: { name: "Lemon", emoji: "🍋", price: 2.00 },
  pear: { name: "Pear", emoji: "🍐", price: 1.30 },
};

function getBasket() {
  const basket = localStorage.getItem("basket");
  return basket ? JSON.parse(basket) : {};
}

function addToBasket(product) {
  const basket = getBasket();
  if (basket[product]) {
    basket[product] += 1;
  } else {
    basket[product] = 1;
  }
  localStorage.setItem("basket", JSON.stringify(basket));
}

function clearBasket() {
  localStorage.removeItem("basket");
}

function renderBasket() {
  const basket = getBasket();
  const basketList = document.getElementById("basketList");
  const cartButtonsRow = document.querySelector(".cart-buttons-row");
  const totalPriceElement = document.getElementById("totalPrice");
  if (!basketList) return;
  basketList.innerHTML = "";
  
  const basketItems = Object.keys(basket);
  let totalPrice = 0;
  
  if (basketItems.length === 0) {
    basketList.innerHTML = "<li>No products in basket.</li>";
    if (cartButtonsRow) cartButtonsRow.style.display = "none";
    if (totalPriceElement) totalPriceElement.style.display = "none";
    return;
  }
  
  basketItems.forEach((product) => {
    const item = PRODUCTS[product];
    const quantity = basket[product];
    if (item) {
      const itemTotal = item.price * quantity;
      totalPrice += itemTotal;
      const li = document.createElement("li");
      li.innerHTML = `<span class='basket-emoji'>${item.emoji}</span> <span>${item.name}</span> <span class="quantity">x${quantity}</span> <span class="item-price">€${itemTotal.toFixed(2)}</span>`;
      basketList.appendChild(li);
    }
  });
  
  if (totalPriceElement) {
    totalPriceElement.innerHTML = `Total: €${totalPrice.toFixed(2)}`;
    totalPriceElement.style.display = "block";
  }
  
  if (cartButtonsRow) cartButtonsRow.style.display = "flex";
}

function renderBasketIndicator() {
  const basket = getBasket();
  let indicator = document.querySelector(".basket-indicator");
  if (!indicator) {
    const basketLink = document.querySelector(".basket-link");
    if (!basketLink) return;
    indicator = document.createElement("span");
    indicator.className = "basket-indicator";
    basketLink.appendChild(indicator);
  }
  
  // Calculate total quantity of all items
  const totalItems = Object.values(basket).reduce((sum, quantity) => sum + quantity, 0);
  
  if (totalItems > 0) {
    indicator.textContent = totalItems;
    indicator.style.display = "flex";
  } else {
    indicator.style.display = "none";
  }
}

// Dark Mode Functions
function initDarkMode() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateDarkModeButton(savedTheme);
}

function toggleDarkMode() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateDarkModeButton(newTheme);
}

function updateDarkModeButton(theme) {
  const button = document.getElementById('darkModeToggle');
  if (button) {
    button.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

// Initialize dark mode toggle
document.addEventListener('DOMContentLoaded', function() {
  initDarkMode();
  
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleDarkMode);
  }
});

// Call this on page load and after basket changes
if (document.readyState !== "loading") {
  renderBasketIndicator();
} else {
  document.addEventListener("DOMContentLoaded", renderBasketIndicator);
}

// Patch basket functions to update indicator
const origAddToBasket = window.addToBasket;
window.addToBasket = function (product) {
  origAddToBasket(product);
  renderBasketIndicator();
};
const origClearBasket = window.clearBasket;
window.clearBasket = function () {
  origClearBasket();
  renderBasketIndicator();
};
