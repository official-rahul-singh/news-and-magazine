import 'bootstrap'
import Swiper from 'swiper'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import '../css/style.scss'

const header = document.querySelector('.header')
const nav = document.querySelector('#primary-nav')
const navToggle = document.querySelector('[data-nav-toggle]')
const themeToggle = document.querySelector('[data-theme-toggle]')
const dropdownItems = document.querySelectorAll('.navigations__item--dropdown')

function setExpanded(button, expanded) {
  if (!button) return
  button.setAttribute('aria-expanded', String(expanded))
}

function closeMobileNav() {
  if (!nav || !navToggle) return
  nav.classList.remove('navigations--open')
  setExpanded(navToggle, false)
  navToggle.setAttribute('aria-label', 'Open menu')
}

function toggleMobileNav() {
  if (!nav || !navToggle) return
  const isOpen = nav.classList.toggle('navigations--open')
  setExpanded(navToggle, isOpen)
  navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu')
}

function closeDropdowns(exceptItem) {
  dropdownItems.forEach((item) => {
    if (item === exceptItem) return
    item.classList.remove('navigations__item--open')
    const toggle = item.querySelector('.navigations__toggle')
    setExpanded(toggle, false)
  })
}

function initNavToggle() {
  if (!navToggle) return

  navToggle.addEventListener('click', () => {
    toggleMobileNav()
  })
}

function initDropdowns() {
  dropdownItems.forEach((item) => {
    const toggle = item.querySelector('.navigations__toggle')
    if (!toggle) return

    toggle.addEventListener('click', (event) => {
      event.preventDefault()
      const willOpen = !item.classList.contains('navigations__item--open')
      closeDropdowns(item)
      item.classList.toggle('navigations__item--open', willOpen)
      setExpanded(toggle, willOpen)
    })
  })
}

function initThemeToggle() {
  if (!themeToggle) return

  const root = document.documentElement
  const stored = localStorage.getItem('theme')
  if (stored === 'dark') {
    root.setAttribute('data-bs-theme', 'dark')
  }

  themeToggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-bs-theme') === 'dark'
    const next = isDark ? 'light' : 'dark'
    if (next === 'dark') {
      root.setAttribute('data-bs-theme', 'dark')
    } else {
      root.removeAttribute('data-bs-theme')
    }
    localStorage.setItem('theme', next)
  })
}

function initStickyHeader() {
  if (!header) return

  const onScroll = () => {
    header.classList.toggle('header--sticky', window.scrollY > 24)
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}

function initOutsideClick() {
  document.addEventListener('click', (event) => {
    const target = event.target
    if (!(target instanceof Element)) return

    if (nav && navToggle && !nav.contains(target) && !navToggle.contains(target)) {
      closeMobileNav()
    }

    if (!target.closest('.navigations__item--dropdown')) {
      closeDropdowns()
    }
  })
}

function initResizeClose() {
  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 992px)').matches) {
      closeMobileNav()
      closeDropdowns()
    }
  })
}

const tickerHeadlines = [
  'Bitcoin Lightning Payment Volume Increased 400% In A Year',
  'Global Markets Rally As Inflation Cools Faster Than Expected',
  'AI Startups Raise Record Funding In Emerging Tech Hubs',
]

function initTicker() {
  const headline = document.querySelector('[data-ticker-headline]')
  const prevBtn = document.querySelector('[data-ticker-prev]')
  const nextBtn = document.querySelector('[data-ticker-next]')
  if (!headline || !prevBtn || !nextBtn) return

  let index = 0

  const render = () => {
    headline.textContent = tickerHeadlines[index]
  }

  prevBtn.addEventListener('click', () => {
    index = (index - 1 + tickerHeadlines.length) % tickerHeadlines.length
    render()
  })

  nextBtn.addEventListener('click', () => {
    index = (index + 1) % tickerHeadlines.length
    render()
  })
}

function syncFeaturedThumbs(thumbs, index) {
  thumbs.forEach((thumb, i) => {
    const active = i === index
    thumb.classList.toggle('featured-thumb--active', active)
    thumb.setAttribute('aria-pressed', String(active))
  })
}

function initFeaturedSlider() {
  const el = document.querySelector('[data-featured-swiper]')
  if (!el) return

  const thumbs = [...document.querySelectorAll('[data-featured-thumb]')]

  const swiper = new Swiper(el, {
    modules: [Autoplay, Pagination],
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 600,
    loop: true,
    watchOverflow: false,
    observer: true,
    observeParents: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: '.featured__dots',
      clickable: true,
    },
    on: {
      init(instance) {
        syncFeaturedThumbs(thumbs, instance.realIndex)
      },
      slideChange(instance) {
        syncFeaturedThumbs(thumbs, instance.realIndex)
      },
    },
  })

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const index = Number(thumb.dataset.featuredThumb)
      if (Number.isNaN(index)) return
      swiper.slideToLoop(index)
    })
  })
}

function initPopularTags() {
  const el = document.querySelector('[data-tags-swiper]')
  if (!el) return

  const prevEl = document.querySelector('[data-tags-prev]')
  const nextEl = document.querySelector('[data-tags-next]')

  new Swiper(el, {
    modules: [Navigation],
    slidesPerView: 'auto',
    spaceBetween: 10,
    watchOverflow: true,
    navigation: {
      prevEl,
      nextEl,
    },
  })
}

function initTechFilters() {
  const filters = document.querySelectorAll('[data-tech-filter]')
  if (!filters.length) return

  filters.forEach((button) => {
    button.addEventListener('click', () => {
      filters.forEach((item) => {
        item.classList.toggle('tech-news__filter--active', item === button)
      })
    })
  })
}

function initSpotlightsTabs() {
  const tabs = document.querySelectorAll('[data-spotlight-tab]')
  const panels = document.querySelectorAll('[data-spotlight-panel]')
  if (!tabs.length || !panels.length) return

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.spotlightTab

      tabs.forEach((item) => {
        const active = item === tab
        item.classList.toggle('spotlights__tab--active', active)
        item.setAttribute('aria-selected', String(active))
      })

      panels.forEach((panel) => {
        const active = panel.dataset.spotlightPanel === target
        panel.classList.toggle('is-active', active)
        panel.hidden = !active
      })
    })
  })
}

initNavToggle()
initDropdowns()
initThemeToggle()
initStickyHeader()
initOutsideClick()
initResizeClose()
initTicker()
initFeaturedSlider()
initPopularTags()
initTechFilters()
initSpotlightsTabs()
initLatestFilters()
initMoreNewsDots()

function initLatestFilters() {
  const filters = document.querySelectorAll('[data-latest-filter]')
  if (!filters.length) return

  filters.forEach((button) => {
    button.addEventListener('click', () => {
      filters.forEach((item) => {
        item.classList.toggle('latest-block__filter--active', item === button)
      })
    })
  })
}

function initMoreNewsDots() {
  const dots = document.querySelectorAll('[data-more-dot]')
  if (!dots.length) return

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      dots.forEach((item) => {
        const active = item === dot
        item.classList.toggle('more-news__dot--active', active)
        if (active) {
          item.setAttribute('aria-current', 'true')
        } else {
          item.removeAttribute('aria-current')
        }
      })
    })
  })
}
