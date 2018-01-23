/*
 * eagle.js v0.1.3
 *
 * @license
 * Copyright 2017, Zulko
 * Released under the ISC License
 */
import { throttle } from 'lodash';
import hljs from 'highlight.js';

var Slideshow = {
  props: {
    firstSlide: { default: 1 },
    startStep: { default: 1 },
    lastSlide: { default: null },
    embedded: { default: false },
    inserted: { default: false },
    keyboardNavigation: { default: true },
    mouseNavigation: { default: true },
    onStartExit: { default: function _default() {
        return function () {};
      } },
    onEndExit: { default: function _default() {
        return function () {};
      } },
    skip: { default: false },
    backBySlide: { default: false }
  },
  data: function data() {
    return {
      currentSlideIndex: 1,
      currentSlide: null,
      step: this.startStep,
      slideshowTimer: 0,
      slideTimer: 0,
      slides: [],
      active: true
    };
  },
  computed: {
    fullPageStyle: function fullPageStyle() {
      var size = 0.04 * Math.min(this.fullPageWidth, this.fullPageHeight);
      return { fontSize: size + 'px' };
    },
    embeddedStyle: function embeddedStyle() {
      var size = 0.04 * Math.min(this.parentWidth, this.parentHeight);
      return { fontSize: size + 'px' };
    },
    computedActive: function computedActive() {
      return this.slides.some(function (slide) {
        return slide.active;
      });
    }
  },
  mounted: function mounted() {
    this.isSlideshow = true;
    var self = this;
    this.findSlides();

    if (this.$root.direction === 'prev') {
      this.currentSlideIndex = this.slides.length;
    }

    if (!this.inserted) {
      this.currentSlide = this.slides[this.currentSlideIndex - 1];
      this.currentSlide.step = this.startStep;

      if (this.keyboardNavigation) {
        window.addEventListener('keydown', this.keydown);
      }
      if (this.mouseNavigation) {
        window.addEventListener('click', this.click);
        window.addEventListener('wheel', this.wheel);
      }
      if (this.embedded) {
        this.$el.className += ' embedded-slideshow';
      }
    }
    window.addEventListener('resize', this.handleResize);

    if (this.preloadedImages) {
      setTimeout(function () {
        for (var image in self.preloadedImages) {
          new Image().src = self.preloadedImages[image];
        }
      }, 1000);
    }

    this.handleResize();
    this.timerUpdater = setInterval(function () {
      self.slideshowTimer++;
      self.slideTimer++;
    }, 1000);
    this.afterMounted();
  },
  beforeDestroy: function beforeDestroy() {
    window.removeEventListener('keydown', this.keydown);
    window.removeEventListener('click', this.click);
    window.removeEventListener('wheel', this.wheel);
    clearInterval(this.timerUpdater);
  },
  methods: {
    nextStep: function nextStep() {
      this.slides.forEach(function (slide) {
        slide.direction = 'next';
      });
      this.$root.direction = 'next';
      var self = this;
      this.$nextTick(function () {
        if (self.step === self.currentSlide.steps) {
          self.nextSlide();
        } else {
          self.step++;
        }
      });
    },
    previousStep: function previousStep() {
      this.slides.forEach(function (slide) {
        slide.direction = 'prev';
      });
      this.$root.direction = 'prev';
      var self = this;
      this.$nextTick(function () {
        if (self.step === 1) {
          self.previousSlide();
        } else {
          self.step--;
        }
      });
    },
    nextSlide: function nextSlide() {
      var nextSlideIndex = this.currentSlideIndex + 1;
      while (nextSlideIndex < this.slides.length + 1 && (this.slides[nextSlideIndex - 1].skip || this.slides[nextSlideIndex - 1].$parent.skip)) {
        nextSlideIndex++;
      }
      if (nextSlideIndex < this.slides.length + 1) {
        this.currentSlideIndex = nextSlideIndex;
      } else if (!this.embedded) {
        this.onEndExit();
      }
    },
    previousSlide: function previousSlide() {
      var previousSlideIndex = this.currentSlideIndex - 1;
      while (previousSlideIndex >= 1 && (this.slides[previousSlideIndex - 1].skip || this.slides[previousSlideIndex - 1].$parent.skip)) {
        previousSlideIndex--;
      }
      if (previousSlideIndex >= 1) {
        this.currentSlideIndex = previousSlideIndex;
      } else if (!this.embedded) {
        this.onStartExit();
      }
    },
    handleResize: throttle(function (event) {
      var width = 0;
      var height = 0;
      if (this.embedded) {
        width = this.$el.parentElement.clientWidth;
        height = this.$el.parentElement.clientHeight;
      } else {
        width = document.documentElement.clientWidth;
        height = document.documentElement.clientHeight;
      }
      this.$el.style.fontSize = 0.04 * Math.min(height, width) + 'px';
    }, 16),
    click: function click(evt) {
      if (this.mouseNavigation && this.currentSlide.mouseNavigation) {
        if (evt.clientX < 0.25 * document.documentElement.clientWidth) {
          evt.preventDefault();
          this.previousStep();
        } else if (evt.clientX > 0.75 * document.documentElement.clientWidth) {
          evt.preventDefault();
          this.nextStep();
        }
      }
    },
    wheel: throttle(function (evt) {
      if (this.mouseNavigation && this.currentSlide.mouseNavigation) {
        evt.preventDefault();
        if (evt.wheelDeltaY > 0 || evt.deltaY > 0) {
          this.nextStep();
        } else if (evt.wheelDeltaY < 0 || evt.deltaY < 0) {
          this.previousStep();
        }
      }
    }, 1000),
    keydown: function keydown(evt) {
      if (this.keyboardNavigation && (this.currentSlide.keyboardNavigation || evt.ctrlKey || evt.metaKey)) {
        evt.preventDefault();
        if (evt.key === 'ArrowLeft') {
          this.previousStep();
        } else if (evt.key === 'ArrowRight') {
          this.nextStep();
        }
      }
    },
    afterMounted: function afterMounted(evt) {
      return;
    },
    findSlides: function findSlides() {
      var self = this;
      var i = 0;
      this.$children.forEach(function (el) {
        if (el.isSlide) {
          i++;
          if (i >= self.firstSlide && (!self.lastSlide || i <= self.lastSlide)) {
            self.slides.push(el);
          }
        } else if (el.isSlideshow) {
          el.active = false;
          el.slides.forEach(function (slide) {
            i++;
            slide.active = false;
            if (i >= self.firstSlide && (!self.lastSlide || i <= self.lastSlide)) {
              self.slides.push(slide);
            }
          });
        }
      });
    },
    updateSlideshowVisibility: function updateSlideshowVisibility(val) {
      if (val) {
        this.$el.style.visibility = 'visible';
      } else {
        this.$el.style.visibility = 'hidden';
      }
    }
  },
  watch: {
    currentSlide: function currentSlide(newSlide, oldSlide) {
      if (oldSlide) {
        oldSlide.active = false;
        if (oldSlide.$parent !== newSlide.$parent && oldSlide.$parent !== this) {
          oldSlide.$parent.active = false;
        }
      }
      this.slideTimer = 0;
      if (this.backBySlide || newSlide.direction === 'next') {
        this.step = 1;
        newSlide.step = 1;
        newSlide.$parent.step = 1;
      } else if (newSlide.direction === 'prev') {
        this.step = newSlide.steps;
        newSlide.step = newSlide.steps;
        newSlide.$parent.step = newSlide.steps;
      }
      newSlide.active = true;
      newSlide.$parent.active = true;
    },
    currentSlideIndex: function currentSlideIndex(index) {
      this.currentSlide = this.slides[index - 1];
    },
    step: function step(val) {
      if (this.currentSlide) {
        this.currentSlide.step = val;
        this.currentSlide.$parent.step = val;
      }
    },
    active: 'updateSlideshowVisibility',
    computedActive: 'updateSlideshowVisibility'
  }

};

