import { build } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, writeFileSync, readdirSync, rmSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.resolve(root, 'dist-standalone')

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

console.log('🔨 Building standalone bundle with Vite...')

try {
  await build({
    root,
    base: '',
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(root, 'src'),
      },
    },
    assetsInclude: ['**/*.svg', '**/*.csv'],
    build: {
      outDir,
      cssCodeSplit: false,
      assetsInlineLimit: 10000000,
      modulePreload: false,
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
        },
      },
    },
  })

  console.log('📦 Processing build output...')

  const htmlPath = path.resolve(outDir, 'index.html')
  const assetsDir = path.resolve(outDir, 'assets')

  if (!existsSync(htmlPath)) {
    throw new Error('Build did not produce index.html')
  }

  let html = readFileSync(htmlPath, 'utf-8')

  if (existsSync(assetsDir)) {
    const files = readdirSync(assetsDir)

    for (const file of files) {
      const filePath = path.resolve(assetsDir, file)

      if (file.endsWith('.css')) {
        let cssContent = readFileSync(filePath, 'utf-8')

        // Inline SVG/other assets referenced in CSS url()
        for (const assetFile of files) {
          if (assetFile === file) continue
          const assetPath = path.resolve(assetsDir, assetFile)
          const assetContent = readFileSync(assetPath)
          const assetB64 = assetContent.toString('base64')
          const ext = path.extname(assetFile).slice(1)
          const mimeType = ext === 'svg' ? 'image/svg+xml' : `image/${ext}`
          const dataUri = `data:${mimeType};base64,${assetB64}`

          const escaped = escapeRegex(assetFile)
          const urlRe = new RegExp(`url\\([^)]*${escaped}[^)]*\\)`, 'gi')
          cssContent = cssContent.replace(urlRe, () => `url('${dataUri}')`)
        }

        const escaped = escapeRegex(file)
        const linkRe = new RegExp(
          `<link[^>]*rel="stylesheet"[^>]*href="[^"]*${escaped}[^"]*"[^>]*>`,
          'i'
        )
        if (linkRe.test(html)) {
          html = html.replace(linkRe, () => `<style>${cssContent}</style>`)
          console.log(`  ✅ Inlined CSS: ${file}`)
        } else {
          console.warn(`  ⚠️  Could not find link tag for CSS: ${file}`)
        }

      } else if (file.endsWith('.js')) {
        const jsContent = readFileSync(filePath, 'utf-8')
        const escaped = escapeRegex(file)
        const scriptRe = new RegExp(
          `<script[^>]*src="[^"]*${escaped}[^"]*"[^>]*>\\s*</script>`,
          'i'
        )
        const selfClosingRe = new RegExp(
          `<script[^>]*src="[^"]*${escaped}[^"]*"[^/>]*/>`,
          'i'
        )
        const found = scriptRe.test(html) || selfClosingRe.test(html)
        if (found) {
          html = html.replace(scriptRe, () => `<script>${jsContent}</script>`)
            .replace(selfClosingRe, () => `<script>${jsContent}</script>`)
          console.log(`  ✅ Inlined JS: ${file} (${(jsContent.length / 1024).toFixed(0)} KB)`)
        } else {
          console.warn(`  ⚠️  Could not find script tag for JS: ${file}`)
        }
      }
    }
  }

  // Remove PWA-related links
  html = html.replace(/<link[^>]*rel="manifest"[^>]*>/gi, '')
  html = html.replace(/<link[^>]*rel="apple-touch-icon"[^>]*>/gi, '')
  html = html.replace(/<meta[^>]*apple-mobile-web-app[^>]*>/gi, '')

  // Remove type="module" from script tags and move to end of body
  // (type="module" doesn't work from file://, and without it,
  // scripts in <head> execute before the DOM is ready)
  const scriptStart = html.indexOf('<script>')
  const scriptEnd = html.lastIndexOf('</script>') + '</script>'.length
  if (scriptStart !== -1 && scriptEnd > scriptStart) {
    let scriptTag = html.substring(scriptStart, scriptEnd)
    // Replace import.meta.url with self.location.href
    // (import.meta is a syntax error outside type="module")
    scriptTag = scriptTag.replace(/import\.meta\.url/g, 'self.location.href')
    html = html.substring(0, scriptStart) + html.substring(scriptEnd)
    html = html.replace('</body>', () => `${scriptTag}\n</body>`)
  }

  const outputPath = path.resolve(root, 'standalone.html')
  writeFileSync(outputPath, html, 'utf-8')

  rmSync(outDir, { recursive: true, force: true })

  const sizeKB = (html.length / 1024).toFixed(0)
  console.log(`\n✅ standalone.html generated! (${sizeKB} KB)`)
  console.log(`   Location: ${outputPath}`)

} catch (err) {
  console.error('❌ Build failed:', err.message)
  if (existsSync(outDir)) {
    rmSync(outDir, { recursive: true, force: true })
  }
  process.exit(1)
}
