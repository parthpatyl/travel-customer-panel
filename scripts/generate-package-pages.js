import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const distDir = path.resolve(rootDir, 'dist')
const indexHtmlPath = path.resolve(distDir, 'index.html')

const API_URL = process.env.VITE_API_URL || 'https://kraft-backend-ndss.onrender.com'
const SITE_URL = 'https://www.kraftyourtrip.com'

async function fetchPackages() {
  try {
    const res = await fetch(`${API_URL}/api/packages`)
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        console.log(`[pre-render] Fetched ${data.length} packages from backend API.`)
        return data
      }
    }
  } catch (err) {
    console.warn('[pre-render] Could not fetch packages from API, using fallback data:', err.message)
  }

  // Fallback to local static packages
  try {
    const staticPackagesModule = await import('../src/data/packages.js')
    const pkgs = staticPackagesModule.default || []
    console.log(`[pre-render] Loaded ${pkgs.length} packages from src/data/packages.js.`)
    return pkgs
  } catch (err) {
    console.warn('[pre-render] Fallback package import failed:', err.message)
    return []
  }
}

function resolveImageUrl(img) {
  if (!img) return `${SITE_URL}/logo.png`
  if (img.startsWith('http://') || img.startsWith('https://')) return img
  const clean = img.startsWith('/') ? img : `/${img}`
  // If it points to an asset upload, it's served by backend
  if (clean.startsWith('/assets/')) {
    return `${API_URL}${clean}`
  }
  return `${SITE_URL}${clean}`
}

function escapeHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

async function generate() {
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('[pre-render] Error: dist/index.html not found. Run vite build first!')
    process.exit(1)
  }

  const baseHtml = fs.readFileSync(indexHtmlPath, 'utf8')
  const packages = await fetchPackages()

  let generatedCount = 0

  for (const pkg of packages) {
    if (!pkg.id) continue

    const pkgTitle = `${pkg.name} | ${pkg.duration || ''} - Kraft Your Trip`
    const rawPrice = pkg.price != null ? pkg.price : pkg.basePrice
    const priceText = rawPrice ? `Starting from Rs. ${Number(rawPrice).toLocaleString('en-IN')}. ` : ''
    const cleanDesc = (pkg.description || `Handcrafted luxury journeys to ${pkg.name}.`)
      .replace(/[\r\n]+/g, ' ')
      .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
      .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
      .replace(/[\u2013\u2014]/g, '-')
      .slice(0, 160)
    const pkgDesc = `${priceText}${cleanDesc}`
    const pkgImage = resolveImageUrl(pkg.heroImage || pkg.cardImage)
    const pkgUrl = `${SITE_URL}/package/${pkg.id}`

    // Replace <title> and meta tags
    let html = baseHtml

    // Title
    html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(pkgTitle)}</title>`)

    // Open Graph Title
    if (html.includes('property="og:title"')) {
      html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i, `<meta property="og:title" content="${escapeHtml(pkgTitle)}" />`)
    } else {
      html = html.replace('</head>', `  <meta property="og:title" content="${escapeHtml(pkgTitle)}" />\n</head>`)
    }

    // Open Graph Description
    if (html.includes('property="og:description"')) {
      html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i, `<meta property="og:description" content="${escapeHtml(pkgDesc)}" />`)
    } else {
      html = html.replace('</head>', `  <meta property="og:description" content="${escapeHtml(pkgDesc)}" />\n</head>`)
    }

    // Meta Description
    html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, `<meta name="description" content="${escapeHtml(pkgDesc)}" />`)

    // Open Graph Image
    if (html.includes('property="og:image"')) {
      html = html.replace(/<meta\s+property="og:image"\s+content=".*?"\s*\/?>/i, `<meta property="og:image" content="${escapeHtml(pkgImage)}" />`)
    } else {
      html = html.replace('</head>', `  <meta property="og:image" content="${escapeHtml(pkgImage)}" />\n</head>`)
    }

    // Open Graph URL
    if (html.includes('property="og:url"')) {
      html = html.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i, `<meta property="og:url" content="${escapeHtml(pkgUrl)}" />`)
    } else {
      html = html.replace('</head>', `  <meta property="og:url" content="${escapeHtml(pkgUrl)}" />\n</head>`)
    }

    // Twitter Card tags
    const twitterTags = `
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(pkgTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(pkgDesc)}" />
  <meta name="twitter:image" content="${escapeHtml(pkgImage)}" />
`
    html = html.replace('</head>', `${twitterTags}\n</head>`)

    // Write to dist/package/${pkg.id}/index.html
    const targetDir = path.resolve(distDir, 'package', pkg.id)
    fs.mkdirSync(targetDir, { recursive: true })
    fs.writeFileSync(path.resolve(targetDir, 'index.html'), html, 'utf8')

    // Also write lowercase variant if different
    if (pkg.id.toLowerCase() !== pkg.id) {
      const lowerTargetDir = path.resolve(distDir, 'package', pkg.id.toLowerCase())
      fs.mkdirSync(lowerTargetDir, { recursive: true })
      fs.writeFileSync(path.resolve(lowerTargetDir, 'index.html'), html, 'utf8')
    }

    generatedCount++
  }

  console.log(`[pre-render] Successfully generated ${generatedCount} static package pages with Open Graph tags!`)
}

generate().catch(err => {
  console.error('[pre-render] Fatal error generating static pages:', err)
  process.exit(1)
})
