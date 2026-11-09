import { describe, expect, test } from "bun:test";
import {
  checkContract, createHttpSession, generateRecords, meetsLoadGoals, nextState, probeSecurity,
  responseForStarter, runSafeQuery, sendHttp, simulateLoad, validResponse, validateRecords,
} from "./qa-tool-engine";
import { qaToolLabSpecs } from "./qa-tool-labs";

const failedPaths = (input: unknown) => checkContract(input).filter((check) => !check.ok).map((check) => check.path);

describe("SQL Explorer", () => {
  test("o starter de cada Lab de SQL é uma consulta aceita", () => {
    for (const lab of qaToolLabSpecs.filter((item) => item.toolId === "sql")) {
      expect(runSafeQuery(lab.starter).error).toBeUndefined();
    }
  });

  test("encontra o total negativo, o pago zerado e o ID duplicado", () => {
    expect(runSafeQuery("SELECT id FROM orders WHERE total < 0").rows).toEqual([{ id: "QL-1046" }]);
    expect(runSafeQuery("SELECT id, total FROM orders WHERE status = 'paid' ORDER BY total ASC").rows[0]).toEqual({ id: "QL-1049", total: 0 });
    expect(runSafeQuery("SELECT id, status FROM orders WHERE id = 'QL-1050'").rows).toHaveLength(2);
  });

  test("recusa escrita e colunas fora da tabela", () => {
    expect(runSafeQuery("DELETE FROM orders").error).toBeDefined();
    expect(runSafeQuery("SELECT id FROM orders; DROP TABLE orders").error).toBeDefined();
    expect(runSafeQuery("SELECT password FROM orders").error).toContain("Coluna desconhecida");
  });

  test("ordena números como números e respeita o limite", () => {
    const rows = runSafeQuery("SELECT total FROM orders ORDER BY total DESC LIMIT 2").rows;
    expect(rows).toEqual([{ total: 1299 }, { total: 720 }]);
  });
});

describe("Contract Inspector", () => {
  test("a resposta válida passa em todas as regras", () => {
    expect(failedPaths(validResponse)).toEqual([]);
  });

  test("cada starter produz a falha que o Lab pede para encontrar", () => {
    // Lab 411: o status em texto não pode esconder o total em texto.
    expect(failedPaths(responseForStarter("tipos"))).toEqual(["status", "data.total", "data.items[0].quantity"]);
    expect(failedPaths(responseForStarter("id-ausente"))).toEqual(["data.id"]);
    expect(failedPaths(responseForStarter("lista-vazia"))).toEqual([]);
    expect(failedPaths(responseForStarter("segundo-item"))).toEqual(["data.items[1].quantity"]);
    expect(failedPaths(responseForStarter("quantidade-negativa"))).toEqual(["data.items[0].quantity"]);
    expect(failedPaths(responseForStarter("erro-422"))).toEqual([]);
  });

  test("ausente e tipo errado são relatados de forma diferente", () => {
    const missing = checkContract(responseForStarter("id-ausente")).find((check) => check.path === "data.id");
    const wrongType = checkContract(responseForStarter("id-nulo")).find((check) => check.path === "data.id");
    expect(missing?.actual).toBe("ausente");
    expect(wrongType?.actual).toBe("null");
  });

  test("um 422 com corpo de sucesso não passa como erro válido", () => {
    expect(failedPaths({ status: 422, data: validResponse.data })).toEqual(["error", "error.code", "error.message", "data"]);
  });
});

describe("HTTP Request Runner", () => {
  test("sem token não expõe pedidos", () => {
    const response = sendHttp(createHttpSession(), "GET", "/orders", "", "", "");
    expect(response.status).toBe(401);
    expect(JSON.stringify(response.body)).not.toContain("ord_");
  });

  test("404 para pedido inexistente com credencial válida", () => {
    expect(sendHttp(createHttpSession(), "GET", "/orders/ord_9999", "qa-token", "", "").status).toBe(404);
  });

  test("quantidade zero é 422 e positiva cria o pedido", () => {
    const session = createHttpSession();
    expect(sendHttp(session, "POST", "/orders", "qa-token", '{"product":"Caderno","quantity":0}', "").status).toBe(422);
    const created = sendHttp(session, "POST", "/orders", "qa-token", '{"product":"Caderno","quantity":2}', "");
    expect(created.status).toBe(201);
    expect(sendHttp(session, "GET", `/orders/${(created.body as { id: string }).id}`, "qa-token", "", "").status).toBe(200);
  });

  test("repetir a mesma chave devolve a criação anterior em vez de duplicar", () => {
    const session = createHttpSession();
    const first = sendHttp(session, "POST", "/orders", "qa-token", '{"product":"Caderno","quantity":2}', "used-key");
    const replay = sendHttp(session, "POST", "/orders", "qa-token", '{"product":"Caderno","quantity":2}', "used-key");
    expect(replay.status).toBe(200);
    expect((replay.body as { id: string }).id).toBe((first.body as { id: string }).id);
    expect(session.createdOrders).toHaveLength(1);
    expect(sendHttp(session, "POST", "/orders", "qa-token", '{"product":"Caderno","quantity":2}', "new-key").status).toBe(201);
  });

  test("PATCH direto para entregue é conflito", () => {
    expect(sendHttp(createHttpSession(), "PATCH", "/orders/ord_1042", "qa-token", '{"status":"delivered"}', "").status).toBe(409);
  });
});

