import { describe, expect, test } from "bun:test";
import { normalizeCart, orderReference, priceCart, priceLines, taxRate } from "./shop";

const products = [
  { id: 1, name: "Caderno Bug Report", price: 60 },
  { id: 2, name: "Camiseta QA", price: 90 },
  { id: 9, name: "Caneca", price: 40 },
];

const lines = priceLines([{ productId: 1, quantity: 2 }, { productId: 2, quantity: 1 }], products);

describe("carrinho da loja", () => {
  test("junta carrinho e catálogo e calcula o total da linha", () => {
    expect(lines).toHaveLength(2);
    expect(lines[0].total).toBe(120);
    expect(lines[0].name).toBe("Caderno Bug Report");
  });

  test("produto fora do catálogo é descartado em vez de quebrar o preço", () => {
    expect(priceLines([{ productId: 404, quantity: 1 }], products)).toEqual([]);
  });

  test("normaliza quantidade inválida e soma o produto repetido", () => {
    expect(normalizeCart([{ productId: 1, quantity: 2 }, { productId: 1, quantity: 3 }])).toEqual([{ productId: 1, quantity: 5 }]);
    expect(normalizeCart([{ productId: 1, quantity: 0 }, { productId: 2, quantity: -1 }, { productId: 3, quantity: 1.7 }])).toEqual([{ productId: 3, quantity: 1 }]);
    expect(normalizeCart("nada")).toEqual([]);
  });

  test("limita a quantidade por produto", () => {
    expect(normalizeCart([{ productId: 1, quantity: 500 }])).toEqual([{ productId: 1, quantity: 99 }]);
  });
});

describe("preço do pedido", () => {
  test("sem cupom cobra frete abaixo do mínimo e imposto sobre o subtotal", () => {
    const pricing = priceCart(priceLines([{ productId: 9, quantity: 1 }], products), {});
    expect(pricing.subtotal).toBe(40);
    expect(pricing.discount).toBe(0);
    expect(pricing.shipping).toBe(19.9);
    expect(pricing.tax).toBe(3.2);
    expect(pricing.total).toBe(63.1);
  });

  test("cupom QA10 desconta 10% e o imposto incide sobre o valor com desconto", () => {
    const pricing = priceCart(lines, { coupon: "qa10" });
    expect(pricing.subtotal).toBe(210);
    expect(pricing.discount).toBe(21);
    expect(pricing.tax).toBe(Math.round(189 * taxRate * 100) / 100);
    // R$ 189,00 + R$ 19,90 de frete (o desconto derrubou o pedido abaixo do
    // mínimo para frete grátis) + R$ 15,12 de imposto.
    expect(pricing.total).toBe(224.02);
  });

  test("frete é grátis a partir do mínimo, considerando o desconto", () => {
    expect(priceCart(lines, {}).shipping).toBe(0);
    // Com o cupom, o valor cai para R$ 189,00 e o frete volta a ser cobrado.
    expect(priceCart(lines, { coupon: "QA10" }).shipping).toBe(19.9);
  });

  test("entrega expressa custa mais que a padrão", () => {
    const cheap = priceLines([{ productId: 9, quantity: 1 }], products);
    expect(priceCart(cheap, { delivery: "expressa" }).shipping).toBe(34.9);
  });

  test("cupom inválido não desconta nada", () => {
    expect(priceCart(lines, { coupon: "NAOEXISTE" }).discount).toBe(0);
  });

  test("carrinho vazio zera tudo", () => {
    expect(priceCart([], {})).toEqual({ subtotal: 0, discount: 0, shipping: 0, tax: 0, total: 0 });
  });

  test("o desvio plantado cobra imposto sobre o valor sem desconto", () => {
    const sane = priceCart(lines, { coupon: "QA10" });
    const bugged = priceCart(lines, { coupon: "QA10" }, ["qa-lab.wrong-total"]);
    expect(bugged.discount).toBe(sane.discount);
    // A diferença é exatamente o imposto sobre o desconto: o resumo mostra o
    // desconto certo e o total cobrado fica maior.
    expect(Math.round((bugged.total - sane.total) * 100) / 100).toBe(Math.round(sane.discount * taxRate * 100) / 100);
  });

  test("sem cupom o desvio não muda nada — ele só aparece com desconto", () => {
    expect(priceCart(lines, {}, ["qa-lab.wrong-total"])).toEqual(priceCart(lines, {}));
  });
});

describe("referência do pedido", () => {
  test("usa o formato QL- com seis dígitos", () => {
    expect(orderReference(1)).toBe("QL-000001");
    expect(orderReference(1234)).toBe("QL-001234");
  });
});
