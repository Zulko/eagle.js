/*
 * eagle.js v0.5.1
 *
 * @license
 * Copyright 2017-2019, Zulko
 * Released under the ISC License
 */
import throttle from 'lodash.throttle';
import _Object$assign from 'babel-runtime/core-js/object/assign';
import Vue from 'vue';

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
        return function () {
          if (this.$router) this.$router.push('/');
        };
      } },
    onEndExit: { default: function _default() {
        return function () {
          if (this.$router) this.$router.push('/');
        };
      } },
    skip: { default: false },
    backBySlide: { default: false },
    repeat: { default: false }
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
        window.addEventListener('keydown', this.handleKeydown);
      }
      if (this.mouseNavigation) {
        if ('ontouchstart' in window) {
          window.addEventListener('touchstart', this.hanldeClick);
        } else {
          window.addEventListener('click', this.handleClick);
          window.addEventListener('wheel', this.handleWheel);
        }
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
    this.registerPlugins();
    this.afterMounted();
  },
  beforeDestroy: function beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeydown);
    window.removeEventListener('click', this.handleClick);
    window.removeEventListener('touchstart', this.handleClick);
    window.removeEventListener('wheel', this.handleWheel);
    clearInterval(this.timerUpdater);
    this.unregisterPlugins();
  },
  methods: {
    changeDirection: function changeDirection(direction) {
      this.slides.forEach(function (slide) {
        slide.direction = direction;
      });
      this.$root.direction = direction;
    },
    nextStep: function nextStep() {
      this.changeDirection('next');
      var self = this;
      this.$nextTick(function () {
        if (self.step >= self.currentSlide.steps) {
          self.nextSlide();
        } else {
          self.step++;
        }
      });
    },
    previousStep: function previousStep() {
      this.changeDirection('prev');
      var self = this;
      this.$nextTick(function () {
        if (self.step <= 1) {
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
      } else if (this.repeat) {
        this.currentSlideIndex = 1;
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
    handleResize: function handleResize() {
      var self = this;
      throttle(function () {
        var width = 0;
        var height = 0;
        if (self.embedded) {
          width = self.$el.parentElement.clientWidth;
          height = self.$el.parentElement.clientHeight;
        } else {
          width = document.documentElement.clientWidth;
          height = document.documentElement.clientHeight;
        }
        self.$el.style.fontSize = 0.04 * Math.min(height, width) + 'px';
      }, 16)();
    },
    handleClick: function handleClick(evt) {
      if (this.mouseNavigation && this.currentSlide.mouseNavigation && !evt.altKey) {
        var clientX = evt.clientX != null ? evt.clientX : evt.touches[0].clientX;
        if (clientX < 0.25 * document.documentElement.clientWidth) {
          evt.preventDefault();
          this.previousStep();
        } else if (clientX > 0.75 * document.documentElement.clientWidth) {
          evt.preventDefault();
          this.nextStep();
        }
      }
    },
    handleWheel: throttle(function (evt) {
      if (this.mouseNavigation && this.currentSlide.mouseNavigation) {
        evt.preventDefault();
        if (evt.wheelDeltaY > 0 || evt.deltaY > 0) {
          this.nextStep();
        } else if (evt.wheelDeltaY < 0 || evt.deltaY < 0) {
          this.previousStep();
        }
      }
    }, 1000),
    handleKeydown: function handleKeydown(evt) {
      if (this.keyboardNavigation && (this.currentSlide.keyboardNavigation || evt.ctrlKey || evt.metaKey)) {
        if (evt.key === 'ArrowLeft' || evt.key === 'PageUp') {
          this.previousStep();
          evt.preventDefault();
        } else if (evt.key === 'ArrowRight' || evt.key === 'PageDown') {
          this.nextStep();
          evt.preventDefault();
        }
      }
    },
    afterMounted: function afterMounted() {},
    findSlides: function findSlides() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$resetIndex = _ref.resetIndex,
          resetIndex = _ref$resetIndex === undefined ? true : _ref$resetIndex;

      var self = this;
      var i = 0;
      self.slides = [];
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
      if (resetIndex) {
        self.currentSlideIndex = 1;
        self.currentSlide = self.currentSlide === null ? null : self.slides[0];
        self.step = self.startStep;
      }
    },
    updateSlideshowVisibility: function updateSlideshowVisibility(val) {
      if (val) {
        this.$el.style.visibility = 'visible';
      } else {
        this.$el.style.visibility = 'hidden';
      }
    },
    registerPlugins: function registerPlugins() {
      var _this = this;

      Options.plugins.forEach(function (plugin) {
        plugin[0].init(_this, plugin[1]);
      });
    },
    unregisterPlugins: function unregisterPlugins() {
      var _this2 = this;

      Options.plugins.forEach(function (plugin) {
        plugin[0].destroy(_this2, plugin[1]);
      });
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
  name: 'slide',
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

var Transition = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('transition', { attrs: { "enter-active-class": _vm.enter ? 'animated ' + _vm.enter : '', "leave-active-class": _vm.leave ? 'animated ' + _vm.leave : '' } }, [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'eg-transition',
  props: {
    enter: { default: null },
    leave: { default: null }
  }
};

var Modal = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "eg-modal" }, [_c('div', { staticClass: "content" }, [_vm._t("default")], 2)]);
  }, staticRenderFns: [],
  isWidget: true,
  name: 'eg-modal'
};

function randId() {
  return Math.random().toString(36).substr(2, 10);
}

var CodeBlock = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "eg-code-block container" }, [_c('div', { staticClass: "box hljs code-box", attrs: { "id": _vm.id } }, [_c('pre', [_c('code', { class: _vm.lang ? _vm.lang : '', attrs: { "id": _vm.id3 } })])]), _c('div', { staticClass: "box comments-box" }, [_c('pre', [_c('code', { attrs: { "id": _vm.id2 } }, [_vm._t("default")], 2)])])]);
  }, staticRenderFns: [], _scopeId: 'data-v-29468740',
  isWidget: true,
  name: 'eg-code-block',
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
  updated: function updated() {
    this.update();
  },
  methods: {
    update: function update() {
      var codeBlock = document.getElementById(this.id);
      var commentsContent = document.getElementById(this.id2);
      var codeContent = document.getElementById(this.id3);
      codeContent.innerHTML = commentsContent.innerHTML;
      if (this.lang && Options.hljs) {
        Options.hljs.highlightBlock(codeBlock);
      }
    }
  }
};

