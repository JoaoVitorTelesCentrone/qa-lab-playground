describe("Catálogo da loja", () => {
  it("encontra um produto pelo nome", () => {
    cy.visit("/shop/products");
    cy.get('[data-testid="product-search"]').type("Kit Smoke Test");
    cy.contains("Kit Smoke Test").should("be.visible");
  });

  it("explica quando a busca não encontra produtos", () => {
    cy.visit("/shop/products");
    cy.get('[data-testid="product-search"]').type("produto inexistente");
    cy.get('[role="status"]')
      .should("contain.text", "Nenhum produto encontrado");
  });
});

describe("Carrinho da loja", () => {
  beforeEach(() => {
    cy.clearShopCart();
  });

  it("adiciona um produto e mostra a quantidade", () => {
    cy.get('[data-testid="add-product-1"]').click();
    cy.get('a[href="/shop/cart"]').click();
    cy.get('[data-testid="qty-1"]').should("have.text", "1");
    cy.get('[data-testid="cart-subtotal"]').should("contain.text", "89,90");
  });
});