var Slide = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('eg-transition', { attrs: { "enter": _vm.enterTransition, "leave": _vm.leaveTransition } }, [_vm.active ? _c('div', { staticClass: "eg-slide" }, [_c('div', { staticClass: "eg-slide-content" }, [_vm._t("default")], 2)]) : _vm._e()]);
  }, staticRenderFns: [],
  props: {
    skip: { default: false },
    enter: { default: null },
    enterPrev: { default: null },
    enterNext: { default: null },
    leave: { default: null },
    leavePrev: { default: null },
    leaveNext: { default: null },
    steps: { default: 1 },
    mouseNavigation: { default: true },
    keyboardNavigation: { default: true }
  },
  data: function data() {
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
    };
  },
  computed: {
    enterTransition: function enterTransition() {
      return this.transitions[this.direction].enter;
    },
    leaveTransition: function leaveTransition() {
      return this.transitions[this.direction].leave;
    }
  },
  mounted: function mounted() {},
  methods: {
    nextStep: function nextStep() {
      if (this.step === this.steps) {
        this.$parent.nextSlide();
      } else {
        this.step++;
      }
    },
    previousStep: function previousStep() {
      if (this.step === 1) {
        this.$parent.previousSlide();
      } else {
        this.step--;
      }
    }
  },
  watch: {
    step: function step(val) {
      this.$parent.step = val;
    },
    active: function active(val) {
      var self = this;
      if (val) {
        this.slideTimer = 0;
        this.timerUpdater = setInterval(function () {
          self.slideTimer++;
        }, 1000);
      } else {
        clearInterval(this.timerUpdater);
      }
    }
  }
};

