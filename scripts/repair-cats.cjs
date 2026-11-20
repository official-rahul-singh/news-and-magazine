const fs = require('fs')
const file = require('path').join(__dirname, '..', 'index.html')
let html = fs.readFileSync(file, 'utf8')

const before = html.match(/<span class="cover-card__category">[^<]*<\/div>/g) || []
console.log('before', before)

html = html.replace(
  /<span class="cover-card__category">([^<]*)<\/div>/g,
  '<a class="cover-card__category" href="#">$1</a>'
)

fs.writeFileSync(file, html)
console.log('after', html.match(/<span class="cover-card__category">[^<]*<\/div>/g) || [])
