import { Product } from './product.js';

export class Appliance extends Product {
  instructionsLink;
  warrantyLink;

  constructor(productDetails) {
    if (!productDetails) {
      return;
    }

    super(productDetails);

    this.instructionsLink = productDetails.instructionsLink;
    this.warrantyLink = productDetails.warrantyLink;
  }

  extraInfoHTML() {
    return `
    <a href="${this.instructionsLink}" target="_blank">
      Instructions
    </a>

    <a href="${this.warrantyLink}" target="_blank">
      Warranty
    </a>
    `;
  }
}