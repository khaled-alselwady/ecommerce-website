import { cart } from "../entities/cart.js";
import { formatCurrency } from "../utils/money.js";

function renderPaymentSummaryHTML() {
  const totalProductPriceCents = cart.calculateTotalProductPriceCents();
  const totalShippingPriceCents = cart.calculateTotalShippingPriceCents();
  const totalBeforeTaxCents = totalProductPriceCents + totalShippingPriceCents;
  const estimatedTaxCents = Math.round(totalBeforeTaxCents * 0.1);
  const orderTotalCents = totalBeforeTaxCents + estimatedTaxCents;

  const html = `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${cart.calculateCartQuantity()}):</div>
      <div class="payment-summary-money">$${formatCurrency(
        totalProductPriceCents
      )}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money js-total-shipping-price-cents">$${formatCurrency(
        totalShippingPriceCents
      )}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurrency(
        totalBeforeTaxCents
      )}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurrency(
        estimatedTaxCents
      )}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money js-order-total-price-cent">$${formatCurrency(
        orderTotalCents
      )}</div>
    </div>

    <button class="place-order-button button-primary">
      Place your order
    </button>`;

  return html;
}

function displayPaymentSummary() {
  const paymentSummaryElement = document.querySelector(".js-payment-summary");

  if (!paymentSummaryElement) {
    return;
  }

  paymentSummaryElement.innerHTML = renderPaymentSummaryHTML(cart);
}

export function renderPaymentSummary() {
  displayPaymentSummary();
}
