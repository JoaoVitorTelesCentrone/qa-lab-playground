import assert from "node:assert/strict";
import { Given, When, Then } from "@cucumber/cucumber";

Given("que não existe uma sessão autenticada", function () {
  this.baseUrl = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
});

When("consulto o carrinho da loja", async function () {
  this.response = await fetch(`${this.baseUrl}/api/v1/shop/cart`, {
    method: "GET",
    headers: { accept: "application/json" },
  });
});

Then("o sistema responde com status {int}", function (status) {
  assert.equal(this.response.status, status);
});

Then("a resposta é JSON", function () {
  assert.match(this.response.headers.get("content-type") || "", /application\/json/i);
});
