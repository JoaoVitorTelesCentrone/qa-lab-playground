// Carregamento de um ambiente de prática para o Server Component da página.
//
// Um único ponto para as três páginas: resolve a sessão, garante a massa
// inicial na primeira visita e devolve as linhas já lidas. Deslogado, devolve a
// mesma massa com ids locais — o ambiente abre e funciona, só não persiste.

import { findPracticeApp, type PracticeAppId } from "../apps";
import { getSessionUser } from "../store";
import { localSeed } from "./seed";
import { defaultSettings, ensureSeeded, loadApp, type PracticeRows, type PracticeSettings } from "./store";

export type PracticeEnvironment = {
  rows: PracticeRows;
  settings: PracticeSettings;
  signedIn: boolean;
};

export async function loadPracticeEnvironment(appId: PracticeAppId): Promise<PracticeEnvironment> {
  const app = findPracticeApp(appId);
  if (!app) throw new Error(`Ambiente desconhecido: ${appId}`);

  const user = await getSessionUser();
  if (!user) return { rows: localSeed(appId), settings: defaultSettings, signedIn: false };

  const settings = await ensureSeeded(user.id, [appId]);
  return { rows: await loadApp(user.id, appId), settings, signedIn: true };
}
