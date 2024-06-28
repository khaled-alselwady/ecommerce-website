import { cart } from '../data/cart.js';
import { products } from '../data/products.js'
import { formatCurrency } from './utils/money.js';

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
          <img class="product-rating-stars" src="images/ratings/rating-${product.rating.stars * 10}.png">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          $${formatCurrency(product.priceCents)}
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

        <div class="added-to-cart js-added-tp-cart-${product.id}">
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

function findItemInCart(cart, id) {
  if (!cart) {
    return null;
  }

  for (let i = 0; i < cart.length; i++) {
    const prodcut = cart[i];
    if (prodcut.productId === id) {
      return prodcut;
    }
  }

  return null;
}

function getSelectedProductQuantity(productId) {
  const selectedProductQuantityElement = document.querySelector(`.js-quantity-selector-${productId}`);

  if (!selectedProductQuantityElement) {
    return 0;
  }

  return Number(selectedProductQuantityElement.value);
}

function addToCart(productId) {
  const product = findItemInCart(cart, productId);
  const quantity = getSelectedProductQuantity(productId);

  if (product) {
    product.quantity += quantity;
  } else {
    cart.push({
      //productId: productId,
      //quantity: quantity

      productId, // [[shorthand-property]]
      quantity
    });
  }
}

function countCartQuantity(cart) {
  if (!cart) {
    return 0;
  }

  let countQuantity = 0;

  cart.forEach(product => {
    countQuantity += product.quantity;
  })

  return countQuantity;
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
  const messageElement = document.querySelector(`.js-added-tp-cart-${productId}`);

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
      addToCart(productId);
      displayCartQuantity(countCartQuantity(cart));
      displayAddedToCartMessage(productId);
    });
  });
}

function main() {
  displayAllProducts();
  initializeAddToCartButtons(); // Ensure event listeners are set up right after rendering
}

main();