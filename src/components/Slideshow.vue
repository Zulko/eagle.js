<script>
import throttle from 'lodash.throttle'
import { Options } from '../main.js'

const PREV = 'prev'
const NEXT = 'next'

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
    repeat: {default: false}
  },
  data: function () {
    return {
      currentSlideIndex: 1,
      currentSlide: null,
      step: this.startStep,
      slideshowTimer: 0,
      slideTimer: 0,
      slides: [],
      active: true
    }
  },
  computed: {
    computedActive: function () {
      return this.slides.some(function (slide) { return slide.active })
    }
  },
  mounted: function () {
    // LIST ALL SLIDES
    this.isSlideshow = true
    var self = this
    this.findSlides()

    if (this.$root.direction === PREV) {
      this.currentSlideIndex = this.slides.length
    }

    if (!this.inserted) {
      this.currentSlide = this.slides[this.currentSlideIndex - 1]
      this.currentSlide.step = this.startStep

      // ADD NAVIGATION EVENTS
      if (this.keyboardNavigation) {
        window.addEventListener('keydown', this.handleKeydown)
      }
      if (this.mouseNavigation) {
        if ('ontouchstart' in window) {
          window.addEventListener('touchstart', this.handleClick)
        } else {
          window.addEventListener('click', this.handleClick)
          window.addEventListener('wheel', this.handleWheel)
        }
      }
      if (this.embedded) {
        this.$el.className += ' embedded-slideshow'
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
    this.registerPlugins()
    this.afterMounted()
  },
  beforeDestroy: function () {
    window.removeEventListener('keydown', this.handleKeydown)
    window.removeEventListener('click', this.handleClick)
    window.removeEventListener('touchstart', this.handleClick)
    window.removeEventListener('wheel', this.handleWheel)
    clearInterval(this.timerUpdater)
    this.unregisterPlugins()
  },
  methods: {
    changeDirection: function (direction) {
      this.slides.forEach(function (slide) {
        slide.direction = direction
      })
      this.$root.direction = direction
    },
    nextStep: function () {
      this.changeDirection(NEXT)
      var self = this
      this.$nextTick(function () {
        if (self.step >= self.currentSlide.steps) {
          self.nextSlide()
        } else {
          self.step++
        }
      })
    },
    previousStep: function () {
      this.changeDirection(PREV)
      var self = this
      this.$nextTick(function () {
        if (self.step <= 1) {
          self.previousSlide()
        } else {
          self.step--
        }
      })
    },
    nextSlide: function () {
      this.changeDirection(NEXT)
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
      this.changeDirection(PREV)
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
    handleClick: function (evt) {
      var noHref = evt.target['href'] === undefined
      if (this.mouseNavigation && this.currentSlide.mouseNavigation && noHref && !evt.altKey) {
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
    handleWheel: throttle(function (evt) {
      if (this.mouseNavigation && this.currentSlide.mouseNavigation) {
        evt.preventDefault()
        if ((evt.wheelDeltaY > 0) || (evt.deltaY > 0)) {
          this.nextStep()
        } else if ((evt.wheelDeltaY < 0) || (evt.deltaY < 0)) {
          this.previousStep()
        }
      }
    }, 1000),
    handleKeydown: function (evt) {
      if (this.keyboardNavigation &&
          (this.currentSlide.keyboardNavigation || evt.ctrlKey || evt.metaKey)) {
        if (evt.key === 'ArrowLeft' || evt.key === 'PageUp') {
          this.previousStep()
          evt.preventDefault()
        } else if (evt.key === 'ArrowRight' || evt.key === 'PageDown') {
          this.nextStep()
          evt.preventDefault()
        }
      }
    },
    afterMounted: function () {
      // useful in some instances
    },
    findSlides: function ({resetIndex = true} = {}) {
      var self = this
      var i = 0
      self.slides = []
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
      if (resetIndex) {
        self.currentSlideIndex = 1
        self.currentSlide = self.currentSlide === null ? null : self.slides[0]
        self.step = self.startStep
      }
    },
    updateSlideshowVisibility: function (val) {
      if (val) {
        this.$el.style.visibility = 'visible'
      } else {
        this.$el.style.visibility = 'hidden'
      }
    },
    registerPlugins: function () {
      Options.plugins.forEach(plugin => {
        plugin[0].init(this, plugin[1])
      })
    },
    unregisterPlugins: function () {
      Options.plugins.forEach(plugin => {
        plugin[0].destroy(this, plugin[1])
      })
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
      if (this.backBySlide || newSlide.direction === NEXT) {
        this.step = 1
        newSlide.step = 1
        newSlide.$parent.step = 1
      } else if (newSlide.direction === PREV) {
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

<style lang="scss">
@import '../themes/base.scss';
</style>
