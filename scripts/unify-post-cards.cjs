const fs = require('fs')
const path = require('path')

const file = path.join(__dirname, '..', 'index.html')
let html = fs.readFileSync(file, 'utf8')

function tidyAuthor(htmlChunk) {
  return htmlChunk.replace(
    /<a class="post-thumb__date small mb-0 d-inline-flex align-items-center gap-1" href="#">([\s\S]*?)<\/a>/g,
    (_, inner) => {
      const tidy = inner.replace(/\s+/g, ' ').trim()
      return `<a class="post-thumb__date small mb-0 d-inline-flex align-items-center gap-1" href="#">${tidy}</a>`
    }
  )
}

html = html.replace(/<article class="post-tile">([\s\S]*?)<\/article>/g, (_, inner) => {
  let next = tidyAuthor(inner)

  next = next.replace(
    /<span class="post-tile__media">\s*<img\s+class="post-tile__image"([^>]*?)\/>\s*<\/span>/,
    `<div class="post-card__media">
                          <a class="post-card__media-link" href="#">
                            <img class="post-card__image"$1/>
                          </a>
                        </div>`
  )

  next = next.replace(
    /<span class="cover-card__category">([^<]*)<\/span>/,
    '<a class="cover-card__category" href="#">$1</a>'
  )

  next = next.replace(
    /(<a class="cover-card__category"[^>]*>[^<]*<\/a>)\s*(<a class="post-thumb__title[\s\S]*?<\/a>)\s*(<a class="post-thumb__date[\s\S]*?<\/a>)/,
    `$1
                        <div class="post-card__body">
                          $2
                          $3
                        </div>`
  )

  return `<article class="post-card post-card--tile">${next}</article>`
})

html = html.replace(/<article class="news-row">([\s\S]*?)<\/article>/g, (_, inner) => {
  let next = tidyAuthor(inner)

  next = next.replace(
    /<a class="news-row__media" href="#">\s*<img\s+class="news-row__image"([^>]*?)\/>\s*<span class="cover-card__category news-row__tag">([^<]*)<\/span>\s*<\/a>/,
    `<div class="post-card__media">
                    <a class="post-card__media-link" href="#">
                      <img class="post-card__image"$1/>
                    </a>
                    <a class="cover-card__category post-card__tag" href="#">$2</a>
                  </div>`
  )

  next = next
    .replace(/<div class="news-row__body">/g, '<div class="post-card__body">')
    .replace(/<h3 class="news-row__title">/g, '<h3 class="post-card__heading">')
    .replace(/<p class="news-row__excerpt">/g, '<p class="post-card__excerpt">')

  return `<article class="post-card post-card--row">${next}</article>`
})

fs.writeFileSync(file, html)

console.log({
  tiles: (html.match(/post-card--tile/g) || []).length,
  rows: (html.match(/post-card--row/g) || []).length,
  leftTiles: (html.match(/class="post-tile"/g) || []).length,
  leftRows: (html.match(/class="news-row"/g) || []).length,
  leftTileMedia: (html.match(/post-tile__/g) || []).length,
  leftNewsRow: (html.match(/news-row__/g) || []).length,
})
