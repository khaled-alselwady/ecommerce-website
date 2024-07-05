import { renderOrderSummary } from "../../../scripts/checkout/orderSummary.js";
import { renderPaymentSummary } from "../../../scripts/checkout/paymentSummary.js";
import { mockLocalStorage } from "../data/cartTest.js";
import { cart } from "../../../scripts/entities/cart.js";

describe("test suite: renderOrderSummary", () => {
  const productId1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
  const productId2 = "15b6fc6f-327a-4ec4-896f-486349e85a3d";

  // share code before each `it` functions. a type of [Hooks]
  beforeEach(() => {
    document.querySelector(".js-test-container").innerHTML = `
        <div class="js-order-summary"></div>
        <div class="js-payment-summary"></div>
      `;

    const defaultCartValues = [
      {
        productId: productId1,
        quantity: 2,
        deliveryOptionId: "3",
      },
      {
        productId: productId2,
        quantity: 1,
        deliveryOptionId: "2",
      },
    ];

    mockLocalStorage(defaultCartValues, cart);

    renderOrderSummary();
    renderPaymentSummary();
  });

  it("displays the cart", () => {
    expect(document.querySelectorAll(".js-cart-item-container").length).toEqual(
      2
    );
    expect(
      document.querySelector(`.js-product-quantity-${productId1}`).innerText
    ).toContain("Quantity: 2");
    expect(
      document.querySelector(`.js-product-quantity-${productId2}`).innerText
    ).toContain("Quantity: 1");
    expect(
      document.querySelector(`.js-product-name-${productId1}`).innerText
    ).toEqual("Black and Gray Athletic Cotton Socks - 6 Pairs");
    expect(
      document.querySelector(`.js-product-name-${productId2}`).innerText
    ).toEqual("Intermediate Size Basketball");
    expect(
      document.querySelector(`.js-product-price-${productId1}`).innerText
    ).toEqual("$10.90");
    expect(
      document.querySelector(`.js-product-price-${productId2}`).innerText
    ).toEqual("$20.95");
  });

  it("removes a product", () => {
    document.querySelector(`.js-delete-quantity-link-${productId1}`).click();
    expect(document.querySelectorAll(`.js-cart-item-container`).length).toEqual(
      1
    );
    expect(
      document.querySelector(`.js-cart-item-container-${productId1}`)
    ).toEqual(null);
    expect(
      document.querySelector(`.js-cart-item-container-${productId2}`)
    ).not.toEqual(null);

    expect(cart.cartItems.length).toEqual(1);
    expect(cart.cartItems[0].productId).toEqual(productId2);

    expect(localStorage.setItem).toHaveBeenCalledTimes(1);

    expect(
      document.querySelector(`.js-product-name-${productId2}`).innerText
    ).toEqual("Intermediate Size Basketball");

    expect(
      document.querySelector(`.js-product-price-${productId2}`).innerText
    ).toEqual("$20.95");
  });

  it("updates the delivery option", () => {
    const deliveryOptionId = "3";
    document
      .querySelector(`.js-delivery-option-${productId1}-${deliveryOptionId}`)
      .click();
    expect(
      document.querySelector(
        `.js-delivery-option-input-${productId1}-${deliveryOptionId}`
      ).checked
    ).toEqual(true);
    expect(cart.cartItems.length).toEqual(2);
    expect(cart.cartItems[0].productId).toEqual(productId1);
    expect(cart.cartItems[0].deliveryOptionId).toEqual(deliveryOptionId);

    expect(
      document.querySelector(".js-total-shipping-price-cents").innerText
    ).toEqual("$14.98");
    expect(
      document.querySelector(".js-order-total-price-cent").innerText
    ).toEqual("$63.50");
  });

  // share code after each `it` functions. a type of [Hooks]
  afterEach(() => {
    document.querySelector(".js-test-container").innerHTML = "";
  });
});
