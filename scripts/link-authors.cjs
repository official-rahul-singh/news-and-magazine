const fs = require('fs')
const path = require('path')

const file = path.join(__dirname, '..', 'index.html')
let html = fs.readFileSync(file, 'utf8')

function isAnchorOpenAt(str, pos) {
  if (!str.startsWith('<a', pos)) return false
  const c = str[pos + 2]
  return c === ' ' || c === '\n' || c === '\t' || c === '\r' || c === '>' || c === '/'
}

function findNextAnchorOpen(str, from) {
  let i = from
  while (i < str.length) {
    const pos = str.indexOf('<a', i)
    if (pos === -1) return -1
    if (isAnchorOpenAt(str, pos)) return pos
    i = pos + 2
  }
  return -1
}

function findMatchingClose(str, openStart, openLen) {
  let i = openStart + openLen
  let depth = 1
  const closeTag = '</a>'
  while (i < str.length) {
    const nextOpen = findNextAnchorOpen(str, i)
    const nextClose = str.indexOf(closeTag, i)
    if (nextClose === -1) return -1
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++
      i = nextOpen + 2
      continue
    }
    depth--
    if (depth === 0) return nextClose
    i = nextClose + closeTag.length
  }
  return -1
}

function linkAuthors(inner) {
  return inner.replace(
    /<span class="(post-thumb__date small mb-0 d-inline-flex align-items-center gap-1)">(\s*<svg[\s\S]*?<\/svg>\s*By [^<\n]+)\s*<\/span>/g,
    '<a class="$1" href="#">$2</a>'
  )
}

function linkTitles(inner) {
  return inner.replace(
    /<span class="(post-thumb__title[^"]*)">([^<]*)<\/span>/,
    '<a class="$1" href="#">$2</a>'
  )
}

function unwrapCards(className, asTag) {
  const openNeedle = `<a class="${className}" href="#">`
  let out = ''
  let cursor = 0
  let count = 0
  while (true) {
    const start = html.indexOf(openNeedle, cursor)
    if (start === -1) {
      out += html.slice(cursor)
      break
    }
    out += html.slice(cursor, start)
    const closeAt = findMatchingClose(html, start, openNeedle.length)
    if (closeAt === -1) {
      out += html.slice(start)
      break
    }
    let inner = html.slice(start + openNeedle.length, closeAt)
    inner = linkTitles(inner)
    inner = linkAuthors(inner)
    out += `<${asTag} class="${className}">${inner}</${asTag}>`
    cursor = closeAt + 4
    count++
  }
  html = out
  return count
}

const tech = unwrapCards('cover-card cover-card--tech', 'article')
const tiles = unwrapCards('post-tile', 'article')
const miss = unwrapCards('dont-miss__link', 'div')

html = linkAuthors(html)

fs.writeFileSync(file, html)

console.log({
  tech,
  tiles,
  miss,
  authorLinks: (html.match(/<a class="post-thumb__date small mb-0 d-inline-flex/g) || []).length,
  authorSpansLeft: (html.match(/<span class="post-thumb__date small mb-0 d-inline-flex/g) || []).length,
  techAnchorsLeft: (html.match(/<a class="cover-card cover-card--tech"/g) || []).length,
  tileAnchorsLeft: (html.match(/<a class="post-tile"/g) || []).length,
  missAnchorsLeft: (html.match(/<a class="dont-miss__link"/g) || []).length,
})
