import { getPriceOfProduct } from "./products.js";
import { getPriceOfDeliveryOption } from './deliveryOptions.js';

export const cart = initializeCart();

function initializeCart() {
  const storagedCart = localStorage.getItem('cart');

  const defaultCartValues = [{
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity: 2,
    deliveryOptionId: '1'
  },
  {
    productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity: 1,
    deliveryOptionId: '2'
  }]

  const cart = storagedCart ? JSON.parse(storagedCart) : defaultCartValues;

  return cart;
}

export function saveToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function findItemInCart(cart, productId) {
  if (!cart) {
    return null;
  }

  for (let i = 0; i < cart.length; i++) {
    const prodcut = cart[i];
    if (prodcut.productId === productId) {
      return prodcut;
    }
  }

  return null;
}

function addNew(productId, quantity) {
  cart?.push({
    //productId: productId,
    //quantity: quantity

    productId, // [[shorthand-property]]
    quantity,
    deliveryOptionId: '1'
  });
}

function updateCartQuantity(product, quantity) {
  product.quantity += quantity;
}

export function updateDeliveryOptionIdInCart(deliveryOptionId, productId) {
  const prodcut = findItemInCart(cart, productId);

  if (!prodcut) {
    return;
  }

  prodcut.deliveryOptionId = deliveryOptionId;

  saveToLocalStorage();
}

export function addToCart(productId, quantity) {
  const product = findItemInCart(cart, productId);
  if (product) {
    updateCartQuantity(product, quantity)
  } else {
    addNew(productId, quantity);
  }
  saveToLocalStorage();
}

function getIndexOfProductInCart(productId) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].productId === productId) {
      return i;
    }
  }

  return -1;
}

export function removeFromCart(productId) {
  const productIndex = getIndexOfProductInCart(productId);

  cart.splice(productIndex, 1);
  saveToLocalStorage();
}

export function calculateCartQuantity() {
  if (!cart) {
    return 0;
  }

  let countQuantity = 0;

  cart.forEach(product => {
    countQuantity += product.quantity;
  })

  return countQuantity;
}

export function calculateTotalProductPriceCents() {
  if (!cart) {
    return 0;
  }

  let totalPrice = 0;
  cart.forEach(cartItem => {
    const priceOfProduct = getPriceOfProduct(cartItem.productId);
    totalPrice += (priceOfProduct * cartItem.quantity);
  });

  return totalPrice;
}

export function calculateTotalShippingPriceCents() {
  if (!cart) {
    return 0;
  }

  let totalShipping = 0;

  cart.forEach(cartItem => {
    const prictOfDeliveryOption = getPriceOfDeliveryOption(cartItem.deliveryOptionId);
    totalShipping += prictOfDeliveryOption;
  });

  return totalShipping;
}

export function getTotalBeforeTaxCents() {
  return calculateTotalProductPriceCents() + calculateTotalShippingPriceCents();
}

export function getEstimatedTaxCents(tax) {
  return Math.round(getTotalBeforeTaxCents() * tax);
}

export function getOrderTotalCents(tax) {
  return getTotalBeforeTaxCents() + getEstimatedTaxCents(tax);
}