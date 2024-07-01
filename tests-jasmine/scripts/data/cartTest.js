import { addToCart, cart, loadFromStorage } from '../../../scripts/data/cart.js';

function mockLocalStorage(getItemReturnValue) {
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

    // we have to mock the setItem method first using (speOn).
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);

    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(2);
  });

  it('adds a new product to the cart', () => {
    mockLocalStorage([]);

    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', 1);
    expect(cart.length).toEqual(1);

    // we have to mock the setItem method first using (speOn).
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);

    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(1);
  });
});