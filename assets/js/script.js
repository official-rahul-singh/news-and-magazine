import 'bootstrap'
import Swiper from 'swiper'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import '../css/style.scss'

const header = document.querySelector('.header')
const themeToggle = document.querySelector('[data-theme-toggle]')
const sidebar = document.querySelector('#site-sidebar')
const sidebarToggle = document.querySelector('[data-sidebar-toggle]')
const sidebarClose = document.querySelector('[data-sidebar-close]')
const sidebarBackdrop = document.querySelector('[data-sidebar-backdrop]')
const dropdownItems = document.querySelectorAll('.navigations__item--dropdown')

function setExpanded(button, expanded) {
  if (!button) return
  button.setAttribute('aria-expanded', String(expanded))
}

function setSidebarOpen(open) {
  if (!sidebar || !sidebarToggle) return

  sidebar.classList.toggle('is-open', open)
  sidebar.setAttribute('aria-hidden', String(!open))
  setExpanded(sidebarToggle, open)
  sidebarToggle.setAttribute('aria-label', open ? 'Close sidebar' : 'Open sidebar')
  document.body.classList.toggle('sidebar-open', open)

  if (sidebarBackdrop) {
    sidebarBackdrop.hidden = !open
    sidebarBackdrop.classList.toggle('is-open', open)
  }
}

function closeSidebar() {
  setSidebarOpen(false)
}

function toggleSidebar() {
  if (!sidebar) return
  setSidebarOpen(!sidebar.classList.contains('is-open'))
}

function closeDropdowns(exceptItem) {
  dropdownItems.forEach((item) => {
    if (item === exceptItem) return
    item.classList.remove('navigations__item--open')
    const toggle = item.querySelector('.navigations__toggle')
    setExpanded(toggle, false)
  })
}

function initSidebar() {
  if (!sidebarToggle) return

  sidebarToggle.addEventListener('click', () => {
    toggleSidebar()
  })

  sidebarClose?.addEventListener('click', () => {
    closeSidebar()
  })

  sidebarBackdrop?.addEventListener('click', () => {
    closeSidebar()
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeSidebar()
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

function applyTheme(theme) {
  const root = document.documentElement
  const next = theme === 'dark' ? 'dark' : 'light'
  root.setAttribute('data-bs-theme', next)
  localStorage.setItem('theme', next)

  if (!themeToggle) return
  themeToggle.setAttribute(
    'aria-label',
    next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  )
  themeToggle.setAttribute('aria-pressed', String(next === 'dark'))
}

function initThemeToggle() {
  if (!themeToggle) return

  const root = document.documentElement
  const stored = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const current =
    root.getAttribute('data-bs-theme') ||
    (stored === 'light' || stored === 'dark' ? stored : prefersDark ? 'dark' : 'light')

  applyTheme(current)

  themeToggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-bs-theme') === 'dark'
    applyTheme(isDark ? 'light' : 'dark')
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

    if (!target.closest('.navigations__item--dropdown')) {
      closeDropdowns()
    }
  })
}

function initResizeClose() {
  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 992px)').matches) {
      closeDropdowns()
    }
  })
}

function initTicker() {
  const el = document.querySelector('[data-ticker-swiper]')
  if (!el) return

  const prevEl = document.querySelector('[data-ticker-prev]')
  const nextEl = document.querySelector('[data-ticker-next]')

  new Swiper(el, {
    modules: [Autoplay, Navigation],
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    speed: 450,
    autoHeight: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    navigation: {
      prevEl,
      nextEl,
    },
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

function showFilterPanel(attr, key) {
  document.querySelectorAll(`[${attr}]`).forEach((panel) => {
    const active = panel.getAttribute(attr) === key
    panel.hidden = !active
    panel.setAttribute('aria-hidden', active ? 'false' : 'true')
  })
}

function initFilterTabs(selector, panelAttr) {
  const groups = new Map()

  document.querySelectorAll(selector).forEach((button) => {
    const list = button.closest('[role="tablist"]')
    if (!list) return
    if (!groups.has(list)) groups.set(list, [])
    groups.get(list).push(button)
  })

  groups.forEach((filters) => {
    filters.forEach((button) => {
      button.addEventListener('click', () => {
        filters.forEach((item) => {
          const active = item === button
          item.classList.toggle('tech-news__filter--active', active)
          item.setAttribute('aria-selected', active ? 'true' : 'false')
        })

        const value =
          button.getAttribute('data-tech-filter') || button.getAttribute('data-latest-filter')
        if (value) showFilterPanel(panelAttr, value)
      })
    })
  })
}

function initTechFilters() {
  initFilterTabs('[data-tech-filter]', 'data-tech-panel')
  showFilterPanel('data-tech-panel', 'science')
}

function initLatestFilters() {
  initFilterTabs('[data-latest-filter]', 'data-latest-panel')
  showFilterPanel('data-latest-panel', 'science')
}


initSidebar()
initDropdowns()
initThemeToggle()
initStickyHeader()
initOutsideClick()
initResizeClose()
initTicker()
initFeaturedSlider()
initPopularTags()
initTechFilters()
initLatestFilters()
