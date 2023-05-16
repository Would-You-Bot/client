/**
 * More Info: https://github.com/dividab/tsconfig-paths.
 */

const path = require('path');
const tsConfigPaths = require('tsconfig-paths');
const tsConfig = require('./tsconfig.json');

const baseUrl = tsConfig.compilerOptions.baseUrl || '';
// const outDir = tsConfig.compilerOptions.outDir || '';
const basePath = path.resolve(baseUrl);

console.log(`Running register.js\nBase Path: ${basePath}\nPaths:`);
console.log(tsConfig.compilerOptions.paths);

const cleanup = tsConfigPaths.register({
  baseUrl: basePath,
  paths: tsConfig.compilerOptions.paths || {},
});

cleanup();
