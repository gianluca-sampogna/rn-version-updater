# rn-version-updater
Este script atualiza automaticamente a versão do app no Android, iOS, package.json com base no seu .env. Uma solução simples, sem dependências externas, feita para otimizar o tempo, evitar erros manuais e manter o versionamento consistente nos builds.


## 📦 Sobre
Este projeto é um script de automação para atualização de versões em projetos mobile (React Native), eliminando tarefas manuais e o risco de inconsistências entre Android, iOS e arquivos de configuração. Com base na variável VERSAO_APP presente no arquivo .env, ele atualiza:

📱 Android: versão (versionName) e build (versionCode)

🍎 iOS: versão (CFBundleShortVersionString) e build (CFBundleVersion)

📦 package.json: version

🗂️ Arquivos .env ou outros conforme configuração

## 🚀 Funcionalidades

Atualização automatizada de versão e build.

Geração de build único para Android com base em timestamp.

Build incremental para iOS enquanto mantém a mesma versão.

Permite atualizar Android, iOS ou ambos de forma independente.

Sem dependências externas — 100% script personalizado.


## 🚀 Como usar

### 1 - **Atualize a versão no arquivo `.env`**

Adicione ou edite a variável `VERSAO_APP` no seu arquivo `.env` com a versão desejada:

```env
VERSAO_APP=3.0.3
```

### 2 - **Ajuste o código**

Coloque o arquivo do script no seguinte caminho dentro da raiz do seu projeto:


```
/scripts/aqui
```

### 4 - **Configure o packege.json**

Adicione as seguintes linhas na parte de scripts do seu packege.json

```
  "scripts": {
    "update:version": "node scripts/update-version.js",
    "update:version:android": "node scripts/update-version.js --android",
    "update:version:ios": "node scripts/update-version.js --ios"
  },
```

### 5 - **Execute o script**

Execute um dos comandos abaixo, de acordo com sua necessidade:

| Comando                          | Descrição                                          |
| -------------------------------- | -------------------------------------------------- |
| `npm run update:version`         | Atualiza a versão do Android, iOS e `package.json` |
| `npm run update:version:android` | Atualiza apenas a versão e build do Android        |
| `npm run update:version:ios`     | Atualiza apenas a versão e build do iOS            |

### 🔧 **O que o script faz?**

* Atualiza a versão (`versionName`) e build (`versionCode`) no Android (`build.gradle`).
* Atualiza a versão (`CFBundleShortVersionString`) e build (`CFBundleVersion`) no iOS (`Info.plist`).
* Atualiza a versão no `package.json`.
* Garante que a variável `VERSAO_APP` no `.env` reflita a mesma versão do app.

### 🏗️ **Regras de Build:**

* **Android:** o `versionCode` é gerado automaticamente com base no timestamp, garantindo unicidade em cada build.
* **iOS:** o `CFBundleVersion` (build) é incremental dentro da mesma versão. Ao alterar a versão (`VERSAO_APP`), o contador de build reinicia.

---
