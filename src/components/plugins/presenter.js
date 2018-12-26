let slideshow, childWindow, parentWindow
// default config
let presenterModeKey = 'p'

function keydown (evt) {
  if (slideshow.keyboardNavigation &&
      (slideshow.currentSlide.keyboardNavigation || evt.ctrlKey || evt.metaKey)) {
    if (evt.key === 'ArrowLeft' || evt.key === 'PageUp') {
      postMessage('{"method": "previousStep"}')
    } else if (evt.key === 'ArrowRight' || evt.key === 'PageDown') {
      postMessage('{"method": "nextStep"}')
    } else if (evt.key === presenterModeKey && !this.parentWindow) {
      togglePresenterMode()
      evt.preventDefault()
    }
  }
}

function click (evt) {
  if (slideshow.mouseNavigation && slideshow.currentSlide.mouseNavigation && !evt.altKey) {
    const clientX = evt.clientX != null ? evt.clientX : evt.touches[0].clientX
    if (clientX < (0.25 * document.documentElement.clientWidth)) {
      postMessage('{"method": "previousStep"}')
    } else if (clientX > (0.75 * document.documentElement.clientWidth)) {
      postMessage('{"method": "nextStep"}')
    }
  }
}

function postMessage (message) {
  if (childWindow) {
    childWindow.postMessage(message, window.location.origin)
  }
  if (parentWindow) {
    parentWindow.postMessage(message, window.location.origin)
  }
}

function togglePresenterMode () {
  if (childWindow) {
    childWindow.close()
    childWindow = null
  } else {
    childWindow = window.open(window.location.href, 'eagle-presenter')
    window.addEventListener('message', message)
  }
}

function message (evt) {
  if (evt.origin !== window.location.origin) {
    return void 0
  }
  try {
    var data = JSON.parse(evt.data)
    switch (data.method) {
      case 'nextStep':
      case 'previousStep':
        slideshow[data.method]()
        break
      case 'getCurrentSlide':
        postMessage(`{
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
  } catch (e) {}
}

export default {
  isPlugin: true,
  init: function (s) {
    slideshow = s
    if (!slideshow.inserted) {
      if (window.opener && window.opener.location.href === window.location.href) {
        parentWindow = window.opener
        postMessage('{"method": "getCurrentSlide"}')
        window.addEventListener('message', message)
      }
      window.addEventListener('keydown', keydown)
      window.addEventListener('click', click)
    }
  },
  destroy: function () {
    window.removeEventListener('message', message)
    window.removeEventListener('keydown', keydown)
    window.addEventListener('click', click)
  }
}
