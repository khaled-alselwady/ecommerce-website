import { cart } from "../../../scripts/data/cart.js";

export function mockLocalStorage(getItemReturnValue, cart) {
  spyOn(localStorage, "setItem");
  spyOn(localStorage, "getItem").and.callFake(() => {
    return JSON.stringify(getItemReturnValue);
  });
  cart.loadFromStorage();
}

describe("test suite: addToCart", () => {
  it("adds an existing product ot the cart", () => {
    mockLocalStorage(
      [
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 1,
          deliveryOptionId: "1",
        },
      ],
      cart
    );

    cart.addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6", 1);

    expect(cart.cartItems.length).toEqual(1);

    // we have to mock the setItem method first using (spyOn).
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "cart",
      JSON.stringify(cart.cartItems)
    );

    expect(cart.cartItems[0].productId).toEqual(
      "e43638ce-6aa0-4b85-b27f-e1d07eb678c6"
    );
    expect(cart.cartItems[0].quantity).toEqual(2);
  });

  it("adds a new product to the cart", () => {
    mockLocalStorage([], cart);

    cart.addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6", 1);
    expect(cart.cartItems.length).toEqual(1);

    // we have to mock the setItem method first using (spyOn).
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "cart",
      JSON.stringify(cart.cartItems)
    );

    expect(cart.cartItems[0].productId).toEqual(
      "e43638ce-6aa0-4b85-b27f-e1d07eb678c6"
    );
    expect(cart.cartItems[0].quantity).toEqual(1);
  });
});

describe("test suite: removeFromCart", () => {
  beforeEach(() => {
    mockLocalStorage(
      [
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 2,
          deliveryOptionId: "1",
        },
      ],
      cart
    );
  });

  it("removes an existing product from the cart", () => {
    cart.removeFromCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");

    expect(cart.cartItems.length).toEqual(0);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "cart",
      JSON.stringify([])
    );
  });

  it("removes a product that is not in the cart", () => {
    cart.removeFromCart("does-not-exist");

    expect(cart.cartItems.length).toEqual(1);
    expect(cart.cartItems[0].productId).toEqual(
      "e43638ce-6aa0-4b85-b27f-e1d07eb678c6"
    );
    expect(cart.cartItems[0].quantity).toEqual(2);
    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
  });
});

describe("test suite: cartCalculations", () => {
  beforeEach(() => {
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
    mockLocalStorage(defaultCartValues, cart);
  });

  it("calculates cart quantity", () => {
    expect(cart.calculateCartQuantity()).toEqual(3);
  });

  it("calculates total product price in cents", () => {
    expect(cart.calculateTotalProductPriceCents()).toEqual(4275);
  });

  it("calculates total shipping price in cents", () => {
    expect(cart.calculateTotalShippingPriceCents()).toEqual(499);
  });
});

describe("test suite: updateDeliveryOption", () => {
  beforeEach(() => {
    mockLocalStorage(
      [
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 1,
          deliveryOptionId: "1",
        },
      ],
      cart
    );
  });

  it("updates the delivery option of a product in the cart", () => {
    cart.updateDeliveryOptionIdInCart(
      "3",
      "e43638ce-6aa0-4b85-b27f-e1d07eb678c6"
    );

    expect(cart.cartItems.length).toEqual(1);
    expect(cart.cartItems[0].productId).toEqual(
      "e43638ce-6aa0-4b85-b27f-e1d07eb678c6"
    );
    expect(cart.cartItems[0].quantity).toEqual(1);
    expect(cart.cartItems[0].deliveryOptionId).toEqual("3");

    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "cart",
      JSON.stringify([
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 1,
          deliveryOptionId: "3",
        },
      ])
    );
  });

  it("does nothing if the product is not in the cart", () => {
    cart.updateDeliveryOptionIdInCart("3", "does-not-exist");

    expect(cart.cartItems.length).toEqual(1);
    expect(cart.cartItems[0].productId).toEqual(
      "e43638ce-6aa0-4b85-b27f-e1d07eb678c6"
    );
    expect(cart.cartItems[0].quantity).toEqual(1);
    expect(cart.cartItems[0].deliveryOptionId).toEqual("1");

    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
  });

  it("does nothing if the delivery option does not exist", () => {
    cart.updateDeliveryOptionIdInCart(
      "does-not-exist",
      "e43638ce-6aa0-4b85-b27f-e1d07eb678c6"
    );

    expect(cart.cartItems.length).toEqual(1);
    expect(cart.cartItems[0].productId).toEqual(
      "e43638ce-6aa0-4b85-b27f-e1d07eb678c6"
    );
    expect(cart.cartItems[0].quantity).toEqual(1);
    expect(cart.cartItems[0].deliveryOptionId).toEqual("1");

    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
  });
});
