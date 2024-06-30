import { renderOrderSummary } from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';
import { renderCheckoutHeader } from './checkout/checkoutHeader.js';

export default function renderCheckout() {
  renderOrderSummary();
  renderPaymentSummary();
  renderCheckoutHeader();
}

renderCheckout();