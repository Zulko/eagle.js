<script>
import throttle from 'lodash.throttle'

export default {
  props: {
    firstSlide: {default: 1},
    startStep: {default: 1},
    lastSlide: {default: null},
    embedded: {default: false},
    inserted: {default: false},
    keyboardNavigation: {default: true},
    mouseNavigation: {default: true},
    onStartExit: {default: () => function () { if (this.$router) this.$router.push('/') }},
    onEndExit: {default: () => function () { if (this.$router) this.$router.push('/') }},
    skip: {default: false},
    backBySlide: {default: false},
    repeat: {default: false},
    zoom: {default: true}
  },
  data: function () {
    return {
      currentSlideIndex: 1,
      currentSlide: null,
      step: this.startStep,
      slideshowTimer: 0,
      slideTimer: 0,
      slides: [],
      active: true,
      childWindow: null,
      parentWindow: null
    }
  },
  computed: {
    fullPageStyle: function () {
      var size = 0.04 * Math.min(this.fullPageWidth, this.fullPageHeight)
      return { fontSize: size + 'px' }
    },
    embeddedStyle: function () {
      var size = 0.04 * Math.min(this.parentWidth, this.parentHeight)
      return { fontSize: size + 'px' }
    },
    computedActive: function () {
      return this.slides.some(function (slide) { return slide.active })
    }
  },
  mounted: function () {
    // LIST ALL SLIDES
    this.isSlideshow = true
    var self = this
    this.findSlides()

    if (this.$root.direction === 'prev') {
      this.currentSlideIndex = this.slides.length
    }

    if (!this.inserted) {
      this.currentSlide = this.slides[this.currentSlideIndex - 1]
      this.currentSlide.step = this.startStep

      if (this.zoom && !this.embedded) {
        this.handleZoom()
      }
      // ADD NAVIGATION EVENTS
      if (this.keyboardNavigation) {
        window.addEventListener('keydown', this.keydown)
      }
      if (this.mouseNavigation) {
        if ('ontouchstart' in window) {
          window.addEventListener('touchstart', this.click)
        } else {
          window.addEventListener('click', this.click)
          window.addEventListener('wheel', this.wheel)
        }
      }
      if (this.embedded) {
        this.$el.className += ' embedded-slideshow'
      }
      if (window.opener && window.opener.location.href === window.location.href) {
        this.parentWindow = window.opener
        this.postMessage('{"method": "getCurrentSlide"}')
        window.addEventListener('message', this._message)
      }
    }
    window.addEventListener('resize', this.handleResize)

    // PRELOAD PICTURES IF ANY
    if (this.preloadedImages) {
      setTimeout(function () {
        for (var image in self.preloadedImages) {
          (new Image()).src = self.preloadedImages[image]
        }
      }, 1000)
    }

    // LAST INITIALIZATIONS
    this.handleResize()
    this.timerUpdater = setInterval(function () {
      self.slideshowTimer++
      self.slideTimer++
    }, 1000)
    this.afterMounted()
  },
  beforeDestroy: function () {
    window.removeEventListener('keydown', this.keydown)
    window.removeEventListener('click', this.click)
    window.removeEventListener('touchstart', this.click)
    window.removeEventListener('wheel', this.wheel)
    this.handleZoom(true)
    clearInterval(this.timerUpdater)
  },
  methods: {
    nextStep: function (fromMessage) {
      this.slides.forEach(function (slide) {
        slide.direction = 'next'
      })
      this.$root.direction = 'next'
      var self = this
      this.$nextTick(function () {
        if (self.step >= self.currentSlide.steps) {
          self.nextSlide()
        } else {
          self.step++
        }
      })
      if (!fromMessage) {
        this.postMessage('{"method": "nextStep"}')
      }
    },
    previousStep: function (fromMessage) {
      this.slides.forEach(function (slide) {
        slide.direction = 'prev'
      })
      this.$root.direction = 'prev'
      var self = this
      this.$nextTick(function () {
        if (self.step <= 1) {
          self.previousSlide()
        } else {
          self.step--
        }
      })
      if (!fromMessage) {
        this.postMessage('{"method": "previousStep"}')
      }
    },
    nextSlide: function () {
      var nextSlideIndex = this.currentSlideIndex + 1
      while ((nextSlideIndex < this.slides.length + 1) &&
             (this.slides[nextSlideIndex - 1].skip ||
              this.slides[nextSlideIndex - 1].$parent.skip)) {
        nextSlideIndex++
      }
      if (nextSlideIndex < this.slides.length + 1) {
        this.currentSlideIndex = nextSlideIndex
      } else if (this.repeat) {
        this.currentSlideIndex = 1
      } else if (!this.embedded) {
        this.onEndExit()
      }
    },
    previousSlide: function () {
      var previousSlideIndex = this.currentSlideIndex - 1
      while ((previousSlideIndex >= 1) &&
             (this.slides[previousSlideIndex - 1].skip ||
              (this.slides[previousSlideIndex - 1].$parent.skip))) {
        previousSlideIndex--
      }
      if (previousSlideIndex >= 1) {
        this.currentSlideIndex = previousSlideIndex
      } else if (!this.embedded) {
        this.onStartExit()
      }
    },
    handleResize: function () {
      var self = this
      throttle(function () {
        var width = 0
        var height = 0
        if (self.embedded) {
          width = self.$el.parentElement.clientWidth
          height = self.$el.parentElement.clientHeight
        } else {
          width = document.documentElement.clientWidth
          height = document.documentElement.clientHeight
        }
        self.$el.style.fontSize = (0.04 * Math.min(height, width)) + 'px'
      }, 16)()
    },
    handleZoom: function (remove) {
      if (remove) {
        window.removeEventListener('resize', updateCoords)
        window.removeEventListener('mousedown', magnify)
        return
      }

      const SCALE = 2
      let height = document.documentElement.clientHeight
      let width = document.documentElement.clientWidth
      const center = {
        x: width / 2,
        y: height / 2
      }
      const boundary = {
        x: center.x / SCALE,
        y: center.y / SCALE
      }

      window.addEventListener('resize', updateCoords)
      window.addEventListener('mousedown', magnify)

      function updateCoords () {
        height = document.documentElement.clientHeight
        width = document.documentElement.clientWidth
        center.x = width / 2
        center.y = height / 2
        boundary.x = center.x / SCALE
        boundary.y = center.y / SCALE
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
          document.body.style.transform = `scale(${SCALE}) translate(${translateX}px, ${translateY}px)`
        }
      }
    },
    click: function (evt) {
      if (this.mouseNavigation && this.currentSlide.mouseNavigation && !evt.altKey) {
        var clientX = evt.clientX != null ? evt.clientX : evt.touches[0].clientX
        if (clientX < (0.25 * document.documentElement.clientWidth)) {
          evt.preventDefault()
          this.previousStep()
        } else if (clientX > (0.75 * document.documentElement.clientWidth)) {
          evt.preventDefault()
          this.nextStep()
        }
      }
    },
    wheel: throttle(function (evt) {
      if (this.mouseNavigation && this.currentSlide.mouseNavigation) {
        evt.preventDefault()
        if ((evt.wheelDeltaY > 0) || (evt.deltaY > 0)) {
          this.nextStep()
        } else if ((evt.wheelDeltaY < 0) || (evt.deltaY < 0)) {
          this.previousStep()
        }
      }
    }, 1000),
    keydown: function (evt) {
      if (this.keyboardNavigation &&
          (this.currentSlide.keyboardNavigation || evt.ctrlKey || evt.metaKey)) {
        if (evt.key === 'ArrowLeft' || evt.key === 'PageUp') {
          this.previousStep()
          evt.preventDefault()
        } else if (evt.key === 'ArrowRight' || evt.key === 'PageDown') {
          this.nextStep()
          evt.preventDefault()
        } else if (evt.key === 'p' && !this.parentWindow) {
          this.togglePresenterMode()
          evt.preventDefault()
        }
      }
    },
    _message: function (evt) {
      if (evt.origin !== window.location.origin) {
        return void 0
      }
      try {
        var data = JSON.parse(evt.data)
        switch (data.method) {
          case 'nextStep':
          case 'previousStep':
            this[data.method](true)
            break
          case 'getCurrentSlide':
            this.postMessage(`{
              "method": "setCurrentSlide", 
              "slideIndex": ${this.currentSlideIndex},
              "step": ${this.step}
              }`)
            break
          case 'setCurrentSlide':
            this.currentSlideIndex = data.slideIndex
            this.$nextTick(() => { this.step = data.step })
            break
          default:
        }
      } catch (e) {}
    },
    afterMounted: function () {
      // useful in some instances
    },
    findSlides: function () {
      var self = this
      var i = 0
      this.$children.forEach(function (el) {
        if (el.isSlide) {
          i++
          if ((i >= self.firstSlide) && ((!self.lastSlide) || (i <= self.lastSlide))) {
            self.slides.push(el)
          }
        } else if (el.isSlideshow) {
          el.active = false
          el.slides.forEach(function (slide) {
            i++
            slide.active = false
            if ((i >= self.firstSlide) &&
                (!self.lastSlide || (i <= self.lastSlide))) {
              self.slides.push(slide)
            }
          })
        }
      })
    },
    updateSlideshowVisibility: function (val) {
      if (val) {
        this.$el.style.visibility = 'visible'
      } else {
        this.$el.style.visibility = 'hidden'
      }
    },
    postMessage: function (message) {
      if (this.childWindow) {
        this.childWindow.postMessage(message, window.location.origin)
      }
      if (this.parentWindow) {
        this.parentWindow.postMessage(message, window.location.origin)
      }
    },
    togglePresenterMode: function () {
      if (this.childWindow) {
        this.childWindow.close()
        this.childWindow = null
      } else {
        this.childWindow = window.open(window.location.href, 'eagle-presenter')
        window.addEventListener('message', this._message)
      }
    }
  },
  watch: {
    currentSlide: function (newSlide, oldSlide) {
      if (oldSlide) {
        oldSlide.active = false
        if ((oldSlide.$parent !== newSlide.$parent) &&
            (oldSlide.$parent !== this)) {
          oldSlide.$parent.active = false
        }
      }
      this.slideTimer = 0
      if (this.backBySlide || newSlide.direction === 'next') {
        this.step = 1
        newSlide.step = 1
        newSlide.$parent.step = 1
      } else if (newSlide.direction === 'prev') {
        this.step = newSlide.steps
        newSlide.step = newSlide.steps
        newSlide.$parent.step = newSlide.steps
      }
      newSlide.active = true
      newSlide.$parent.active = true
    },
    currentSlideIndex: function (index) {
      this.currentSlide = this.slides[index - 1]
    },
    step: function (val) {
      if (this.currentSlide) {
        this.currentSlide.step = val
        this.currentSlide.$parent.step = val
      }
    },
    active: 'updateSlideshowVisibility',
    computedActive: 'updateSlideshowVisibility'
  }

}
</script>

<style lang="sass">
@import '../themes/base.scss';
</style>
