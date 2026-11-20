const fs = require('fs')
const path = require('path')

const file = path.join(__dirname, '..', 'index.html')
let html = fs.readFileSync(file, 'utf8')

// Fix broken category closings: <span class="cover-card__category">X</div>
html = html.replace(
  /<span class="cover-card__category">([^<]*)<\/div>/g,
  '<a class="cover-card__category" href="#">$1</a>'
)

// Any remaining category spans inside listed cards
html = html.replace(
  /(<article class="post-card post-card--listed">[\s\S]*?<\/article>)/g,
  (block) =>
    block.replace(
      /<span class="cover-card__category">([^<]*)<\/span>/g,
      '<a class="cover-card__category" href="#">$1</a>'
    )
)

fs.writeFileSync(file, html)
console.log({
  brokenLeft: (html.match(/cover-card__category">[^<]*<\/div>/g) || []).length,
  listed: (html.match(/post-card--listed/g) || []).length,
  listedCats: (html.match(/post-card--listed[\s\S]*?cover-card__category/g) || []).length,
})
