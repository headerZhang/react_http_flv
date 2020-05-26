const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  }),

  addLessLoader({
    lessOptions: { // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
      javascriptEnabled: true,
      modifyVars: { '@primary-color': '#000' },
    },
  }),
);