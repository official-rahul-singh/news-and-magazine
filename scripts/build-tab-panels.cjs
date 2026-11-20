const fs = require('fs')
const path = require('path')

const AUTHOR_SVG = `<svg class="icon flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M7.25 7c0-2.619 2.131-4.75 4.75-4.75S16.75 4.381 16.75 7s-2.131 4.75-4.75 4.75S7.25 9.619 7.25 7M15 13.25H9c-3.17 0-5.75 2.58-5.75 5.75A2.75 2.75 0 0 0 6 21.75h12A2.75 2.75 0 0 0 20.75 19c0-3.17-2.58-5.75-5.75-5.75"/>
                  </svg>`

const TECH = {
  science: {
    cards: [
      {
        img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
        alt: 'Hand holding a smartphone',
        category: 'Science',
        title: 'Samsung Launches New 108MP Camera Sensor for Smartphones',
        author: 'By Martina Richter',
      },
      {
        img: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&w=800&q=80',
        alt: 'Person wearing over-ear headphones',
        category: 'Science',
        title: 'Report: Screen Time Surge, Teens Facing Mental Health Concerns',
        author: 'By Martina Richter',
      },
      {
        img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
        alt: 'Abstract AI visualization',
        category: 'Science',
        title: 'Artificial Intelligence Can Actually Help Save Your Modern Life',
        author: 'By Priya Nair',
      },
      {
        img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        alt: 'Earth from space',
        category: 'Science',
        title: 'New Space Telescope Reveals Secrets of Distant Galaxies',
        author: 'By Denis Schmidt',
      },
    ],
    ranks: [
      {
        img: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=200&q=80',
        title: 'Get One of the Best VR Games Free on Epic Games Store',
        author: 'By Denis Schmidt',
      },
      {
        img: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=200&q=80',
        title: 'Digital Calendars & Organizers to Get You Organized',
        author: 'By Martina Richter',
      },
      {
        img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=200&q=80',
        title: 'Tech Leaders Highlight 15 Industries AI and VR Will Disrupt',
        author: 'By Hannah Ziegler',
      },
      {
        img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=200&q=80',
        title: 'Guide to Nutritious Breakfast Options for Increased Energy',
        author: 'By Priya Nair',
      },
    ],
  },
  fashion: {
    cards: [
      {
        img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
        alt: 'Fashion model on a city street',
        category: 'Fashion',
        title: 'Distinguished Brands Setting Extraordinary Styles This Season',
        author: 'By Hannah Ziegler',
      },
      {
        img: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=800&q=80',
        alt: 'Flat lay of fashion accessories',
        category: 'Fashion',
        title: 'Minimal Wardrobe Essentials Every Editor Is Recommending',
        author: 'By Martina Richter',
      },
      {
        img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80',
        alt: 'Runway fashion show',
        category: 'Fashion',
        title: 'Runway Recap: Bold Colors Dominate Spring Collections',
        author: 'By Alex Morgan',
      },
      {
        img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80',
        alt: 'Clothing racks in a boutique',
        category: 'Fashion',
        title: 'Sustainable Fabrics Are Changing How Designers Create',
        author: 'By Priya Nair',
      },
    ],
    ranks: [
      {
        img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=200&q=80',
        title: 'If You Believe Failure Is Painful, Try Never Trying At All',
        author: 'By Hannah Ziegler',
      },
      {
        img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&q=80',
        title: 'Street Style Looks That Defined the Weekend Markets',
        author: 'By Martina Richter',
      },
      {
        img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=200&q=80',
        title: 'How Capsule Closets Help Busy Professionals Dress Faster',
        author: 'By Denis Schmidt',
      },
      {
        img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=200&q=80',
        title: 'Accessories That Quietly Elevate Everyday Outfits',
        author: 'By Priya Nair',
      },
    ],
  },
  sports: {
    cards: [
      {
        img: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80',
        alt: 'Hands holding a game controller',
        category: 'Sports',
        title: 'The Best Exciting Local Multiplayer Games You Can Play on PS5',
        author: 'By Martina Richter',
      },
      {
        img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba6851?auto=format&fit=crop&w=800&q=80',
        alt: 'Athletes racing on a track',
        category: 'Sports',
        title: 'Unexpected Football Moments Keep Fans Watching Every Match',
        author: 'By Hannah Ziegler',
      },
      {
        img: 'https://images.unsplash.com/photo-1517649763962-0c623066027e?auto=format&fit=crop&w=800&q=80',
        alt: 'Cyclists in a race',
        category: 'Sports',
        title: 'Smart Training Plans Helping Athletes Recover Faster',
        author: 'By Denis Schmidt',
      },
      {
        img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
        alt: 'Soccer ball on a field',
        category: 'Sports',
        title: 'Youth Leagues Open New Paths for Community Coaching',
        author: 'By Alex Morgan',
      },
    ],
    ranks: [
      {
        img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba6851?auto=format&fit=crop&w=200&q=80',
        title: "Virtual Reality and the Gaming Industry's Shift to the Future",
        author: 'By Hannah Ziegler',
      },
      {
        img: 'https://images.unsplash.com/photo-1517649763962-0c623066027e?auto=format&fit=crop&w=200&q=80',
        title: 'Weekend Match Previews Fans Should Not Miss',
        author: 'By Martina Richter',
      },
      {
        img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=200&q=80',
        title: 'How Nutrition Timing Improves Match-Day Performance',
        author: 'By Priya Nair',
      },
      {
        img: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=200&q=80',
        title: 'Rising Stars Making Their Mark Across Local Clubs',
        author: 'By Denis Schmidt',
      },
    ],
  },
}

