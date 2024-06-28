import { cart, removeFromCart, calculateCartQuantity } from '../data/cart.js';
import { findProduct } from '../data/products.js';
import { formatCurrency } from './utils/money.js'

function renderCartSummaryHTML() {
  let cartSummaryHTML = '';

  cart.forEach(cartItem => {
    const product = findProduct(cartItem.productId);

    if (!product) {
      return;
    }

    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container-${product.id}">
        <div class="delivery-date">
          Delivery date: Tuesday, June 21
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${product.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${product.name}
            </div>
            <div class="product-price">
              $${formatCurrency(product.priceCents)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary">
                Update
              </span>
              <span class="delete-quantity-link link-primary js-delete-quantity-link" data-product-id="${product.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            <div class="delivery-option">
              <input type="radio" checked class="delivery-option-input" name="delivery-option-${product.id}">
              <div>
                <div class="delivery-option-date">
                  Tuesday, June 21
                </div>
                <div class="delivery-option-price">
                  FREE Shipping
                </div>
              </div>
            </div>
            <div class="delivery-option">
              <input type="radio" class="delivery-option-input" name="delivery-option-${product.id}">
              <div>
                <div class="delivery-option-date">
                  Wednesday, June 15
                </div>
                <div class="delivery-option-price">
                  $4.99 - Shipping
                </div>
              </div>
            </div>
            <div class="delivery-option">
              <input type="radio" class="delivery-option-input" name="delivery-option-${product.id}">
              <div>
                <div class="delivery-option-date">
                  Monday, June 13
                </div>
                <div class="delivery-option-price">
                  $9.99 - Shipping
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  });

  return cartSummaryHTML;
}

function displayOrderSummary() {
  const orderSummaryElement = document.querySelector('.js-order-summary');

  if (!orderSummaryElement) {
    return;
  }

  orderSummaryElement.innerHTML = renderCartSummaryHTML();
}

function addEventToElement(element, eventType, functionToExecute) {
  if (!element) {
    return;
  }

  element.addEventListener(eventType.toString(), functionToExecute)
}

function removeSpecificCartItemContainerFromPage(productId) {
  const cartItemContainer = document.querySelector(`.js-cart-item-container-${productId}`);

  if (!cartItemContainer) {
    return;
  }

  cartItemContainer.remove();
}

function addClickEventForDeleteItemInCart() {
  document.querySelectorAll('.js-delete-quantity-link')?.forEach(link => {
    //const productId = link.dataset.productId;
    const { productId } = link.dataset; // [destructuring]

    addEventToElement(link, 'click', () => {
      removeFromCart(productId);
      removeSpecificCartItemContainerFromPage(productId);
      updateDisplayTotalCartQuantity();
    });
  });
}

function updateDisplayTotalCartQuantity() {
  const totalCartQuantityElement = document.querySelector('.js-return-to-home-link');

  if (!totalCartQuantityElement) {
    return;
  }
  const totalCartQuantity = calculateCartQuantity();
  totalCartQuantityElement.innerHTML = totalCartQuantity <= 1 ?
    `${totalCartQuantity} item` : `${totalCartQuantity} items`;
}

function main() {
  displayOrderSummary();
  addClickEventForDeleteItemInCart();
  updateDisplayTotalCartQuantity();
}

main();
