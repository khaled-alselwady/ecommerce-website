import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  findItemInCart,
  saveToLocalStorage
} from '../data/cart.js';
import { findProduct } from '../data/products.js';
import { formatCurrency } from './utils/money.js'

const CLASS_CART_ITEM_CONTAINER = 'js-cart-item-container';
const CLASS_QUANTITY_LABEL = 'js-quantity-label';
const CLASS_QUANTITY_INPUT = 'js-quantity-input';
const CLASS_DELETE_QUANTITY_LINK = 'js-delete-quantity-link';
const CLASS_UPDATE_QUANTITY_LINK = 'js-update-quantity-link';
const CLASS_SAVE_QUANTITY_LINK = 'js-save-quantity-link';
const CLASS_IS_EDITING_QUANTITY = 'is-editing-quantity';

function renderCartSummaryHTML() {
  let cartSummaryHTML = '';

  cart.forEach(cartItem => {
    const product = findProduct(cartItem.productId);

    if (!product) {
      return;
    }

    cartSummaryHTML += `
      <div class="cart-item-container ${CLASS_CART_ITEM_CONTAINER}-${product.id}">
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
                Quantity: <span class="quantity-label ${CLASS_QUANTITY_LABEL}-${product.id}">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary ${CLASS_UPDATE_QUANTITY_LINK}" data-product-id="${product.id}">
                Update
              </span>
              <input class="quantity-input ${CLASS_QUANTITY_INPUT} ${CLASS_QUANTITY_INPUT}-${product.id}" data-product-id="${product.id}">
              <span class="save-quantity-link link-primary ${CLASS_SAVE_QUANTITY_LINK}" data-product-id="${product.id}">
                Save
              </span>
              <span class="delete-quantity-link link-primary ${CLASS_DELETE_QUANTITY_LINK}" data-product-id="${product.id}">
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

function getCartItemContainerElement(productId) {
  const cartItemContainerElement = document.querySelector(`.${CLASS_CART_ITEM_CONTAINER}-${productId}`);
  if (!cartItemContainerElement) {
    return null;
  }
  return cartItemContainerElement;
}

function removeSpecificCartItemContainerFromPage(productId) {
  const cartItemContainerElement = getCartItemContainerElement(productId);

  if (!cartItemContainerElement) {
    return;
  }

  cartItemContainerElement.remove();
}

function addClickEventForDeleteItemInCart() {
  document.querySelectorAll(`.${CLASS_DELETE_QUANTITY_LINK}`)?.forEach(link => {
    //const productId = link.dataset.productId;
    const { productId } = link.dataset; // [destructuring]

    addEventToElement(link, 'click', () => {
      removeFromCart(productId);
      removeSpecificCartItemContainerFromPage(productId);
      updateDisplayTotalCartQuantity();
    });
  });
}

function addClickEventForUpdateQuantity() {
  document.querySelectorAll(`.${CLASS_UPDATE_QUANTITY_LINK}`).forEach(link => {
    addEventToElement(link, 'click', () => {
      const { productId } = link.dataset;
      const cartItemContainerElement = getCartItemContainerElement(productId);

      if (!cartItemContainerElement) {
        return;
      }
      cartItemContainerElement.classList.add(`${CLASS_IS_EDITING_QUANTITY}`);
    })
  });
}

function updateDisplayQuantityLabelElement(productId, newQuantity) {
  const quantityLabelElement = document.querySelector(`.${CLASS_QUANTITY_LABEL}-${productId}`);

  if (!quantityLabelElement) {
    return;
  }

  quantityLabelElement.innerHTML = newQuantity;
}

function isQuantityValid(quantity) {
  if (quantity < 0 || quantity >= 1000) {
    return false;
  }

  return true;
}

function getNewQuantityFromInput(productId) {
  const newQuantityElement = document.querySelector(`.${CLASS_QUANTITY_INPUT}-${productId}`);

  if (!newQuantityElement) {
    return 0;
  }

  const newQuantity = Number(newQuantityElement.value);

  if (!isQuantityValid(newQuantity)) {
    alert('Quantity must be at least 0 and less than 1000');
    return null;
  }

  return newQuantity;
}

function saveNewCartQuantity(productId, newQuantity) {
  const product = findItemInCart(cart, productId);
  if (!product) {
    return;
  }

  product.quantity = Number(newQuantity);
}

function removeIsEditingQuantityClass(productId) {
  const cartItemContainerElement = getCartItemContainerElement(productId);

  if (!cartItemContainerElement) {
    return;
  }

  cartItemContainerElement.classList.remove(`${CLASS_IS_EDITING_QUANTITY}`);
}

function updateCartQuantity(productId) {
  const newQuantity = getNewQuantityFromInput(productId);

  if (newQuantity === null) {
    return;
  }

  saveNewCartQuantity(productId, newQuantity);
  updateDisplayQuantityLabelElement(productId, newQuantity);
  updateDisplayTotalCartQuantity();
  saveToLocalStorage();
}

function addClickEventForSaveQuantity() {
  document.querySelectorAll(`.${CLASS_SAVE_QUANTITY_LINK}`).forEach(link => {
    addEventToElement(link, 'click', () => {
      const { productId } = link.dataset;
      removeIsEditingQuantityClass(productId);
      updateCartQuantity(productId);
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

function addKeydownEventForSaveQuantity() {
  document.querySelectorAll(`.${CLASS_QUANTITY_INPUT}`)?.forEach(input => {
    addEventToElement(input, 'keydown', (event) => {
      if (event?.key === 'Enter') {
        const { productId } = input.dataset;
        removeIsEditingQuantityClass(productId);
        updateCartQuantity(productId);
      }
    });
  });
}

function addEventHandlers() {
  addClickEventForDeleteItemInCart();
  addClickEventForUpdateQuantity();
  addClickEventForSaveQuantity();
  addKeydownEventForSaveQuantity();
}

function main() {
  displayOrderSummary();
  addEventHandlers();
  updateDisplayTotalCartQuantity();
}

main();
