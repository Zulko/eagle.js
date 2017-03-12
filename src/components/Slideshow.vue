<script>
export default {
  props: {
    firstSlide: {default: 1},
    startStep: {default: 1},
    lastSlide: {default: null},
    embedded: {default: false},
    inserted: {default: false},
    keyboardNavigation: {default: true},
    mouseNavigation: {default: true},
    onStartExit: {default: () => function () { this.$router.push('/') }},
    onEndExit: {default: () => function () { this.$router.push('/') }},
    skip: {default: false}
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
    active: function () {
      return this.slides.some(function (slide) { return slide.active })
    }
  },
  mounted: function () {
    // LIST ALL SLIDES
    this.isSlideshow = true
    var self = this
    this.findSlides()


    if (!this.inserted) {
      this.currentSlide = this.slides[this.currentSlideIndex - 1]
      this.currentSlide.step = this.startStep
      // ADD NAVIGATION EVENTS

      if (this.keyboardNavigation) {
        window.addEventListener('keydown', this.keydown)
      }
      if (this.mouseNavigation) {
        window.addEventListener('click', this.click)
        window.addEventListener('wheel', this.wheel)
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
      self.slideshowTimer++;
      self.slideTimer++;
    }, 1000)
    this.afterMounted()
  },
  beforeDestroy: function () {
    window.removeEventListener('keydown', this.keydown)
    window.removeEventListener('click', this.click)
    window.removeEventListener('wheel', this.wheel)
    clearInterval(this.slideshowTimerUpdater)
  },
  methods: {
    nextStep: function () {
      if (this.step === this.currentSlide.steps) {
        this.nextSlide()
      } else {
        this.step++
      }
    },
    previousStep: function () {
      if (this.step === 1) {
        this.previousSlide()
      } else {
        this.step--
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
    handleResize: function (event) {
      var width = 0
      var height = 0
      if (this.embedded) {
        width = this.$el.parentElement.clientWidth
        height = this.$el.parentElement.clientHeight
      } else {
        width = document.documentElement.clientWidth
        height = document.documentElement.clientHeight
      }
      this.$el.style.fontSize = (0.04 * Math.min(height, width)) + 'px'
    },
    click: function (evt) {
      if (this.mouseNavigation && this.currentSlide.mouseNavigation) {

        if (evt.clientX < (0.1 * document.documentElement.clientWidth)) {
          evt.preventDefault()
          this.previousStep()
        } else if (evt.clientX > (0.9 * document.documentElement.clientWidth)){
          evt.preventDefault()
          this.nextStep()
        }

      }
    },
    wheel: function (evt) {
      if (this.mouseNavigation && this.currentSlide.mouseNavigation) {
        evt.preventDefault()
        if ((evt.wheelDeltaY > 0) || (evt.deltaY > 0)) {
          this.nextStep()
        } else if ((evt.wheelDeltaY < 0) || (evt.deltaY < 0)){
          this.previousStep()
        }
      }
    },
    keydown: function (evt) {
      if (this.keyboardNavigation &&
          (this.currentSlide.keyboardNavigation || evt.ctrlKey)) {
        evt.preventDefault()
        if (evt.key === 'ArrowLeft') {
          this.previousStep()
        } else if (evt.key === 'ArrowRight') {
          this.nextStep()
        }
      }
    },
    afterMounted: function (evt) {
      //useful in some instances
      return
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
      this.step = 1
      newSlide.step = 1
      newSlide.$parent.step = 1
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
    active: function (val) {
      if (val) {
        this.$el.style.visibility = 'visible'
      } else {
        this.$el.style.visibility = 'hidden'
      }
    }
  }

}
</script>