var CodeComment = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('eg-transition', { attrs: { "enter": _vm.enter, "leave": _vm.leave } }, [_vm.active ? _c('div', { staticClass: "eg-code-comment" }, [_vm.arrow ? _c('span', [_vm._v("←")]) : _vm._e(), _vm._t("default")], 2) : _vm._e()]);
  }, staticRenderFns: [],
  isWidget: true,
  name: 'eg-code-comment',
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
  isWidget: true,
  name: 'eg-toggle',
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
      this.checked = !this.checked;
    }
  },
  watch: {
    checked: function checked(val) {
      this.$emit('input', val);
    }
  }
};

var RadioButton = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "eg-radio" }, [_c('div', { staticClass: "radiobutton", style: { 'font-size': _vm.fontsize }, on: { "click": _vm.select } }, [_c('div', { staticClass: "radio" }), _c('div', { staticClass: "radiodot", class: { checked: _vm.value === _vm.label } })]), _vm._t("default")], 2);
  }, staticRenderFns: [], _scopeId: 'data-v-872b59a6',
  isWidget: true,
  name: 'eg-radio-button',
  props: {
    value: { default: null },
    label: { default: null },
    fontsize: { default: '0.7em' }
  },
  methods: {
    select: function select() {
      this.$emit('input', this.label);
    }
  }
};

var ImageSlide = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('eg-transition', { attrs: { "enter": _vm.enter, "leave": _vm.leave } }, [_vm.active ? _c('div', { staticClass: "eg-slide image-slide", style: _vm.style }) : _vm._e()]);
  }, staticRenderFns: [],
  isWidget: true,
  name: 'eg-image-slide',
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
  isWidget: true,
  name: 'eg-triggered-message',
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