var Modal = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "eg-modal" }, [_c('div', { staticClass: "content" }, [_vm._t("default")], 2)]);
  }, staticRenderFns: []
};

function randId() {
  return Math.random().toString(36).substr(2, 10);
}
var CodeBlock = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "eg-code-block container" }, [_c('div', { staticClass: "box hljs code-box", attrs: { "id": _vm.id } }, [_c('pre', [_c('code', { class: _vm.lang ? _vm.lang : '', attrs: { "id": _vm.id3 } })])]), _c('div', { staticClass: "box comments-box" }, [_c('pre', [_c('code', { attrs: { "id": _vm.id2 } }, [_vm._t("default")], 2)])])]);
  }, staticRenderFns: [], _scopeId: 'data-v-29468740',
  props: {
    id: { default: function _default() {
        return randId();
      } },
    id2: { default: function _default() {
        return randId();
      } },
    id3: { default: function _default() {
        return randId();
      } },
    lang: { default: null }
  },
  mounted: function mounted() {
    this.update();
  },
  methods: {
    update: function update() {
      var codeBlock = document.getElementById(this.id);
      var commentsContent = document.getElementById(this.id2);
      var codeContent = document.getElementById(this.id3);
      codeContent.innerHTML = commentsContent.innerHTML;
      console.log(this.id);
      if (this.lang) {
        hljs.highlightBlock(codeBlock);
      }
    }
  }
};

var CodeComment = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('eg-transition', { attrs: { "enter": _vm.enter, "leave": _vm.leave } }, [_vm.active ? _c('div', { staticClass: "eg-code-comment" }, [_vm.arrow ? _c('span', [_vm._v("←")]) : _vm._e(), _vm._t("default")], 2) : _vm._e()]);
  }, staticRenderFns: [],
  props: {
    enter: { default: null },
    leave: { default: null },
    active: { default: true },
    arrow: { default: true }
  }
};

var Toggle = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "eg-switch" }, [_c('div', { staticClass: "switch", style: { 'font-size': _vm.fontsize }, on: { "click": _vm.toggle } }, [_c('input', { attrs: { "type": "checkbox" }, domProps: { "checked": _vm.checked } }), _c('div', { staticClass: "slider", class: { checked: _vm.checked } }), _c('div', { staticClass: "sliderdot", class: { checked: _vm.checked } })]), _c('span', { class: { unchecked: !_vm.checked } }, [_vm._t("default")], 2)]);
  }, staticRenderFns: [], _scopeId: 'data-v-14b66238',
  props: {
    value: { default: true },
    fontsize: { default: '0.8em' }
  },
  data: function data() {
    return {
      checked: this.value
    };
  },
  methods: {
    toggle: function toggle() {
      console.log(this.checked);
      this.checked = !this.checked;
    }
  },
  watch: {
    checked: function checked(val) {
      this.$emit('input', val);
    }
  }
};