const LATEST = {
  science: {
    feature: {
      img: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&w=900&q=80',
      alt: 'Young person wearing headphones',
      category: 'Science',
      title: 'Report: Screen Time Surge, Teens Facing Mental Health Concerns',
      author: 'By Martina Richter',
      excerpt:
        'While mobile phones undoubtedly provide countless benefits, recent studies highlight rising risks for teens who spend too much time online.',
    },
    tiles: [
      {
        img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=500&q=80',
        category: 'Science',
        title: 'Mental Health Service Agreements Extended Due to Ongoing Pandemic',
        author: 'By Martina Richter',
      },
      {
        img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&q=80',
        category: 'Science',
        title: 'Researchers Map New Pathways for Clean Energy Storage',
        author: 'By Denis Schmidt',
      },
      {
        img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=500&q=80',
        category: 'Science',
        title: 'AI Models Help Doctors Spot Early Warning Signs Faster',
        author: 'By Priya Nair',
      },
      {
        img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&q=80',
        category: 'Science',
        title: 'Lab Breakthroughs Promise Stronger Everyday Materials',
        author: 'By Alex Morgan',
      },
    ],
  },
  fashion: {
    feature: {
      img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
      alt: 'Fashion model outdoors',
      category: 'Fashion',
      title: 'If You Believe Failure Is Painful, Try Never Trying At All',
      author: 'By Hannah Ziegler',
      excerpt:
        'Designers are rewriting seasonal rules with durable fabrics, quieter logos, and silhouettes built for real city life.',
    },
    tiles: [
      {
        img: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=500&q=80',
        category: 'Fashion',
        title: 'Accessories That Quietly Elevate Everyday Outfits',
        author: 'By Martina Richter',
      },
      {
        img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=500&q=80',
        category: 'Fashion',
        title: 'Runway Recap: Bold Colors Dominate Spring Collections',
        author: 'By Alex Morgan',
      },
      {
        img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=500&q=80',
        category: 'Fashion',
        title: 'Sustainable Fabrics Are Changing How Designers Create',
        author: 'By Priya Nair',
      },
      {
        img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80',
        category: 'Fashion',
        title: 'Street Style Looks That Defined the Weekend Markets',
        author: 'By Denis Schmidt',
      },
    ],
  },
  sports: {
    feature: {
      img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba6851?auto=format&fit=crop&w=900&q=80',
      alt: 'Athletes racing',
      category: 'Sports',
      title: 'Unexpected Football Moments Keep Fans Watching Every Match',
      author: 'By Hannah Ziegler',
      excerpt:
        'From last-minute goals to tactical switches, this season is delivering drama that keeps stadiums and living rooms locked in.',
    },
    tiles: [
      {
        img: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=500&q=80',
        category: 'Sports',
        title: 'The Best Exciting Local Multiplayer Games You Can Play on PS5',
        author: 'By Martina Richter',
      },
      {
        img: 'https://images.unsplash.com/photo-1517649763962-0c623066027e?auto=format&fit=crop&w=500&q=80',
        category: 'Sports',
        title: 'Smart Training Plans Helping Athletes Recover Faster',
        author: 'By Denis Schmidt',
      },
      {
        img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=500&q=80',
        category: 'Sports',
        title: 'Youth Leagues Open New Paths for Community Coaching',
        author: 'By Alex Morgan',
      },
      {
        img: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=500&q=80',
        category: 'Sports',
        title: 'Rising Stars Making Their Mark Across Local Clubs',
        author: 'By Priya Nair',
      },
    ],
  },
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function authorMeta(author) {
  return `<span class="post-thumb__date small mb-0 d-inline-flex align-items-center gap-1">
                  ${AUTHOR_SVG}
                  ${esc(author)}
                </span>`
}

function coverCard(item) {
  return `<div class="col-sm-6 col-xl-3">
              <a class="cover-card cover-card--tech" href="#">
                <img
                  class="cover-card__image"
                  src="${esc(item.img)}"
                  alt="${esc(item.alt)}"
                  width="400"
                  height="520"
                />
                <span class="cover-card__overlay" aria-hidden="true"></span>
                <span class="cover-card__body">
                  <span class="cover-card__category">${esc(item.category)}</span>
                  <span class="post-thumb__title text-truncate-2 text-decoration-none fw-bold mb-2">${esc(item.title)}</span>
                  ${authorMeta(item.author)}
                </span>
              </a>
            </div>`
}

function rankCard(item, index) {
  return `<div class="col-sm-6 col-xl-3">
              <article class="post-thumb post-thumb--rank d-flex align-items-start gap-3 h-100 pt-1 w-100">
                <div class="post-thumb__body flex-grow-1 min-w-0">
                  <a class="post-thumb__title text-truncate-2 text-decoration-none fw-bold mb-2" href="#" title="${esc(item.title)}">${esc(item.title)}</a>
                  ${authorMeta(item.author)}
                </div>
                <a class="post-thumb__media post-thumb__media--round flex-shrink-0 position-relative" href="#" title="${esc(item.title)}" tabindex="-1" aria-hidden="true">
                  <img
                    class="post-thumb__image d-block w-100 h-100 object-fit-cover rounded-circle"
                    src="${esc(item.img)}"
                    alt=""
                    width="72"
                    height="72"
                  />
                  <span class="post-thumb__badge">${index + 1}</span>
                </a>
              </article>
            </div>`
}

function techPanel(key, data, active) {
  const hidden = active ? '' : ' hidden'
  return `<div class="tech-news__panel" id="tech-panel-${key}" role="tabpanel" data-tech-panel="${key}"${hidden}${active ? '' : ' aria-hidden="true"'}>
          <div class="row g-4">
            ${data.cards.map(coverCard).join('\n            ')}
          </div>

          <div class="row tech-news__ranks">
            ${data.ranks.map(rankCard).join('\n            ')}
          </div>
        </div>`
}

function tileCard(item) {
  return `<div class="col-sm-6">
                      <a class="post-tile" href="#">
                        <span class="post-tile__media">
                          <img
                            class="post-tile__image"
                            src="${esc(item.img)}"
                            alt=""
                            width="280"
                            height="190"
                          />
                        </span>
                        <span class="cover-card__category">${esc(item.category)}</span>
                        <span class="post-thumb__title text-truncate-2 text-decoration-none fw-bold mb-2">${esc(item.title)}</span>
                        ${authorMeta(item.author)}
                      </a>
                    </div>`
}

function latestPanel(key, data, active) {
  const hidden = active ? '' : ' hidden'
  const f = data.feature
  return `<div class="tech-news__panel" id="latest-panel-${key}" role="tabpanel" data-latest-panel="${key}"${hidden}${active ? '' : ' aria-hidden="true"'}>
              <div class="row g-4">
                <div class="col-md-6">
                  <article class="post-feature">
                    <a class="post-feature__media" href="#">
                      <img
                        class="post-feature__image"
                        src="${esc(f.img)}"
                        alt="${esc(f.alt)}"
                        width="600"
                        height="380"
                      />
                    </a>
                    <span class="cover-card__category">${esc(f.category)}</span>
                    <h3 class="post-feature__title">
                      <span class="post-feature__exclusive">Exclusive</span>
                      <a class="post-thumb__title text-truncate-2 text-decoration-none fw-bold mb-2" href="#">
                        ${esc(f.title)}
                      </a>
                    </h3>
                    ${authorMeta(f.author)}
                    <p class="post-feature__excerpt">
                      ${esc(f.excerpt)}
                    </p>
                  </article>
                </div>

                <div class="col-md-6">
                  <div class="row g-4">
                    ${data.tiles.map(tileCard).join('\n                    ')}
                  </div>
                </div>
              </div>
            </div>`
}

const file = path.join(__dirname, '..', 'index.html')
let html = fs.readFileSync(file, 'utf8')

const techPanels = ['science', 'fashion', 'sports']
  .map((key) => techPanel(key, TECH[key], key === 'science'))
  .join('\n\n        ')

const techBlock = `          <div class="tech-news__panels">
        ${techPanels}
          </div>`

html = html.replace(
  /          <div class="row g-4" data-filter-cards="tech">[\s\S]*?          <div class="row tech-news__ranks" data-filter-ranks="tech">[\s\S]*?<\/div>\n        <\/div>\n      <\/section>/,
  `${techBlock}\n        </div>\n      </section>`
)

html = html.replace(
  /data-tech-filter="science"/,
  'data-tech-filter="science" aria-controls="tech-panel-science"'
)
html = html.replace(
  /data-tech-filter="fashion"/,
  'data-tech-filter="fashion" aria-controls="tech-panel-fashion"'
)
html = html.replace(
  /data-tech-filter="sports"/,
  'data-tech-filter="sports" aria-controls="tech-panel-sports"'
)

const latestPanels = ['science', 'fashion', 'sports']
  .map((key) => latestPanel(key, LATEST[key], key === 'science'))
  .join('\n\n            ')

const latestBlock = `              <div class="tech-news__panels" data-filter-cards="latest">
            ${latestPanels}
              </div>`

html = html.replace(
  /              <div class="row g-4" data-filter-cards="latest">[\s\S]*?              <\/div>\n\n              <aside/,
  `${latestBlock}\n\n              <aside`
)

html = html.replace(
  /data-latest-filter="science"/,
  'data-latest-filter="science" aria-controls="latest-panel-science"'
)
html = html.replace(
  /data-latest-filter="fashion"/,
  'data-latest-filter="fashion" aria-controls="latest-panel-fashion"'
)
html = html.replace(
  /data-latest-filter="sports"/,
  'data-latest-filter="sports" aria-controls="latest-panel-sports"'
)

fs.writeFileSync(file, html)
console.log('Tab panels written to index.html')
