describe("Persistência do carrinho", () => {
  it("envia os itens ao servidor quando o carrinho remoto está disponível", () => {
    cy.intercept("GET", "/api/v1/shop/cart", {
      statusCode: 200,
      body: { data: { items: [], activeBugs: [] } },
    }).as("loadCart");
    cy.intercept("PUT", "/api/v1/shop/cart").as("saveCart");

    cy.visit("/shop/products");
    cy.wait("@loadCart");
    cy.get('[data-testid="add-product-1"]').click();

    cy.wait("@saveCart").its("request.body.items")
      .should("deep.include", { productId: 1, quantity: 1 });
  });
});
