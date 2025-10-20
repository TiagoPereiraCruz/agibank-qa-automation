# Teste Técnico QA - Agibank

Este repositório contém a automação de testes Web e API para o processo seletivo da Agibank.

## 📁 Estrutura do Projeto

```
agibank/
├── WEB/              # Testes E2E do Blog do Agi (Playwright)
├── API/              # Testes de API (em desenvolvimento)
└── .github/
    └── workflows/    # Pipelines de CI/CD
```

## 🌐 WEB - Testes E2E

Automação da funcionalidade de pesquisa do [Blog do Agi](https://blog.agibank.com.br/).

**Tecnologias:** Playwright + TypeScript

**Cenários cobertos:**
- ✅ Pesquisa válida retorna resultados
- ✅ Pesquisa inválida exibe mensagem apropriada
- ✅ Navegação para o primeiro resultado da pesquisa

[📖 Documentação completa do projeto WEB](./WEB/README.md)

## 🔌 API - Testes de Integração

Validação dos endpoints da [Dog CEO API](https://dog.ceo/dog-api/) para aplicação de amantes de cães.

**Tecnologias:** Playwright + TypeScript

**Endpoints testados:**
- ✅ GET /breeds/list/all - Lista todas as raças (5 cenários)
- ✅ GET /breed/{breed}/images - Imagens por raça (6 cenários)
- ✅ GET /breeds/image/random - Imagem aleatória (6 cenários)

**Total:** 17 testes cobrindo cenários positivos, negativos e validações de schema.

[📖 Documentação completa do projeto API](./API/README.md)

## 🔧 Pré-requisitos

- Node.js 18+ (LTS recomendado)
- Git

## 🚀 Execução Rápida

### WEB
```bash
cd WEB
npm install
npm run install:browsers
npm test
```

### API
```bash
cd API
npm install
npm test
```

## 📊 CI/CD

Os testes são executados automaticamente via **GitHub Actions** em:
- Push para `main`/`master`
- Pull Requests
- Execução manual (workflow_dispatch)

Os relatórios ficam disponíveis como artefatos por 30 dias.

## 👨‍💻 Autor

Desenvolvido para o processo seletivo QA da Agibank.

## 📝 Notas

- Código comentado em português brasileiro
- Seguindo padrão Page Object Model
- Testes resilientes com fallbacks para variações de UI
- Execução cross-platform (Windows/Linux/macOS)
