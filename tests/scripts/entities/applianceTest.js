import { Appliance } from "../../../scripts/entities/appliance.js";

describe("test suite: check clothing class", () => {
  let appliance;

  beforeEach(() => {
    appliance = new Appliance({
      id: "54e0eccd-8f36-462b-b68a-8182611d9add",
      image: "images/products/black-2-slot-toaster.jpg",
      name: "2 Slot Toaster - Black",
      rating: {
        stars: 5,
        count: 2197,
      },
      priceCents: 1899,
      keywords: ["toaster", "kitchen", "appliances"],
      type: "appliance",
      instructionsLink: "images/appliance-instructions.png",
      warrantyLink: "images/appliance-warranty.png",
    });
  });

  it("has the correct properties", () => {
    expect(appliance.id).toEqual("54e0eccd-8f36-462b-b68a-8182611d9add");
    expect(appliance.image).toEqual("images/products/black-2-slot-toaster.jpg");
    expect(appliance.instructionsLink).toEqual(
      "images/appliance-instructions.png"
    );
    expect(appliance.warrantyLink).toEqual("images/appliance-warranty.png");
  });

  it("gets the stars url", () => {
    expect(appliance.getStarsUrl()).toEqual("images/ratings/rating-50.png");
  });

  it("gets the price", () => {
    expect(appliance.getPrice()).toEqual("$18.99");
  });

  it("displays instructions and warranty in extraInfoHTML", () => {
    expect(appliance.extraInfoHTML()).toContain(
      `${appliance.instructionsLink}`
    );
    expect(appliance.extraInfoHTML()).toContain("Instructions");
    expect(appliance.extraInfoHTML()).toContain(`${appliance.warrantyLink}`);
    expect(appliance.extraInfoHTML()).toContain("Warranty");
  });
});
