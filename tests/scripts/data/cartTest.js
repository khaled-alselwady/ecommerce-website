import {
  cart,
  addToCart,
  removeFromCart,
  loadFromStorage,
  calculateCartQuantity,
  calculateTotalProductPriceCents,
  calculateTotalShippingPriceCents
} from '../../../scripts/data/cart.js';

export function mockLocalStorage(getItemReturnValue) {
  spyOn(localStorage, 'setItem');
  spyOn(localStorage, 'getItem').and.callFake(() => {
    return JSON.stringify(getItemReturnValue);
  });
  loadFromStorage();
}

describe('test suite: addToCart', () => {
  it('adds an existing product ot the cart', () => {
    mockLocalStorage([{
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 1,
      deliveryOptionId: '1'
    }]);

    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', 1);

    expect(cart.length).toEqual(1);

    // we have to mock the setItem method first using (spyOn).
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify(cart));

    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(2);
  });

  it('adds a new product to the cart', () => {
    mockLocalStorage([]);

    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', 1);
    expect(cart.length).toEqual(1);

    // we have to mock the setItem method first using (spyOn).
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify(cart));

    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(1);
  });
});

describe('test suite: removeFromCart', () => {
  beforeEach(() => {
    mockLocalStorage([{
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 2,
      deliveryOptionId: '1'
    }]);
  });

  it('removes an existing product from the cart', () => {
    removeFromCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');

    expect(cart.length).toEqual(0);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([]));
  });

  it('removes a product that is not in the cart', () => {
    removeFromCart('does-not-exist');

    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(2);
    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
  });
});

describe('test suite: cartCalculations', () => {

  beforeEach(() => {
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
    mockLocalStorage(defaultCartValues);
  });

  it('calculates cart quantity', () => {
    expect(calculateCartQuantity()).toEqual(3);
  });

  it('calculates total product price in cents', () => {
    expect(calculateTotalProductPriceCents()).toEqual(4275);
  });

  it('calculates total shipping price in cents', () => {
    expect(calculateTotalShippingPriceCents()).toEqual(499);
  });
});