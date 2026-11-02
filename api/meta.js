const API_URL = process.env.VITE_API_URL || 'https://kraft-backend-ndss.onrender.com'
const SITE_URL = 'https://www.kraftyourtrip.com'

function resolveImageUrl(img) {
  if (!img) return `${SITE_URL}/logo.png`
  if (img.startsWith('http://') || img.startsWith('https://')) return img
  const clean = img.startsWith('/') ? img : `/${img}`
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

export default async function handler(req, res) {
  const { id } = req.query || {}

  if (!id) {
    return res.redirect(302, SITE_URL)
  }

  let pkg = null
  try {
    const response = await fetch(`${API_URL}/api/packages`)
    if (response.ok) {
      const packages = await response.json()
      if (Array.isArray(packages)) {
        pkg = packages.find(p => p.id?.toLowerCase() === id.toLowerCase())
      }
    }
  } catch (err) {
    console.warn('Failed to fetch package details for crawler:', err.message)
  }

  const pkgTitle = pkg ? `${pkg.name} | ${pkg.duration || ''} - Kraft Your Trip` : 'Kraft Your Trip | Luxury Travel Experiences'
  const rawPrice = pkg?.price != null ? pkg.price : pkg?.basePrice
  const priceText = rawPrice ? `Starting from Rs. ${Number(rawPrice).toLocaleString('en-IN')}. ` : ''
  const cleanDesc = (pkg?.description || 'Handcrafted luxury travel packages to the world’s most extraordinary destinations.')
    .replace(/[\r\n]+/g, ' ')
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .slice(0, 160)
  const pkgDesc = `${priceText}${cleanDesc}`
  const pkgImage = resolveImageUrl(pkg?.heroImage || pkg?.cardImage)
  const pkgUrl = `${SITE_URL}/package/${id}`

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(pkgTitle)}</title>
  <meta name="description" content="${escapeHtml(pkgDesc)}" />
  <meta property="og:title" content="${escapeHtml(pkgTitle)}" />
  <meta property="og:description" content="${escapeHtml(pkgDesc)}" />
  <meta property="og:image" content="${escapeHtml(pkgImage)}" />
  <meta property="og:url" content="${escapeHtml(pkgUrl)}" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(pkgTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(pkgDesc)}" />
  <meta name="twitter:image" content="${escapeHtml(pkgImage)}" />
  <meta http-equiv="refresh" content="0;url=${escapeHtml(pkgUrl)}" />
</head>
<body>
  <script>window.location.replace(${JSON.stringify(pkgUrl)})</script>
  <p>Redirecting to <a href="${escapeHtml(pkgUrl)}">${escapeHtml(pkgTitle)}</a>...</p>
</body>
</html>`

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  return res.status(200).send(html)
}
