import path from 'node:path'
import * as esbuild from 'esbuild'
import { fileURLToPath } from 'node:url'
import { dtsPlugin } from 'esbuild-plugin-d.ts'
import { typecheckPlugin } from '@jgoz/esbuild-plugin-typecheck'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(dirname, `..`)
const outdir = path.join(rootDir, `build`)
const esmOut = path.join(outdir, `esm`)
const cjsOut = path.join(outdir, `cjs`)
const entry = path.join(rootDir, `src/index.js`)

const minify = false

const cjsBuild = async () => {
  // Build the files with esbuild
  await esbuild
    .build({
      entryPoints: [entry],
      outdir: cjsOut,
      bundle: true,
      minify: minify,
      sourcemap: true,
      platform: 'node',
      target: ['node16'],
      plugins: [NodeModulesPolyfillPlugin()],
    })
    .catch(() => process.exit(1))
}

const esmBuild = async () => {
  // Build the files with esbuild
  await esbuild
    .build({
      entryPoints: [entry],
      format: 'esm',
      outdir: esmOut,
      bundle: true,
      minify: minify,
      sourcemap: true,
      splitting: true,
      target: ['esnext'],
      define: { global: 'window' },
      plugins: [NodeModulesPolyfillPlugin(), typecheckPlugin(), dtsPlugin()],
    })
    .catch(() => process.exit(1))
}

;(async () => {
  await cjsBuild()
  await esmBuild()
})()
