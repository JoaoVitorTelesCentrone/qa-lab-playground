import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Módulos legados mantidos apenas como referência; as rotas públicas são
    // redirecionadas em next.config.ts e não fazem parte do produto publicado.
    "app/alvos/**",
    "app/cenarios/**",
    "app/desafios/**",
    "app/elementos/**",
    "app/pdca/**",
    "app/proximos-passos/**",
    "app/waitlist/**",
    "components/api-runner/**",
    "components/layout/**",
    "components/onboarding/**",
    "components/pdca/**",
    "hooks/use-mission-progress.ts",
  ]),
]);

export default eslintConfig;
