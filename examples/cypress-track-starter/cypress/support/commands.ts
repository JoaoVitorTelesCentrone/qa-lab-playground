// Adicione comandos pequenos quando a mesma ação aparecer em vários cenários.
// Evite esconder o comportamento principal do teste dentro de um comando amplo.

declare global {
  namespace Cypress {
    interface Chainable {
      clearShopCart(): Chainable<Window>;
    }
  }
}

Cypress.Commands.add("clearShopCart", () => {
  cy.visit("/shop/products", {
    onBeforeLoad(win) {
      win.localStorage.removeItem("qa-lab-cart");
    },
  });
});

export {};
