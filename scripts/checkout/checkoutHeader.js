import { cart } from "../data/cart.js";

function getTotalCartQuantity() {
  const totalCartQuantity = cart.calculateCartQuantity();
  return totalCartQuantity <= 1
    ? `${totalCartQuantity} item`
    : `${totalCartQuantity} items`;
}

function generateCheckoutHeaderHTML() {
  let html = `
      <div class="header-content">
        <div class="checkout-header-left-section">
          <a href="amazon.html">
            <img class="amazon-logo" src="images/amazon-logo.png">
            <img class="amazon-mobile-logo" src="images/amazon-mobile-logo.png">
          </a>
        </div>

        <div class="checkout-header-middle-section">
          Checkout (<a class="return-to-home-link" href="amazon.html">${getTotalCartQuantity()}</a>)
        </div>

        <div class="checkout-header-right-section">
          <img src="images/icons/checkout-lock-icon.png">
        </div>
      </div>
  `;
  return html;
}

function displayCheckoutHeader() {
  const checkoutHeaderElement = document.querySelector(".js-checkout-header");

  if (!checkoutHeaderElement) {
    return;
  }

  checkoutHeaderElement.innerHTML = generateCheckoutHeaderHTML();
}

export function renderCheckoutHeader() {
  displayCheckoutHeader();
}
