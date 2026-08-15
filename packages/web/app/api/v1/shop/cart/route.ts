import { fail, ok, readJson, withUser } from "@/lib/product/api";
import { getCart, saveCart } from "@/lib/product/practice/shop-store";
import { shopProducts } from "@/lib/playground/shop-data";
import { priceCart, priceLines } from "@/lib/product/practice/shop";
import { getSettings, PracticeError } from "@/lib/product/practice/store";

export const dynamic = "force-dynamic";

// GET /api/v1/shop/cart — itens do carrinho já com preço calculado.
export function GET() {
  return withUser(async (user) => {
    const [items, settings] = await Promise.all([getCart(user.id), getSettings(user.id)]);
    const lines = priceLines(items, shopProducts);
    // `activeBugs` vai junto porque carrinho e checkout recalculam o preço na
    // tela com a mesma função pura do servidor — sem isso, a tela mostraria o
    // valor são enquanto a cobrança usa o desviado, e o cenário viraria ruído.
    return ok({ items, lines, activeBugs: settings.activeBugs, pricing: priceCart(lines, {}, settings.activeBugs) });
  });
}

// PUT /api/v1/shop/cart { items } — substitui o carrinho inteiro.
//
// Substituir em vez de aplicar diferença é o que mantém o carrinho previsível
// com duas abas abertas: quem salva por último manda, sem soma silenciosa.
export async function PUT(request: Request) {
  const body = await readJson(request);
  return withUser(async (user) => {
    try {
      const items = await saveCart(user.id, body.items);
      const lines = priceLines(items, shopProducts);
      const settings = await getSettings(user.id);
      return ok({ items, lines, pricing: priceCart(lines, {}, settings.activeBugs) });
    } catch (error) {
      if (error instanceof PracticeError) return fail(error.message, error.status, error.details);
      throw error;
    }
  });
}
