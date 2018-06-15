<template lang='pug'>
eg-transition(:enter='enterTransition', :leave='leaveTransition')
  .eg-slide(v-if='active')
    .eg-slide-content
      slot
</template>

<script>
export default {
  name: 'slide',
  props: {
    skip: {default: false},
    enter: {default: null},
    enterPrev: {default: null},
    enterNext: {default: null},
    leave: {default: null},
    leavePrev: {default: null},
    leaveNext: {default: null},
    steps: {default: 1},
    mouseNavigation: {default: true},
    keyboardNavigation: {default: true}
  },
  data: function () {
    return {
      step: 1,
      active: false,
      isSlide: true,
      slideTimer: 0,
      direction: 'next',
      transitions: {
        next: {
          enter: this.enterNext || this.enter,
          leave: this.leaveNext || this.leave
        },
        prev: {
          enter: this.enterPrev || this.enter,
          leave: this.leavePrev || this.leave
        }
      }
    }
  },
  computed: {
    enterTransition: function () {
      return this.transitions[this.direction].enter
    },
    leaveTransition: function () {
      return this.transitions[this.direction].leave
    }
  },
  methods: {
    nextStep: function () {
      if (this.step === this.steps) {
        this.$parent.nextSlide()
      } else {
        this.step++
      }
    },
    previousStep: function () {
      if (this.step === 1) {
        this.$parent.previousSlide()
      } else {
        this.step--
      }
    }
  },
  watch: {
    step: function (val) {
      this.$parent.step = val
    },
    active: function (val) {
      var self = this
      if (val) {
        this.slideTimer = 0
        this.timerUpdater = setInterval(function () {
          self.slideTimer++
        }, 1000)
      } else {
        clearInterval(this.timerUpdater)
      }
    }
  }
}
</script>
