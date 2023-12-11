export default {
  title: 'ReportsMS',
  devServer: {
    host: '127.0.0.1',
    port: 8080,
  },
  test: /\.ts$/,
  exclude: [/node_modules/, /vendor/, /\.nuxt/],
  loader: 'ts-loader',
  options: {
    appendTsSuffixTo: [/\.vue$/, /TSX\.vue$/],
    transpileOnly: true,
  },
  buildModules: ['@nuxt/typescript-build'],
  router: {
    linkActiveClass: 'active',
    extendRoutes(routes: any, resolve: any) {
      routes.splice(0);
      routes.push(
        ...[
          {
            path: '',
            name: 'template',
            props: true,
            component: resolve(__dirname, 'pages/template/'),
          },
          {
            path: '',
            name: 'templateDetail',
            props: true,
            component: resolve(__dirname, 'pages/templateDetail/'),
          },
        ]
      );
    },
  },
  css: ['element-plus/dist/index.css'],
  // modules: [
  //   [
  //     '@pinia/nuxt',
  //     {
  //       autoImports: ['defineStore', ['defineStore', 'definePiniaStore']],
  //     },
  //   ],
  // ],
  ssr: false,
};
