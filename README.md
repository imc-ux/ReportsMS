<h1 align="center">Report MS on Nuxt</h1>

> Construction

[![nuxt v3.8.2](https://img.shields.io/badge/nuxt-v3.8.2-00DC82.svg)](https://nuxt.com/)

> Component

[![element-plus v2.4.3](https://img.shields.io/badge/element--plus-v2.4.3-409EFF.svg)](https://element-plus.org/)

## Introduction

此 Nuxt3 项目用于开发 UX 系统 jtrac(互动)目录下 消息管理、模板管理页面。

## Table of Contents

- [Technologies](#technologies)
- [Code Formatter](#code-formatter)
- [Development](#development)
  - [消息管理](http://127.0.0.1:8080/cusys/reportsMS/messageMain/)
  - [模板管理](http://127.0.0.1:8080/cusys/reportsMS/template)
- [Production](#production)
- [Links](#)

## Technologies

AdvancedNuxt uses the following technologies:

- [Nuxt3](https://v3.nuxtjs.org) as the Vue framework.
- [TypeScript](https://www.typescriptlang.org) for type safety.

## Code Formatter

- [Prettier](https://prettier.io)
- [Eslint](https://eslint.org)

## Development

clone this repository

```bash
git clone git@github.com:imc-ux/ReportsMS.git
```

install dependencies

```bash
npm install
```

local development

```bash
npm run dev
```

Start the development server on [http://127.0.0.1:8080/cusys/reportsMS/](http://127.0.0.1:8080/cusys/reportsMS/)

The pages are generated from pages/

#### 消息管理: [http://127.0.0.1:8080/cusys/reportsMS/messageMain/](http://127.0.0.1:8080/cusys/reportsMS/messageMain/)

#### 模板管理: [http://127.0.0.1:8080/cusys/reportsMS/template](http://127.0.0.1:8080/cusys/reportsMS/template)

## Production

generate: 构建应用程序并生成每个路径作为 HTML 文件。

```
npm run generate
```

生成.output， .output/public/文件夹下内容上传服务器。

使用 generate 打包后每个对应的页面都会生成一个 html，打包的时候不能关闭后台，它会请求后台数据生成首屏的数据。

[Go to Top](#table-of-contents)
