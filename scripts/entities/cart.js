import { getPriceOfProduct } from "../data/products.js";
import {
  getPriceOfDeliveryOption,
  existDeliveryOption,
} from "../data/deliveryOptions.js";

class Cart {
  cartItems;
  #localStorageKey;

  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
    this.loadFromStorage();
  }

  #initializeCart() {
    const storagedCart = localStorage.getItem(this.#localStorageKey);

    const defaultCartValues = [
      {
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 2,
        deliveryOptionId: "1",
      },
      {
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 1,
        deliveryOptionId: "2",
      },
    ];

    const cartItems = storagedCart
      ? JSON.parse(storagedCart)
      : defaultCartValues;

    return cartItems;
  }

  loadFromStorage() {
    this.cartItems = this.#initializeCart();
  }

  saveToLocalStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
  }

  findItemInCart(productId) {
    if (!this.cartItems) {
      return null;
    }

    for (let i = 0; i < this.cartItems.length; i++) {
      const product = this.cartItems[i];
      if (product.productId === productId) {
        return product;
      }
    }

    return null;
  }

  addNew(productId, quantity) {
    this.cartItems?.push({
      //productId: productId,
      //quantity: quantity

      productId, // [[shorthand-property]]
      quantity,
      deliveryOptionId: "1",
    });
  }

  updateCartQuantity(product, quantity) {
    product.quantity += quantity;
  }

  addToCart(productId, quantity) {
    const product = this.findItemInCart(productId);
    if (product) {
      this.updateCartQuantity(product, quantity);
    } else {
      this.addNew(productId, quantity);
    }
    this.saveToLocalStorage();
  }

  updateDeliveryOptionIdInCart(deliveryOptionId, productId) {
    const prodcut = this.findItemInCart(productId);

    if (!prodcut || !existDeliveryOption(deliveryOptionId)) {
      return;
    }

    prodcut.deliveryOptionId = deliveryOptionId;

    this.saveToLocalStorage();
  }

  getIndexOfProductInCart(productId) {
    if (!this.cartItems) {
      return -1;
    }

    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i].productId === productId) {
        return i;
      }
    }

    return -1;
  }

  removeFromCart(productId) {
    if (!this.cartItems) {
      return;
    }

    const productIndex = this.getIndexOfProductInCart(productId);

    if (productIndex === -1) {
      return;
    }

    this.cartItems.splice(productIndex, 1);

    this.saveToLocalStorage();
  }

  calculateCartQuantity() {
    if (!this.cartItems) {
      return 0;
    }

    return this.cartItems.reduce((acc, cartItem) => acc + cartItem.quantity, 0);
  }

  calculateTotalProductPriceCents() {
    if (!this.cartItems) {
      return 0;
    }

    return this.cartItems.reduce((acc, cartItem) => {
      const priceOfProduct = getPriceOfProduct(cartItem.productId);
      return acc + priceOfProduct * cartItem.quantity;
    }, 0);
  }

  calculateTotalShippingPriceCents() {
    if (!this.cartItems) {
      return 0;
    }

    return this.cartItems.reduce((acc, cartItem) => {
      const prictOfDeliveryOption = getPriceOfDeliveryOption(
        cartItem.deliveryOptionId
      );
      return acc + prictOfDeliveryOption;
    }, 0);
  }

  getTotalBeforeTaxCents() {
    return (
      this.calculateTotalProductPriceCents() +
      this.calculateTotalShippingPriceCents()
    );
  }

  getEstimatedTaxCents(tax) {
    return Math.round(this.getTotalBeforeTaxCents() * tax);
  }

  getOrderTotalCents(tax) {
    return this.getTotalBeforeTaxCents() + this.getEstimatedTaxCents(tax);
  }
}

export const cart = new Cart("cart");
