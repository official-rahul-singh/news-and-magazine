const fs = require('fs')
const path = require('path')

const file = path.join(__dirname, '..', 'index.html')
let html = fs.readFileSync(file, 'utf8')

const icon = `<svg class="icon flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path d="M7.25 7c0-2.619 2.131-4.75 4.75-4.75S16.75 4.381 16.75 7s-2.131 4.75-4.75 4.75S7.25 9.619 7.25 7M15 13.25H9c-3.17 0-5.75 2.58-5.75 5.75A2.75 2.75 0 0 0 6 21.75h12A2.75 2.75 0 0 0 20.75 19c0-3.17-2.58-5.75-5.75-5.75"/>
                            </svg>`

html = html.replace(
  /<a class="cover-card__author-link" href="#" title="([^"]+)">\s*<img[\s\S]*?\/>\s*<span>By [^<]+<\/span>\s*<\/a>/g,
  `<a class="cover-card__author-link" href="#" title="$1">
                            ${icon}
                            <span>By $1</span>
                          </a>`
)

fs.writeFileSync(file, html)
console.log({
  authorLinks: (html.match(/cover-card__author-link/g) || []).length,
  avatarsLeft: (html.match(/cover-card__avatar/g) || []).length,
  iconsInAuthors: (html.match(/cover-card__author-link[\s\S]*?M7\.25 7c0-2\.619/g) || []).length,
})