describe("Load Profile Bench", () => {
  test("a linha de base atende às metas e o pico viola", () => {
    expect(meetsLoadGoals(simulateLoad("normal", 20, 30))).toBe(true);
    expect(meetsLoadGoals(simulateLoad("spike", 120, 30))).toBe(false);
  });

  test("com a mesma carga, a dependência degradada piora o p95", () => {
    expect(simulateLoad("degraded", 60, 30).p95).toBeGreaterThan(simulateLoad("normal", 60, 30).p95);
  });

  test("existe um ponto de saturação entre 20 e 120 usuários no perfil normal", () => {
    expect(meetsLoadGoals(simulateLoad("normal", 20, 30))).toBe(true);
    expect(meetsLoadGoals(simulateLoad("normal", 120, 30))).toBe(false);
  });

  test("é determinístico", () => {
    expect(simulateLoad("degraded", 60, 30)).toEqual(simulateLoad("degraded", 60, 30));
  });
});

describe("Security Probe", () => {
  test("injeção é recusada e termo comum passa", () => {
    expect(probeSecurity("injection", "' OR 1=1 --", "user_108", 1).status).toBe(400);
    expect(probeSecurity("injection", "caderno", "user_108", 1).status).toBe(200);
  });

  test("marcação é escapada", () => {
    expect(probeSecurity("xss", "<script>alert(1)</script>", "user_108", 1).evidence).not.toContain("<script>");
  });

  test("só o dono acessa o pedido", () => {
    expect(probeSecurity("idor", "ord_1042", "user_108", 1).status).toBe(200);
    expect(probeSecurity("idor", "ord_1042", "user_221", 1).status).toBe(403);
  });

  test("a sexta tentativa na janela é bloqueada", () => {
    expect(probeSecurity("rate", "", "user_108", 5).status).toBe(200);
    expect(probeSecurity("rate", "", "user_108", 6).status).toBe(429);
  });
});

describe("Test Data Factory", () => {
  test("mesma configuração gera a mesma massa, e a massa válida passa", () => {
    expect(generateRecords("valid", 42, 4)).toEqual(generateRecords("valid", 42, 4));
    expect(validateRecords(generateRecords("valid", 42, 4))).toEqual([]);
  });

  test("limite inclusivo: só 18 e 120 passam", () => {
    expect(validateRecords(generateRecords("boundary", 42, 4))).toEqual(["qa-42-1: idade fora de 18–120", "qa-42-4: idade fora de 18–120"]);
  });

  test("aponta a linha exata do e-mail inválido e do duplicado", () => {
    expect(validateRecords(generateRecords("invalid-email", 42, 4))).toEqual(["qa-42-2: e-mail inválido"]);
    expect(validateRecords(generateRecords("duplicate", 42, 4))).toEqual(["qa-42-2: e-mail duplicado"]);
  });

  test("ausência é relatada separada de formato e de faixa", () => {
    expect(validateRecords(generateRecords("missing", 42, 4))).toEqual(["qa-42-1: e-mail ausente", "qa-42-1: idade ausente"]);
  });
});

describe("State Machine Explorer", () => {
  test("o caminho válido chega a delivered", () => {
    let state = nextState("created", "pay");
    state = state && nextState(state, "ship");
    state = state && nextState(state, "deliver");
    expect(state).toBe("delivered");
  });

  test("transições fora do fluxo são rejeitadas", () => {
    expect(nextState("created", "deliver")).toBeNull();
    expect(nextState("cancelled", "pay")).toBeNull();
    expect(nextState("refunded", "ship")).toBeNull();
    expect(nextState("paid", "pay")).toBeNull();
  });
});
