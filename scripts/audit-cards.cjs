const fs = require('fs')
const h = fs.readFileSync('index.html', 'utf8')

const arts = [...h.matchAll(/<article class="([^"]+)"/g)].map((m) => m[1])
const counts = {}
for (const a of arts) counts[a] = (counts[a] || 0) + 1
console.log('articles', counts)

const samples = {
  'post-thumb': h.includes('post-thumb--card'),
  'cover-card--tech': (h.match(/cover-card--tech/g) || []).length,
  'cover-card--featured': (h.match(/cover-card--featured/g) || []).length,
  'post-feature': (h.match(/class="post-feature"/g) || []).length,
  'post-card--tile': (h.match(/post-card--tile/g) || []).length,
  'post-card--row': (h.match(/post-card--row/g) || []).length,
  'dont-miss__link': (h.match(/dont-miss__link/g) || []).length,
  'editors-pick__feature': (h.match(/editors-pick__feature/g) || []).length,
  'editors-pick__item': (h.match(/editors-pick__item-link/g) || []).length,
  'spotlights__link': (h.match(/spotlights__link/g) || []).length,
  'post-thumb--rank': (h.match(/post-thumb--rank/g) || []).length,
}
console.log('patterns', samples)
