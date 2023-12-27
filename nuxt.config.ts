export default {
  title: "ReportsMS",
  devServer: {
    host: "127.0.0.1",
    port: 8080,
  },
  test: /\.ts$/,
  exclude: [/node_modules/, /vendor/, /\.nuxt/],
  loader: "ts-loader",
  options: {
    appendTsSuffixTo: [/\.vue$/, /TSX\.vue$/],
    transpileOnly: true,
  },
  buildModules: ["@nuxt/typescript-build"],
  router: {
    linkActiveClass: "active",
    extendRoutes(routes: any, resolve: any) {
      routes.splice(0);
      routes.push(
        ...[
          {
            path: "/template/",
            name: "template",
            props: true,
            component: resolve(__dirname, "pages/template/"),
          },
          {
            path: "/template/detail",
            name: "templateDetail",
            props: true,
            component: resolve(__dirname, "pages/template/detail"),
          },
          {
            path: "/report/",
            name: "report",
            props: true,
            component: resolve(__dirname, "pages/report/"),
          },
          {
            path: "",
            name: "messageMain",
            component: resolve(__dirname, "pages/messageMain/"),
          },
        ]
      );
    },
  },
  css: [
    "element-plus/dist/index.css",
    "~/assets/css/main.css",
    "~/assets/css/element.css",
    "~/assets/css/component.css",
  ],
  ssr: false,
};
