import { getPriceOfProduct } from "./products.js";
import { getPriceOfDeliveryOption, existDeliveryOption } from './deliveryOptions.js';

function Cart(localStorageKey) {
  const cart = {
    cartItems: undefined,

    initializeCart() {
      const storagedCart = localStorage.getItem(localStorageKey);

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

      const cartItems = storagedCart ? JSON.parse(storagedCart) : defaultCartValues;

      return cartItems;
    },

    loadFromStorage() {
      this.cartItems = cart.initializeCart();
    },

    saveToLocalStorage() {
      localStorage.setItem(localStorageKey, JSON.stringify(this.cartItems));
    },

    findItemInCart(productId) {
      if (!this.cartItemscart) {
        return null;
      }

      for (let i = 0; i < this.cartItemscart.length; i++) {
        const prodcut = this.cartItemscart[i];
        if (prodcut.productId === productId) {
          return prodcut;
        }
      }

      return null;
    },

    addNew(productId, quantity) {
      this.cartItems?.push({
        //productId: productId,
        //quantity: quantity

        productId, // [[shorthand-property]]
        quantity,
        deliveryOptionId: '1'
      });
    },

    updateCartQuantity(product, quantity) {
      product.quantity += quantity;
    },

    addToCart(productId, quantity) {
      const product = cart.findItemInCart(productId);
      if (product) {
        cart.updateCartQuantity(product, quantity)
      } else {
        cart.addNew(productId, quantity);
      }
      cart.saveToLocalStorage();
    },

    updateDeliveryOptionIdInCart(deliveryOptionId, productId) {
      const prodcut = cart.findItemInCart(productId);

      if (!prodcut || !existDeliveryOption(deliveryOptionId)) {
        return;
      }

      prodcut.deliveryOptionId = deliveryOptionId;

      cart.saveToLocalStorage();
    },

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
    },

    removeFromCart(productId) {
      if (!this.cartItems) {
        return;
      }

      const productIndex = cart.getIndexOfProductInCart(productId);

      if (productIndex === -1) {
        return;
      }

      this.cartItems.splice(productIndex, 1);

      cart.saveToLocalStorage();
    },

    calculateCartQuantity() {
      if (!this.cartItems) {
        return 0;
      }

      return this.cartItems.reduce((acc, cartItem) => acc + cartItem.quantity, 0);
    },

    calculateTotalProductPriceCents() {
      if (!this.cartItems) {
        return 0;
      }

      return this.cartItems.reduce((acc, cartItem) => {
        const priceOfProduct = getPriceOfProduct(cartItem.productId);
        return acc + (priceOfProduct * cartItem.quantity)
      }, 0);
    },

    calculateTotalShippingPriceCents() {
      if (!this.cartItems) {
        return 0;
      }

      return this.cartItems.reduce((acc, cartItem) => {
        const prictOfDeliveryOption = getPriceOfDeliveryOption(cartItem.deliveryOptionId);
        return acc + prictOfDeliveryOption;
      }, 0);
    },

    getTotalBeforeTaxCents() {
      return cart.calculateTotalProductPriceCents() + cart.calculateTotalShippingPriceCents();
    },

    getEstimatedTaxCents(tax) {
      return Math.round(cart.getTotalBeforeTaxCents() * tax);
    },

    getOrderTotalCents(tax) {
      return cart.getTotalBeforeTaxCents() + cart.getEstimatedTaxCents(tax);
    }
  };

  return cart;
}

const cart = Cart('cart-oop');
const businessCart = Cart('cart-business');

cart.loadFromStorage();
businessCart.loadFromStorage();
console.log(cart);
console.log(businessCart);