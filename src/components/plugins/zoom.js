let hasZoom = false

const updateCoords = (slideshow, config) => () => {
  slideshow._height = document.documentElement.clientHeight
  slideshow._width = document.documentElement.clientWidth
  slideshow._center.x = slideshow._width / 2
  slideshow._center.y = slideshow._height / 2
  slideshow._boundary.x = slideshow._center.x / config.scale
  slideshow._boundary.y = slideshow._center.y / config.scale
}

const magnify = (slideshow, config) => event => {
  if (!event.altKey) return
  if (document.body.style.transform) {
    document.body.style.transform = ''
    document.body.style.overflow = 'auto'
  } else {
    document.body.style.height = slideshow._height + 'px'
    document.body.style.overflow = 'hidden'
    document.body.style.transition = '0.5s'
    let translateX = slideshow._center.x - event.clientX
    let translateY = slideshow._center.y - event.clientY
    translateX = translateX < slideshow._boundary.x ? translateX > -slideshow._boundary.x ? translateX : -slideshow._boundary.x : slideshow._boundary.x
    translateY = translateY < slideshow._boundary.y ? translateY > -slideshow._boundary.y ? translateY : -slideshow._boundary.y : slideshow._boundary.y
    document.body.style.transform = `scale(${config.scale}) translate(${translateX}px, ${translateY}px)`
  }
}

export default {
  isPlugin: true,
  init: function (slideshow, config) {
    // zoom can be only enabled by top-level slideshow once
    if (slideshow.embedded || slideshow.inserted || hasZoom) return

    config = Object.assign({
      scale: 2
    }, config)

    hasZoom = true
    slideshow._zoom = true

    slideshow._height = document.documentElement.clientHeight
    slideshow._width = document.documentElement.clientWidth
    slideshow._center = {
      x: slideshow._width / 2,
      y: slideshow._height / 2
    }
    slideshow._boundary = {
      x: slideshow._center.x / config.scale,
      y: slideshow._center.y / config.scale
    }

    window.addEventListener('resize', updateCoords(slideshow, config))
    window.addEventListener('mousedown', magnify(slideshow, config))
  },
  destroy: function (slideshow, config) {
    if (slideshow._zoom) {
      window.removeEventListener('resize', updateCoords(slideshow, config))
      window.removeEventListener('mousedown', magnify(slideshow, config))
    }
  }
}

