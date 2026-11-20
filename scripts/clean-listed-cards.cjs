const fs = require('fs')
const path = require('path')

const file = path.join(__dirname, '..', 'index.html')
let html = fs.readFileSync(file, 'utf8')

const AUTHOR_ICON = `<svg class="icon flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.25 7c0-2.619 2.131-4.75 4.75-4.75S16.75 4.381 16.75 7s-2.131 4.75-4.75 4.75S7.25 9.619 7.25 7M15 13.25H9c-3.17 0-5.75 2.58-5.75 5.75A2.75 2.75 0 0 0 6 21.75h12A2.75 2.75 0 0 0 20.75 19c0-3.17-2.58-5.75-5.75-5.75"/></svg>`

html = html.replace(
  /<article class="post-card post-card--listed">([\s\S]*?)<\/article>/g,
  (_, inner) => {
    const img = inner.match(/<img class="post-card__image"([\s\S]*?)\/>/)
    const number = inner.match(/<span class="post-card__number"[^>]*>(\d+)<\/span>/)
    const category = inner.match(/<a class="cover-card__category"[^>]*>([^<]*)<\/a>/)
    const title = inner.match(/<a class="post-thumb__title[^"]*"[^>]*>([\s\S]*?)<\/a>/)
    const author = inner.match(/By ([^<]+)/)

    if (!img || !number || !category || !title || !author) {
      return `<article class="post-card post-card--listed">${inner}</article>`
    }

    const titleText = title[1].replace(/\s+/g, ' ').trim()
    const authorName = author[1].trim()

    return `<article class="post-card post-card--listed">
                      <div class="post-card__media">
                        <a class="post-card__media-link" href="#">
                          <img class="post-card__image"${img[1]}/>
                        </a>
                        <span class="post-card__number" aria-hidden="true">${number[1]}</span>
                      </div>
                      <div class="post-card__body">
                        <a class="cover-card__category" href="#">${category[1]}</a>
                        <a class="post-thumb__title text-truncate-2 text-decoration-none fw-bold" href="#">${titleText}</a>
                        <a class="post-thumb__date small mb-0 d-inline-flex align-items-center gap-1" href="#">${AUTHOR_ICON} By ${authorName}</a>
                      </div>
                    </article>`
  }
)

fs.writeFileSync(file, html)
console.log({ listed: (html.match(/post-card--listed/g) || []).length })