var Timer = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('eg-transition', { attrs: { "enter": "fadeIn", "leave": "fadeOut" } }, [_vm.display ? _c('div', { staticClass: "timer" }) : _vm._e(), _vm._v(_vm._s(_vm.text))]);
  }, staticRenderFns: [], _scopeId: 'data-v-ff6db536',
  isWidget: true,
  name: 'eg-timer',
  props: {
    key: { default: 'T' }
  },
  data: function data() {
    return {
      text: '',
      active: false
    };
  },
  mounted: function mounted() {
    this.updateText();
    window.addEventListener('keydown', this.keydown);
    setInterval(this.updateText, 1000);
  },
  beforeDestroy: function beforeDestroy() {
    window.removeEventListener('keydown', this.keydown);
  },
  methods: {
    toggle: function toggle() {
      this.display = !this.display;
    },
    keydown: function keydown(evt) {
      if (evt.key === this.key) {
        this.active = !this.active;
      }
    },
    updateText: function updateText() {
      var time = this.$parent.timer / 60 + ':' + this.$parent.timer % 60;
      var slide = this.$parent.currentSlideIndex + '/' + this.$parent.slides.length;
      return slide + ' - ' + time;
    }
  }
};

var hasZoom = false;

var updateCoords = function updateCoords(slideshow, config) {
  return function () {
    slideshow._height = document.documentElement.clientHeight;
    slideshow._width = document.documentElement.clientWidth;
    slideshow._center.x = slideshow._width / 2;
    slideshow._center.y = slideshow._height / 2;
    slideshow._boundary.x = slideshow._center.x / config.scale;
    slideshow._boundary.y = slideshow._center.y / config.scale;
  };
};

var magnify = function magnify(slideshow, config) {
  return function (event) {
    if (!event.altKey) return;
    if (document.body.style.transform) {
      document.body.style.transform = '';
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.height = slideshow._height + 'px';
      document.body.style.overflow = 'hidden';
      document.body.style.transition = '0.5s';
      var translateX = slideshow._center.x - event.clientX;
      var translateY = slideshow._center.y - event.clientY;
      translateX = translateX < slideshow._boundary.x ? translateX > -slideshow._boundary.x ? translateX : -slideshow._boundary.x : slideshow._boundary.x;
      translateY = translateY < slideshow._boundary.y ? translateY > -slideshow._boundary.y ? translateY : -slideshow._boundary.y : slideshow._boundary.y;
      document.body.style.transform = 'scale(' + config.scale + ') translate(' + translateX + 'px, ' + translateY + 'px)';
    }
  };
};

var zoom = {
  isPlugin: true,
  init: function init(slideshow, config) {
    if (slideshow.embedded || slideshow.inserted || hasZoom) return;

    config = _Object$assign({
      scale: 2
    }, config);

    hasZoom = true;
    slideshow._zoom = true;

    slideshow._height = document.documentElement.clientHeight;
    slideshow._width = document.documentElement.clientWidth;
    slideshow._center = {
      x: slideshow._width / 2,
      y: slideshow._height / 2
    };
    slideshow._boundary = {
      x: slideshow._center.x / config.scale,
      y: slideshow._center.y / config.scale
    };

    window.addEventListener('resize', updateCoords(slideshow, config));
    window.addEventListener('mousedown', magnify(slideshow, config));
  },
  destroy: function destroy(slideshow, config) {
    if (slideshow._zoom) {
      window.removeEventListener('resize', updateCoords(slideshow, config));
      window.removeEventListener('mousedown', magnify(slideshow, config));
    }
  }
};

var hasPresenter = false;

