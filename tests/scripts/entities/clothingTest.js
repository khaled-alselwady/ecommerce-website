import { Clothing } from "../../../scripts/data/clothing.js";

describe("test suite: check clothing class", () => {
  let clothing;
  beforeEach(() => {
    clothing = new Clothing({
      id: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e",
      image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
      name: "Adults Plain Cotton T-Shirt - 2 Pack",
      rating: {
        stars: 4.5,
        count: 56,
      },
      priceCents: 799,
      keywords: ["tshirts", "apparel", "mens"],
      type: "clothing",
      sizeChartLink: "images/clothing-size-chart.png",
    });
  });

  it("has the correct properties", () => {
    // Check if inheritance worked correctly.
    expect(clothing.id).toEqual("83d4ca15-0f35-48f5-b7a3-1ea210004f2e");
    expect(clothing.image).toEqual(
      "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg"
    );
    expect(clothing.sizeChartLink).toEqual("images/clothing-size-chart.png");
  });

  it("gets the stars url", () => {
    expect(clothing.getStarsUrl()).toEqual("images/ratings/rating-45.png");
  });

  it("gets the price", () => {
    expect(clothing.getPrice()).toEqual("$7.99");
  });

  it("displays a size chart link in extraInfoHTML", () => {
    expect(clothing.extraInfoHTML()).toContain(`${clothing.sizeChartLink}`);
    expect(clothing.extraInfoHTML()).toContain("Size chart");
  });
});
