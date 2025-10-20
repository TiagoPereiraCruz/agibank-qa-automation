# Testes Web – Blog do Agi (Playwright)

Este projeto implementa cenários E2E do Blog do Agi com Playwright (TypeScript).

## Cenários cobertos
- Pesquisa válida retorna resultados
- Pesquisa inválida exibe mensagem de nenhum resultado
- Abrir o primeiro resultado após a pesquisa

## Requisitos
- Node.js 18+ (LTS)
- Navegadores Playwright (instalados via script)

## Como executar (Windows/Linux/macOS)

1. Instale as dependências:
```powershell
npm install
```

2. Instale os navegadores do Playwright (apenas 1ª vez):
```powershell
npm run install:browsers
```

3. Rode os testes:
```powershell
npm test
```

4. Abrir o relatório após a execução:
```powershell
npm run show-report
```

### Modo interativo
```powershell
npm run test:headed
```

## Estrutura
- `playwright.config.ts` – configuração de projetos/browsers, baseURL e reporter
- `src/pages` – Page Objects (HomePage, SearchResultsPage)
- `tests/e2e` – testes E2E da pesquisa

## CI (GitHub Actions)

O workflow está em `.github/workflows/web-tests.yml` na raiz do repositório.

**Quando executa:**
- Push ou Pull Request nas branches `main` ou `master` que alterem arquivos em `WEB/`
- Manualmente via `workflow_dispatch` na interface do GitHub Actions

**O que faz:**
- Roda em Ubuntu com Node.js 18
- Instala dependências e navegador Chromium
- Executa todos os testes (`npm test`)
- Faz upload do relatório HTML como artefato (disponível por 30 dias)
- Em caso de falha, faz upload de screenshots e vídeos (7 dias)

**Configuração:**
- No CI, roda apenas Chromium (mais rápido). 
- Localmente você pode testar com Firefox e WebKit descomentando no `playwright.config.ts`.

**Para visualizar o relatório no CI:**
1. Acesse a aba "Actions" do repositório
2. Clique no workflow executado
3. Baixe o artefato "playwright-report"
4. Extraia e abra `index.html` no navegador

## Notas de estabilidade
O Blog usa WordPress e pode variar o HTML/CSS. Os seletores foram escritos com fallback. Se algo mudar, use `npm run codegen` para inspecionar e ajustar os seletores.

## Troubleshooting
- Se aparecer erro de tipos do Node, rode `npm install` para instalar `@types/node` que vem como dependência transitiva de dev tools ou adicione manualmente: `npm i -D @types/node`.
- Se os navegadores não abrirem em CI, verifique permissões e use `npx playwright install --with-deps`.