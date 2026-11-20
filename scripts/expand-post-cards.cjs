const fs = require('fs')
const path = require('path')

const file = path.join(__dirname, '..', 'index.html')
let html = fs.readFileSync(file, 'utf8')

function tidyAuthor(chunk) {
  return chunk.replace(
    /<a class="post-thumb__date small mb-0 d-inline-flex align-items-center gap-1" href="#">([\s\S]*?)<\/a>/g,
    (_, inner) =>
      `<a class="post-thumb__date small mb-0 d-inline-flex align-items-center gap-1" href="#">${inner.replace(/\s+/g, ' ').trim()}</a>`
  )
}

// 1) Featured thumbs -> post-card--compact
html = html.replace(
  /<article class="post-thumb post-thumb--card[^"]*">([\s\S]*?)<\/article>/g,
  (_, inner) => {
    let next = tidyAuthor(inner)

    next = next.replace(
      /<a class="post-thumb__media[^"]*" href="#"([^>]*)>\s*<img\s+class="post-thumb__image[^"]*"([^>]*?)\/>\s*<\/a>/,
      `<div class="post-card__media">
                      <a class="post-card__media-link" href="#"$1>
                        <img class="post-card__image"$2/>
                      </a>
                    </div>`
    )

    next = next.replace(
      /<div class="post-thumb__body[^"]*">/,
      '<div class="post-card__body">'
    )

    next = next.replace(
      /(<a class="post-thumb__title[^>]*>)([^<]*)(<\/a>)/,
      '$1$2$3'
    )

    return `<article class="post-card post-card--compact">${next}</article>`
  }
)

// 2) post-feature -> post-card--feature
html = html.replace(/<article class="post-feature">([\s\S]*?)<\/article>/g, (_, inner) => {
  let next = tidyAuthor(inner)

  next = next.replace(
    /<a class="post-feature__media" href="#">\s*<img\s+class="post-feature__image"([^>]*?)\/>\s*<\/a>/,
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
    /<h3 class="post-feature__title">\s*(<a class="post-thumb__title[\s\S]*?<\/a>)\s*<\/h3>/,
    '<h3 class="post-card__heading">$1</h3>'
  )

  next = next.replace(
    /<p class="post-feature__excerpt">/g,
    '<p class="post-card__excerpt">'
  )

  // Wrap category + heading + author + excerpt in body if not already
  if (!next.includes('post-card__body')) {
    next = next.replace(
      /(<a class="cover-card__category"[\s\S]*)$/,
      '<div class="post-card__body">\n                    $1\n                  </div>'
    )
  }

  return `<article class="post-card post-card--feature">${next}</article>`
})

// 3) editors-pick feature -> post-card--feature (on-dark context kept by parent)
html = html.replace(
  /<article class="editors-pick__feature">([\s\S]*?)<\/article>/g,
  (_, inner) => {
    let next = tidyAuthor(inner)

    next = next.replace(
      /<a class="editors-pick__media" href="#">\s*<img\s+class="editors-pick__image"([^>]*?)\/>\s*<\/a>/,
      `<div class="post-card__media">
                  <a class="post-card__media-link" href="#">
                    <img class="post-card__image"$1/>
                  </a>
                </div>`
    )

    if (!next.includes('post-card__body')) {
      next = next.replace(
        /(<a class="post-thumb__title[\s\S]*)$/,
        '<div class="post-card__body">\n                  $1\n                </div>'
      )
    }

    return `<article class="post-card post-card--feature">${next}</article>`
  }
)

// 4) dont-miss items -> post-card--listed
html = html.replace(
  /<div class="dont-miss__link">([\s\S]*?)<\/div>/g,
  (_, inner) => {
    let next = tidyAuthor(inner)

    next = next.replace(
      /<span class="dont-miss__media">\s*<img\s+class="dont-miss__image"([^>]*?)\/>\s*<span class="dont-miss__number" aria-hidden="true">(\d+)<\/span>\s*<\/span>/,
      `<div class="post-card__media">
                      <a class="post-card__media-link" href="#">
                        <img class="post-card__image"$1/>
                      </a>
                      <span class="post-card__number" aria-hidden="true">$2</span>
                    </div>`
    )

    next = next.replace(
      /<span class="dont-miss__body">/,
      '<div class="post-card__body">'
    )
    next = next.replace(/<\/span>(\s*)$/, '</div>$1')

    // Fix body close - the original closed with </span>
    next = next.replace(
      /<div class="post-card__body">([\s\S]*?)<\/span>/,
      '<div class="post-card__body">$1</div>'
    )

    next = next.replace(
      /<span class="cover-card__category">([^<]*)<\/span>/,
      '<a class="cover-card__category" href="#">$1</a>'
    )

    return `<article class="post-card post-card--listed">${next}</article>`
  }
)

fs.writeFileSync(file, html)

console.log({
  compact: (html.match(/post-card--compact/g) || []).length,
  feature: (html.match(/post-card--feature/g) || []).length,
  listed: (html.match(/post-card--listed/g) || []).length,
  leftThumbCard: (html.match(/post-thumb--card/g) || []).length,
  leftFeature: (html.match(/class="post-feature"/g) || []).length,
  leftDontMissLink: (html.match(/dont-miss__link/g) || []).length,
  leftEditorsFeature: (html.match(/editors-pick__feature/g) || []).length,
})
