# Testes de API - Dog CEO

Testes automatizados da [Dog CEO API](https://dog.ceo/dog-api/) usando Playwright + TypeScript.

## 🎯 Objetivo

Validar a integração com a Dog CEO API para garantir que a aplicação de amantes de cães funcione corretamente ao buscar imagens e informações sobre raças.

## 📋 Endpoints Testados

### 1. GET /breeds/list/all
Lista todas as raças disponíveis com suas sub-raças.

**Cenários cobertos:**
- ✅ Retorna status success
- ✅ Formato do objeto de raças está correto
- ✅ Raças conhecidas estão presentes
- ✅ Sub-raças são retornadas quando existem
- ✅ Array vazio para raças sem sub-raças
- ✅ Content-Type é application/json

### 2. GET /breed/{breed}/images
Retorna todas as imagens de uma raça específica.

**Cenários cobertos:**
- ✅ Retorna imagens para raça válida
- ✅ Retorna imagens para sub-raça
- ✅ Erro 404 para raça inexistente
- ✅ Erro 404 para sub-raça inexistente
- ✅ URLs das imagens estão acessíveis
- ✅ Content-Type é application/json

### 3. GET /breeds/image/random
Retorna uma ou mais imagens aleatórias.

**Cenários cobertos:**
- ✅ Retorna uma imagem aleatória válida
- ✅ URLs diferentes em requisições consecutivas
- ✅ Suporte ao parâmetro count para múltiplas imagens
- ✅ URL retornada está acessível
- ✅ Retorna raças variadas ao longo do tempo
- ✅ Content-Type é application/json

## 🔧 Pré-requisitos

- Node.js 18+ (LTS recomendado)
- npm ou yarn

## 🚀 Como Executar

### 1. Instalar dependências
```bash
cd API
npm install
```

### 2. Executar os testes
```bash
npm test
```

### 3. Ver o relatório HTML
```bash
npm run show-report
```

### Modo debug
```bash
npm run test:debug
```

## 📊 Relatório de Resultados

Após a execução, o Playwright gera automaticamente:

1. **Relatório HTML** (`playwright-report/index.html`)
   - Visão geral de todos os testes
   - Detalhes de cada teste (tempo, status)
   - Informações de falhas com stack trace
   - Screenshots e traces em caso de erro

2. **Relatório JSON** (`test-results/results.json`)
   - Formato estruturado para integração com outras ferramentas
   - Contém métricas detalhadas de execução

Para abrir o relatório HTML:
```bash
npm run show-report
```

## 📁 Estrutura do Projeto

```
API/
├── playwright.config.ts    # Configuração do Playwright
├── package.json            # Dependências e scripts
├── tsconfig.json          # Configuração TypeScript
├── src/
│   └── helpers/
│       └── apiHelpers.ts  # Helpers para validações
└── tests/
    ├── breeds-list.spec.ts    # Testes de listagem de raças
    ├── breed-images.spec.ts   # Testes de imagens por raça
    └── random-image.spec.ts   # Testes de imagem aleatória
```

## 🧪 Boas Práticas Implementadas

- ✅ **Separação de responsabilidades**: helpers reutilizáveis
- ✅ **Testes independentes**: cada teste pode rodar isoladamente
- ✅ **Validações robustas**: schema, formato de URLs, content-type
- ✅ **Cenários negativos**: testes de erro 404
- ✅ **Testes de integração**: verifica se URLs retornadas funcionam
- ✅ **Comentários em PT-BR**: código bem documentado
- ✅ **Retry automático**: 2 tentativas em caso de falha no CI
- ✅ **Execução paralela**: testes rodam simultaneamente

## 📊 CI/CD (GitHub Actions)

Os testes rodam automaticamente no GitHub Actions quando há alterações na pasta `API/`.

**Workflow:** `.github/workflows/api-tests.yml`

**Quando executa:**
- Push ou Pull Request para `main`/`master`
- Manualmente via interface do GitHub

**O que faz:**
- Instala dependências
- Executa todos os testes
- Gera relatórios HTML e JSON
- Faz upload dos artefatos (disponíveis por 30 dias)

## 🔍 Troubleshooting

### Testes falhando por timeout
A Dog CEO API é gratuita e pode estar lenta. O timeout está configurado para 30s, mas é possível aumentar no `playwright.config.ts`:
```typescript
timeout: 60_000, // 60 segundos
```

### Erros de tipo no TypeScript
Certifique-se de que as dependências estão instaladas:
```bash
npm install
```

### Relatório não abre
Execute manualmente:
```bash
npx playwright show-report
```

## 📖 Documentação da API

- [Dog CEO API Docs](https://dog.ceo/dog-api/documentation)
- [Playground da API](https://dog.ceo/api/breeds/list/all)

## 🌐 Endpoints Base

Todas as requisições usam a base URL: `https://dog.ceo/api`

## ✅ Status dos Testes

| Suite | Testes | Status |
|-------|--------|--------|
| Lista de Raças | 5 | ✅ |
| Imagens por Raça | 6 | ✅ |
| Imagem Aleatória | 6 | ✅ |
| **Total** | **17** | **✅** |

---

**Nota:** Todos os testes são executáveis em Windows, Linux e macOS.