var AnimatedTransition = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('transition', { attrs: { "enter-active-class": _vm.enter ? 'animated ' + _vm.enter : '', "leave-active-class": _vm.leave ? 'animated ' + _vm.leave : '' } }, [_vm._t("default")], 2);
  }, staticRenderFns: [],
  props: {
    enter: { default: null },
    leave: { default: null }
  }
};

var RadioButton = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "eg-radio" }, [_c('div', { staticClass: "radiobutton", style: { 'font-size': _vm.fontsize }, on: { "click": _vm.select } }, [_c('div', { staticClass: "radio" }), _c('div', { staticClass: "radiodot", class: { checked: _vm.value === _vm.label } })]), _vm._t("default")], 2);
  }, staticRenderFns: [], _scopeId: 'data-v-872b59a6',
  props: {
    value: { default: null },
    label: { default: null },
    fontsize: { default: '0.7em' }
  },
  methods: {
    select: function select() {
      this.$emit('input', this.label);
      console.log(this.label, this.value, this.value === this.label);
    }
  }
};

var ImageSlide = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('eg-transition', { attrs: { "enter": _vm.enter, "leave": _vm.leave } }, [_vm.active ? _c('div', { staticClass: "eg-slide image-slide", style: _vm.style }) : _vm._e()]);
  }, staticRenderFns: [],
  mixins: [Slide],
  props: {
    url: { default: 'https://i.imgur.com/P7iyH.png' },
    enter: { default: null },
    leave: { default: null }
  },
  computed: {
    style: function style() {
      return {
        'background-image': 'url(' + this.url + ')',
        'background-position': 'center center',
        'background-size': 'cover'
      };
    }
  }
};

var TriggeredMessage = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('eg-transition', { attrs: { "enter": _vm.enter, "leave": _vm.leave } }, [_vm.active ? _c('div', { staticClass: "eg-triggered-message", style: _vm.style }, [_vm._t("default")], 2) : _vm._e()]);
  }, staticRenderFns: [],
  props: {
    enter: { default: 'slideInLeft' },
    leave: { default: 'slideOutLeft' },
    trigger: { default: false },
    position: { default: 'left top' },
    duration: { default: 3 }
  },
  data: function data() {
    return {
      active: false,
      timeout: null,
      style: {
        top: this.position.indexOf('top') >= 0 ? '0%' : 'none',
        bottom: this.position.indexOf('bottom') >= 0 ? '0%' : 'none',
        left: this.position.indexOf('left') >= 0 ? '0%' : 'none',
        right: this.position.indexOf('right') >= 0 ? '0%' : 'none'
      }
    };
  },
  watch: {
    trigger: function trigger(val, oldVal) {
      if (!oldVal && val) {
        this.active = true;
        var self = this;
        this.timeout = setTimeout(function () {
          self.active = false;
        }, 1000 * this.duration);
      } else if (oldVal && !val) {
        this.active = false;
        clearTimeout(this.timeout);
      }
    }
  }
};

var main = {
  slideshow: Slideshow,
  slide: Slide,
  install: function install(Vue) {
    Vue.component('slideshow', Slideshow);
    Vue.component('slide', Slide);
    Vue.component('image-slide', ImageSlide);

    Vue.component('eg-modal', Modal);
    Vue.component('eg-transition', AnimatedTransition);
    Vue.component('eg-code-block', CodeBlock);
    Vue.component('eg-code-comment', CodeComment);
    Vue.component('eg-toggle', Toggle);
    Vue.component('eg-radio', RadioButton);
    Vue.component('eg-triggered-message', TriggeredMessage);
  }
};

export default main;
