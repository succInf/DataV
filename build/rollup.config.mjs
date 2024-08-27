import resolve from "rollup-plugin-node-resolve";
import vue from "rollup-plugin-vue";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import postcss from "rollup-plugin-postcss";
import vue2 from "rollup-plugin-vue2";

const bundleFormats = ["umd", "esm", "cjs", "iife"];
const vueVersions = ["vue2", "vue3"];

const isVue3 = (v) => v == "vue3";
const isUmd = (v) => v == "umd";
const isCjs = (v) => v == "cjs";
const isIife = (v) => v == "iife";

const getRollupConfig = (bundleFormat, vueVersion = "vue2") => {
  const vuePlugin = isVue3(vueVersion) ? vue : vue2;
  return {
    input: `build/${isVue3(vueVersion) ? "vue3-entry/" : ""}entry.${bundleFormat}.js`,
    output: {
      format: bundleFormat,
      file: `dist/${isVue3(vueVersion) ? "vue3/" : ""}datav.map.vue.${isUmd(bundleFormat) ? "" : bundleFormat + "."}js`,
      name: "datav",
      ...(isUmd(bundleFormat) || isIife(bundleFormat)
        ? {
            globals: {
              // 模块名: 变量名
              vue: "Vue",
            },
          }
        : {}),
      ...(isCjs(bundleFormat) ? { exports: "named" } : {}),
      ...(isUmd(bundleFormat) && isVue3(vueVersion) ? { exports: "default" } : {}),
    },
    plugins: [
      // rollup-plugin-vue 6.0.0版本 插件必须放在第一,需要postcss插件处理,sfc使用less,需安装less
      vuePlugin({
        preprocessStyles: true,
      }),
      resolve(),
      babel({
        exclude: "node_modules/**",
      }),
      commonjs(),
      postcss(),
    ],
    // 外部包
    external: ["vue"],
  };
};

const configs = [];
bundleFormats.forEach((format) => {
  vueVersions.forEach((vueVersion) => {
    const config = getRollupConfig(format, vueVersion);
    configs.push(config);
  });
});

export default configs;

// export default [
//   {
//     input: "build/entry.umd.js",
//     output: {
//       format: "umd",
//       file: "dist/datav.map.vue.js",
//       name: "datav",
//       globals: {
//         // vue包: 全局变量名 window.Vue
//         vue: "Vue"
//       }
//     },
//     plugins: [
//       // rollup-plugin-vue 6.0.0版本 插件必须放在第一,需要postcss插件处理,sfc使用less,需安装less
//       vue({
//         preprocessStyles: true
//       }),
//       resolve(),
//       babel({
//         exclude: "node_modules/**"
//       }),
//       commonjs(),
//       postcss()
//     ],
//     external: ["vue"]
//   },
//   {
//     input: "build/entry.esm.js",
//     output: {
//       format: "esm",
//       file: "dist/datav.map.vue.esm.js",
//       name: "datav"
//     },
//     plugins: [
//       vue({
//         preprocessStyles: true
//       }),
//       postcss(),
//       resolve(),
//       babel({
//         exclude: "node_modules/**"
//       }),
//       commonjs()
//     ],
//     external: ["vue"]
//   },
//   {
//     input: "build/entry.cjs.js",
//     output: {
//       format: "cjs",
//       file: "dist/datav.map.vue.cjs.js",
//       name: "datav",
//       exports: "named"
//     },
//     plugins: [
//       vue({
//         preprocessStyles: true
//       }),
//       postcss(),
//       resolve(),
//       babel({
//         exclude: "node_modules/**"
//       }),
//       commonjs()
//     ],
//     external: ["vue"]
//   }
// ];
