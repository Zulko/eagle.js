let height, width, center, boundary
// default config
let scale = 2

function updateCoords () {
  height = document.documentElement.clientHeight
  width = document.documentElement.clientWidth
  center.x = width / 2
  center.y = height / 2
  boundary.x = center.x / scale
  boundary.y = center.y / scale
}

function magnify (event) {
  if (!event.altKey) return
  if (document.body.style.transform) {
    document.body.style.transform = ''
    document.body.style.overflow = 'auto'
  } else {
    document.body.style.height = height + 'px'
    document.body.style.overflow = 'hidden'
    document.body.style.transition = '0.5s'
    let translateX = center.x - event.clientX
    let translateY = center.y - event.clientY
    translateX = translateX < boundary.x ? translateX > -boundary.x ? translateX : -boundary.x : boundary.x
    translateY = translateY < boundary.y ? translateY > -boundary.y ? translateY : -boundary.y : boundary.y
    document.body.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`
  }
}

export default {
  isPlugin: true,
  init: function (slideshow, config) {
    // zoom can be only enabled by main slideshow
    if (!slideshow.embedded) return

    scale = config.scale
    height = document.documentElement.clientHeight
    width = document.documentElement.clientWidth
    center = {
      x: width / 2,
      y: height / 2
    }
    boundary = {
      x: center.x / scale,
      y: center.y / scale
    }

    window.addEventListener('resize', updateCoords)
    window.addEventListener('mousedown', magnify)
  },
  destroy: function () {
    window.removeEventListener('resize', updateCoords)
    window.removeEventListener('mousedown', magnify)
  }

}

