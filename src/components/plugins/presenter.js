let hasPresenter = false

const keydown = (slideshow, config) => evt => {
  if (slideshow.keyboardNavigation &&
      (slideshow.currentSlide.keyboardNavigation || evt.ctrlKey || evt.metaKey)) {
    if (evt.key === 'ArrowLeft' || evt.key === 'PageUp') {
      postMessage(slideshow, '{"method": "previousStep"}')
    } else if (evt.key === 'ArrowRight' || evt.key === 'PageDown') {
      postMessage(slideshow, '{"method": "nextStep"}')
    } else if (evt.key === config.presenterModeKey && !slideshow.parentWindow) {
      togglePresenterMode(slideshow)
      evt.preventDefault()
    }
  }
}

const click = slideshow => evt => {
  if (slideshow.mouseNavigation && slideshow.currentSlide.mouseNavigation && !evt.altKey) {
    const clientX = evt.clientX != null ? evt.clientX : evt.touches[0].clientX
    if (clientX < (0.25 * document.documentElement.clientWidth)) {
      postMessage(slideshow, '{"method": "previousStep"}')
    } else if (clientX > (0.75 * document.documentElement.clientWidth)) {
      postMessage(slideshow, '{"method": "nextStep"}')
    }
  }
}

const message = slideshow => evt => {
  if (evt.origin !== window.location.origin) {
    return void 0
  }
  try {
    const data = JSON.parse(evt.data)
    switch (data.method) {
      case 'nextStep':
      case 'previousStep':
        slideshow[data.method]()
        break
      case 'getCurrentSlide':
        postMessage(slideshow, `{
          "method": "setCurrentSlide", 
          "slideIndex": ${slideshow.currentSlideIndex},
          "step": ${slideshow.step}
          }`)
        break
      case 'setCurrentSlide':
        slideshow.currentSlideIndex = data.slideIndex
        slideshow.$nextTick(() => { slideshow.step = data.step })
        break
      default:
    }
  } catch (e) {
    console.log(`Presenter mode runs into an error: ${e}`)
  }
}

function postMessage (slideshow, message) {
  if (slideshow.childWindow) {
    slideshow.childWindow.postMessage(message, window.location.origin)
  }
  if (slideshow.parentWindow) {
    slideshow.parentWindow.postMessage(message, window.location.origin)
  }
}

function togglePresenterMode (slideshow) {
  if (slideshow.childWindow) {
    slideshow.childWindow.close()
    slideshow.childWindow = null
  } else {
    slideshow.childWindow = window.open(window.location.href, 'eagle-presenter')
    window.addEventListener('message', message(slideshow))
  }
}

export default {
  isPlugin: true,
  init: function (slideshow, config) {
    // presenter can be only enabled by top-level slideshow once
    if (slideshow.embedded || slideshow.inserted || hasPresenter) return

    config = Object.assign({
      presenterModeKey: 'p'
    }, config)

    hasPresenter = true
    slideshow._presenter = true

    if (window.opener && window.opener.location.href === window.location.href) {
      slideshow.parentWindow = window.opener
      postMessage(slideshow, '{"method": "getCurrentSlide"}')
      window.addEventListener('message', message(slideshow))
    }
    window.addEventListener('keydown', keydown(slideshow, config))
    window.addEventListener('click', click(slideshow))
  },
  destroy: function (slideshow, config) {
    if (slideshow._presenter) {
      window.removeEventListener('message', message(slideshow))
      window.removeEventListener('keydown', keydown(slideshow, config))
      window.addEventListener('click', click(slideshow))
    }
  }
}
