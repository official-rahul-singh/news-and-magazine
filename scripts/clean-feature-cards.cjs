const fs = require('fs')
const path = require('path')

const file = path.join(__dirname, '..', 'index.html')
let html = fs.readFileSync(file, 'utf8')

const AUTHOR_ICON = `<svg class="icon flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.25 7c0-2.619 2.131-4.75 4.75-4.75S16.75 4.381 16.75 7s-2.131 4.75-4.75 4.75S7.25 9.619 7.25 7M15 13.25H9c-3.17 0-5.75 2.58-5.75 5.75A2.75 2.75 0 0 0 6 21.75h12A2.75 2.75 0 0 0 20.75 19c0-3.17-2.58-5.75-5.75-5.75"/></svg>`

function authorLink(name) {
  return `<a class="post-thumb__date small mb-0 d-inline-flex align-items-center gap-1" href="#">${AUTHOR_ICON} By ${name}</a>`
}

html = html.replace(
  /<article class="post-card post-card--feature">([\s\S]*?)<\/article>/g,
  (_, inner) => {
    const img = inner.match(/<img class="post-card__image"([\s\S]*?)\/>/)
    const category = inner.match(/<a class="cover-card__category"[^>]*>([^<]*)<\/a>/)
    const title =
      inner.match(/<a class="post-thumb__title[^"]*"[^>]*>([\s\S]*?)<\/a>/) ||
      inner.match(/post-thumb__title[^>]*>\s*([\s\S]*?)\s*<\/a>/)
    const author = inner.match(/By ([^<]+)/)
    const excerpt = inner.match(/<p class="post-card__excerpt">([\s\S]*?)<\/p>/)

    if (!img || !title || !author) return `<article class="post-card post-card--feature">${inner}</article>`

    const titleText = title[1].replace(/\s+/g, ' ').trim()
    const authorName = author[1].trim()

    const categoryBlock = category
      ? `\n                    <a class="cover-card__category" href="#">${category[1]}</a>`
      : ''

    const excerptBlock = excerpt
      ? `\n                      <p class="post-card__excerpt">${excerpt[1].trim()}</p>`
      : ''

    return `<article class="post-card post-card--feature">
                    <div class="post-card__media">
                      <a class="post-card__media-link" href="#">
                        <img class="post-card__image"${img[1]}/>
                      </a>
                    </div>${categoryBlock}
                    <div class="post-card__body">
                      <a class="post-thumb__title text-truncate-2 text-decoration-none fw-bold" href="#">${titleText}</a>
                      ${authorLink(authorName)}${excerptBlock}
                    </div>
                  </article>`
  }
)

fs.writeFileSync(file, html)
console.log({
  features: (html.match(/post-card--feature/g) || []).length,
  headingsLeft: (html.match(/post-card__heading/g) || []).length,
})