var keydown = function keydown(slideshow, config) {
  return function (evt) {
    if (slideshow.keyboardNavigation && (slideshow.currentSlide.keyboardNavigation || evt.ctrlKey || evt.metaKey)) {
      if (evt.key === 'ArrowLeft' || evt.key === 'PageUp') {
        postMessage(slideshow, '{"method": "previousStep"}');
      } else if (evt.key === 'ArrowRight' || evt.key === 'PageDown') {
        postMessage(slideshow, '{"method": "nextStep"}');
      } else if (evt.key === config.presenterModeKey && !slideshow.parentWindow) {
        togglePresenterMode(slideshow);
        evt.preventDefault();
      }
    }
  };
};

var click = function click(slideshow) {
  return function (evt) {
    if (slideshow.mouseNavigation && slideshow.currentSlide.mouseNavigation && !evt.altKey) {
      var clientX = evt.clientX != null ? evt.clientX : evt.touches[0].clientX;
      if (clientX < 0.25 * document.documentElement.clientWidth) {
        postMessage(slideshow, '{"method": "previousStep"}');
      } else if (clientX > 0.75 * document.documentElement.clientWidth) {
        postMessage(slideshow, '{"method": "nextStep"}');
      }
    }
  };
};

var message = function message(slideshow) {
  return function (evt) {
    if (evt.origin !== window.location.origin) {
      return void 0;
    }
    try {
      var data = JSON.parse(evt.data);
      switch (data.method) {
        case 'nextStep':
        case 'previousStep':
          slideshow[data.method]();
          break;
        case 'getCurrentSlide':
          postMessage(slideshow, '{\n          "method": "setCurrentSlide", \n          "slideIndex": ' + slideshow.currentSlideIndex + ',\n          "step": ' + slideshow.step + '\n          }');
          break;
        case 'setCurrentSlide':
          slideshow.currentSlideIndex = data.slideIndex;
          slideshow.$nextTick(function () {
            slideshow.step = data.step;
          });
          break;
        default:
      }
    } catch (e) {
      console.log('Presenter mode runs into an error: ' + e);
    }
  };
};

function postMessage(slideshow, message) {
  if (slideshow.childWindow) {
    slideshow.childWindow.postMessage(message, window.location.origin);
  }
  if (slideshow.parentWindow) {
    slideshow.parentWindow.postMessage(message, window.location.origin);
  }
}

function togglePresenterMode(slideshow) {
  if (slideshow.childWindow) {
    slideshow.childWindow.close();
    slideshow.childWindow = null;
  } else {
    slideshow.childWindow = window.open(window.location.href, 'eagle-presenter');
    window.addEventListener('message', message(slideshow));
  }
}

var presenter = {
  isPlugin: true,
  init: function init(slideshow, config) {
    if (slideshow.embedded || slideshow.inserted || hasPresenter) return;

    config = _Object$assign({
      presenterModeKey: 'p'
    }, config);

    hasPresenter = true;
    slideshow._presenter = true;

    if (window.opener && window.opener.location.href === window.location.href) {
      slideshow.parentWindow = window.opener;
      postMessage(slideshow, '{"method": "getCurrentSlide"}');
      window.addEventListener('message', message(slideshow));
    }
    window.addEventListener('keydown', keydown(slideshow, config));
    window.addEventListener('click', click(slideshow));
  },
  destroy: function destroy(slideshow, config) {
    if (slideshow._presenter) {
      window.removeEventListener('message', message(slideshow));
      window.removeEventListener('keydown', keydown(slideshow, config));
      window.addEventListener('click', click(slideshow));
    }
  }
};

var Options = {
  plugins: []
};

var main = {
  install: function install(Vue$$1) {
    Vue$$1.component('slide', Slide);
    Vue$$1.component('eg-transition', Transition);
  },
  use: function use(extension, config) {
    if (extension.isPlugin) {
      Options.plugins.push([extension, config]);
    }
    if (extension.isWidget) {
      Vue.component(extension.name, extension);
    }
  }
};

export default main;
export { Slideshow, Slide, Modal, CodeBlock, CodeComment, Toggle, Transition, RadioButton, ImageSlide, TriggeredMessage, Timer, zoom as Zoom, presenter as Presenter, Options };
