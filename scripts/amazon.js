import { addToCart, calculateCartQuantity } from './data/cart.js';
import { products } from './data/products.js'

function renderProductHTML() {
  let html = '';

  products.forEach((product) => {
    html += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image" src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars" src="${product.getStarsUrl()}">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          ${product.getPrice()}
        </div>

        <div class="product-quantity-container">
          <select class="js-quantity-selector-${product.id}">
            <option selected-value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart-${product.id}">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart" data-Product-id = "${product.id}">
          Add to Cart
        </button>
      </div>
    `;
  });

  return html;
}

function displayAllProducts() {
  const productGridElement = document.querySelector('.js-prodcut-grid');
  if (!productGridElement) {
    return;
  }
  productGridElement.innerHTML = renderProductHTML();
}

function getSelectedProductQuantity(productId) {
  const selectedProductQuantityElement = document.querySelector(`.js-quantity-selector-${productId}`);

  if (!selectedProductQuantityElement) {
    return 0;
  }

  return Number(selectedProductQuantityElement.value);
}

function displayCartQuantity(cartQuantity) {
  const cartQuantityElement = document.querySelector('.js-cart-quantity');

  if (!cartQuantityElement) {
    return;
  }

  cartQuantityElement.innerHTML = cartQuantity;
}

// We're going to use an object to save the timeout ids.
// The reason we use an object is because each product
// will have its own timeoutId. So an object lets us
// save multiple timeout ids for different products.
// For example:
// {
//   'product-id1': 2,
//   'product-id2': 5,
//   ...
// }
// (2 and 5 are ids that are returned when we call setTimeout).
// each product-id will have a value (the previous timeoutId), so we want to stop it before open a new one.
const addedMessageTimeouts = {};

function hideMessageAfterDelayInMilliseconds(element, milliseconds, productId) {
  // Check if there's a previous timeout for this
  // product. If there is, we should stop it.
  const previousTimeoutId = addedMessageTimeouts[productId];
  if (previousTimeoutId) {
    clearTimeout(previousTimeoutId);
  }

  const timeoutId = setTimeout(() => {
    element.classList.remove('added-to-cart-visible');
  }, milliseconds);

  // Save the timeoutId for this product
  // so we can stop it later if we need to.
  addedMessageTimeouts[productId] = timeoutId;
}

function displayAddedToCartMessage(productId) {
  const messageElement = document.querySelector(`.js-added-to-cart-${productId}`);

  if (!messageElement) {
    return;
  }

  messageElement.classList.add('added-to-cart-visible');

  hideMessageAfterDelayInMilliseconds(messageElement, 2000, productId);
}

function initializeAddToCartButtons() {
  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      // const productId = button.dataset.productId;

      const { productId } = button.dataset; // [[destructuring]], I can use it because `dataset` is an object
      const quantity = getSelectedProductQuantity(productId);
      addToCart(productId, quantity);

      displayCartQuantity(calculateCartQuantity());
      displayAddedToCartMessage(productId);
    });
  });
}

function main() {
  displayAllProducts();
  displayCartQuantity(calculateCartQuantity());
  initializeAddToCartButtons(); // Ensure event listeners are set up right after rendering
}

main();