/*
 * eagle.js v0.6.0
 *
 * @license
 * Copyright 2017-2019, Zulko
 * Released under the ISC License
 */
import Vue from 'vue';
import throttle from 'lodash.throttle';

var script = {
  props: {
    firstSlide: {
      "default": 1
    },
    startStep: {
      "default": 1
    },
    lastSlide: {
      "default": null
    },
    embedded: {
      "default": false
    },
    inserted: {
      "default": false
    },
    keyboardNavigation: {
      "default": true
    },
    mouseNavigation: {
      "default": true
    },
    onStartExit: {
      "default": function _default() {
        return function () {
          if (this.$router) this.$router.push('/');
        };
      }
    },
    onEndExit: {
      "default": function _default() {
        return function () {
          if (this.$router) this.$router.push('/');
        };
      }
    },
    skip: {
      "default": false
    },
    backBySlide: {
      "default": false
    },
    repeat: {
      "default": false
    }
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
      var noHref = evt.target['href'] === undefined;

      if (this.mouseNavigation && this.currentSlide.mouseNavigation && noHref && !evt.altKey) {
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
          resetIndex = _ref$resetIndex === void 0 ? true : _ref$resetIndex;

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

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  }

  var options = typeof script === 'function' ? script.options : script;

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true;

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  }

  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    hook = function hook(context) {
      context = context || this.$vnode && this.$vnode.ssrContext || this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext;

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      }

      if (style) {
        style.call(this, createInjectorSSR(context));
      }

      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    };

    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}

var HEAD = document.head || document.getElementsByTagName('head')[0];
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) style.element.setAttribute('media', css.media);
      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) style.element.removeChild(nodes[index]);
      if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
    }
  }
}

var browser = createInjector;

/* script */
const __vue_script__ = script;

/* template */

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-041c19be_0", { source: "@import url(https://fonts.googleapis.com/css?family=Source+Code+Pro);\n.eg-slideshow {\n  margin-top: 0;\n  background-attachment: fixed;\n  position: absolute;\n  height: 100%;\n  width: 100%;\n  overflow: hidden;\n}\n.eg-slideshow h1,\n.eg-slideshow h2,\n.eg-slideshow h3 {\n  text-align: center;\n}\n.eg-slideshow h1 {\n  font-size: 4em;\n  margin-bottom: 0.1em;\n}\n.eg-slideshow h2 {\n  font-size: 3em;\n}\n.eg-slideshow h3 {\n  font-size: 2em;\n  margin-bottom: 0.5em;\n}\n.eg-slideshow h4 {\n  font-size: 1.5em;\n}\n.eg-slideshow input {\n  font-size: 1em;\n}\n.eg-slideshow strong {\n  font-weight: bold;\n}\n.eg-slideshow .small {\n  font-size: 0.65em;\n}\n.eg-slideshow img {\n  max-width: 80%;\n}\n.eg-slideshow .eg-code-block {\n  font-family: \"Source Code Pro\", Courier;\n  text-align: left;\n  font-size: 0.5em;\n}\n.eg-slideshow .eg-code-block .box {\n  padding: 1em;\n}\n.eg-slideshow .eg-slide {\n  height: 100%;\n  overflow: hidden;\n  width: 100%;\n  position: absolute;\n}\n.eg-slideshow .subslide {\n  position: absolute;\n  margin-top: -1em;\n}\n.eg-slideshow .inline {\n  display: inline-block;\n}\n.eg-slideshow .center {\n  text-align: center;\n}\n.eg-slideshow .center p {\n  text-align: center;\n}\n.eg-slideshow .quarter {\n  display: inline-block;\n  width: 50%;\n  margin-bottom: 0.5em;\n}\n.eg-slideshow .eg-switch .switch {\n  margin-right: 0.5em;\n}\n.eg-slideshow .eg-radio .radiobutton {\n  margin-right: 0.5em;\n}\n.eg-slideshow .eg-triggered-message {\n  position: absolute;\n}\n.eg-slideshow .button {\n  font-size: 1em;\n}\n.eg-slideshow .nodisplay {\n  display: none;\n}\n\n/*# sourceMappingURL=Slideshow.vue.map */", map: {"version":3,"sources":["Slideshow.vue"],"names":[],"mappings":"AAAA,oEAAoE;AACpE;EACE,aAAa;EACb,4BAA4B;EAC5B,kBAAkB;EAClB,YAAY;EACZ,WAAW;EACX,gBAAgB;AAClB;AACA;;;EAGE,kBAAkB;AACpB;AACA;EACE,cAAc;EACd,oBAAoB;AACtB;AACA;EACE,cAAc;AAChB;AACA;EACE,cAAc;EACd,oBAAoB;AACtB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,cAAc;AAChB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,cAAc;AAChB;AACA;EACE,uCAAuC;EACvC,gBAAgB;EAChB,gBAAgB;AAClB;AACA;EACE,YAAY;AACd;AACA;EACE,YAAY;EACZ,gBAAgB;EAChB,WAAW;EACX,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,gBAAgB;AAClB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,kBAAkB;AACpB;AACA;EACE,kBAAkB;AACpB;AACA;EACE,qBAAqB;EACrB,UAAU;EACV,oBAAoB;AACtB;AACA;EACE,mBAAmB;AACrB;AACA;EACE,mBAAmB;AACrB;AACA;EACE,kBAAkB;AACpB;AACA;EACE,cAAc;AAChB;AACA;EACE,aAAa;AACf;;AAEA,wCAAwC","file":"Slideshow.vue","sourcesContent":["@import url(https://fonts.googleapis.com/css?family=Source+Code+Pro);\n.eg-slideshow {\n  margin-top: 0;\n  background-attachment: fixed;\n  position: absolute;\n  height: 100%;\n  width: 100%;\n  overflow: hidden;\n}\n.eg-slideshow h1,\n.eg-slideshow h2,\n.eg-slideshow h3 {\n  text-align: center;\n}\n.eg-slideshow h1 {\n  font-size: 4em;\n  margin-bottom: 0.1em;\n}\n.eg-slideshow h2 {\n  font-size: 3em;\n}\n.eg-slideshow h3 {\n  font-size: 2em;\n  margin-bottom: 0.5em;\n}\n.eg-slideshow h4 {\n  font-size: 1.5em;\n}\n.eg-slideshow input {\n  font-size: 1em;\n}\n.eg-slideshow strong {\n  font-weight: bold;\n}\n.eg-slideshow .small {\n  font-size: 0.65em;\n}\n.eg-slideshow img {\n  max-width: 80%;\n}\n.eg-slideshow .eg-code-block {\n  font-family: \"Source Code Pro\", Courier;\n  text-align: left;\n  font-size: 0.5em;\n}\n.eg-slideshow .eg-code-block .box {\n  padding: 1em;\n}\n.eg-slideshow .eg-slide {\n  height: 100%;\n  overflow: hidden;\n  width: 100%;\n  position: absolute;\n}\n.eg-slideshow .subslide {\n  position: absolute;\n  margin-top: -1em;\n}\n.eg-slideshow .inline {\n  display: inline-block;\n}\n.eg-slideshow .center {\n  text-align: center;\n}\n.eg-slideshow .center p {\n  text-align: center;\n}\n.eg-slideshow .quarter {\n  display: inline-block;\n  width: 50%;\n  margin-bottom: 0.5em;\n}\n.eg-slideshow .eg-switch .switch {\n  margin-right: 0.5em;\n}\n.eg-slideshow .eg-radio .radiobutton {\n  margin-right: 0.5em;\n}\n.eg-slideshow .eg-triggered-message {\n  position: absolute;\n}\n.eg-slideshow .button {\n  font-size: 1em;\n}\n.eg-slideshow .nodisplay {\n  display: none;\n}\n\n/*# sourceMappingURL=Slideshow.vue.map */"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = undefined;
  /* style inject SSR */
  

  
  var Slideshow = normalizeComponent_1(
    {},
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

var script$1 = {
  name: 'slide',
  props: {
    skip: {
      "default": false
    },
    enter: {
      "default": null
    },
    enterPrev: {
      "default": null
    },
    enterNext: {
      "default": null
    },
    leave: {
      "default": null
    },
    leavePrev: {
      "default": null
    },
    leaveNext: {
      "default": null
    },
    steps: {
      "default": 1
    },
    mouseNavigation: {
      "default": true
    },
    keyboardNavigation: {
      "default": true
    }
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

/* script */
const __vue_script__$1 = script$1;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "eg-transition",
    { attrs: { enter: _vm.enterTransition, leave: _vm.leaveTransition } },
    [
      _vm.active
        ? _c("div", { staticClass: "eg-slide" }, [
            _c(
              "div",
              { staticClass: "eg-slide-content" },
              [_vm._t("default")],
              2
            )
          ])
        : _vm._e()
    ]
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = undefined;
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Slide = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    undefined,
    undefined
  );

var script$2 = {
  name: 'eg-transition',
  props: {
    enter: {
      "default": null
    },
    leave: {
      "default": null
    }
  }
};

/* script */
const __vue_script__$2 = script$2;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "transition",
    {
      attrs: {
        "enter-active-class": _vm.enter ? "animated " + _vm.enter : "",
        "leave-active-class": _vm.leave ? "animated " + _vm.leave : ""
      }
    },
    [_vm._t("default")],
    2
  )
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$2 = undefined;
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Transition = normalizeComponent_1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    undefined,
    undefined
  );

var script$3 = {
  isWidget: true,
  name: 'eg-modal'
};

/* script */
const __vue_script__$3 = script$3;

/* template */
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "eg-modal" }, [
    _c("div", { staticClass: "content" }, [_vm._t("default")], 2)
  ])
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$3 = function (inject) {
    if (!inject) return
    inject("data-v-9cad53c8_0", { source: "\n.eg-modal {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["/Users/yao.ding/javascript/eagle.js/src/components/widgets/Modal.vue"],"names":[],"mappings":";AAcA;EACA,kBAAA;EACA,MAAA;EACA,OAAA;EACA,WAAA;EACA,YAAA;AACA","file":"Modal.vue","sourcesContent":["<template lang='pug'>\n.eg-modal\n  .content\n    slot\n</template>\n\n<script>\nexport default {\n  isWidget: true,\n  name: 'eg-modal'\n}\n</script>\n\n<style>\n.eg-modal {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n}\n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$3 = undefined;
  /* module identifier */
  const __vue_module_identifier__$3 = undefined;
  /* functional template */
  const __vue_is_functional_template__$3 = false;
  /* style inject SSR */
  

  
  var Modal = normalizeComponent_1(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$3,
    __vue_script__$3,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
    browser,
    undefined
  );

function randId() {
  return Math.random().toString(36).substr(2, 10);
}

var script$4 = {
  isWidget: true,
  name: 'eg-code-block',
  props: {
    id: {
      "default": function _default() {
        return randId();
      }
    },
    id2: {
      "default": function _default() {
        return randId();
      }
    },
    id3: {
      "default": function _default() {
        return randId();
      }
    },
    lang: {
      "default": null
    }
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

/* script */
const __vue_script__$4 = script$4;

/* template */
var __vue_render__$3 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "eg-code-block container" }, [
    _c("div", { staticClass: "box hljs code-box", attrs: { id: _vm.id } }, [
      _c("pre", [
        _c("code", { class: _vm.lang ? _vm.lang : "", attrs: { id: _vm.id3 } })
      ])
    ]),
    _c("div", { staticClass: "box comments-box" }, [
      _c("pre", [
        _c("code", { attrs: { id: _vm.id2 } }, [_vm._t("default")], 2)
      ])
    ])
  ])
};
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;

  /* style */
  const __vue_inject_styles__$4 = function (inject) {
    if (!inject) return
    inject("data-v-5c3a9fcd_0", { source: ".eg-code-block.container[data-v-5c3a9fcd] {\n  position: relative;\n  width: 100%;\n}\n.eg-code-block .code-box .eg-code-comment[data-v-5c3a9fcd] {\n  display: none;\n}\n.eg-code-block .comments-box[data-v-5c3a9fcd] {\n  position: absolute;\n  color: rgba(0, 0, 0, 0);\n  top: 0;\n}\n.eg-code-block .eg-code-comment[data-v-5c3a9fcd] {\n  z-index: 10 !important;\n}\n\n/*# sourceMappingURL=CodeBlock.vue.map */", map: {"version":3,"sources":["/Users/yao.ding/javascript/eagle.js/src/components/widgets/CodeBlock.vue","CodeBlock.vue"],"names":[],"mappings":"AAgDA;EACA,kBAAA;EACA,WAAA;AC/CA;ADmDA;EACA,aAAA;ACjDA;ADqDA;EACA,kBAAA;EACA,uBAAA;EACA,MAAA;ACnDA;ADuDA;EACA,sBAAA;ACrDA;;AAEA,wCAAwC","file":"CodeBlock.vue","sourcesContent":["<template lang='pug'>\n.eg-code-block.container\n  .box.hljs.code-box(:id='id')\n    pre\n      code(:class=\"lang ? lang : ''\", :id='id3')\n  .box.comments-box\n    pre\n      code(:id='id2')\n        slot\n</template>\n\n<script>\nimport { Options } from '../../main.js'\n\nfunction randId () {\n  return Math.random().toString(36).substr(2, 10)\n}\n\nexport default {\n  isWidget: true,\n  name: 'eg-code-block',\n  props: {\n    id: {default: () => randId()},\n    id2: {default: () => randId()},\n    id3: {default: () => randId()},\n    lang: {default: null}\n  },\n  mounted: function () {\n    this.update()\n  },\n  updated: function () {\n    this.update()\n  },\n  methods: {\n    update: function () {\n      var codeBlock = document.getElementById(this.id)\n      var commentsContent = document.getElementById(this.id2)\n      var codeContent = document.getElementById(this.id3)\n      codeContent.innerHTML = commentsContent.innerHTML\n      if (this.lang && Options.hljs) {\n        Options.hljs.highlightBlock(codeBlock)\n      }\n    }\n  }\n}\n</script>\n<style lang='scss' scoped>\n.eg-code-block {\n  &.container {\n    position: relative;\n    width: 100%;\n  }\n\n  .code-box {\n    .eg-code-comment {\n      display: none\n    }\n  }\n\n  .comments-box {\n    position: absolute;\n    color: rgba(0, 0, 0, 0.0);\n    top: 0;\n\n  }\n\n  .eg-code-comment {\n    z-index: 10 !important;\n  }\n}\n</style>\n",".eg-code-block.container {\n  position: relative;\n  width: 100%;\n}\n.eg-code-block .code-box .eg-code-comment {\n  display: none;\n}\n.eg-code-block .comments-box {\n  position: absolute;\n  color: rgba(0, 0, 0, 0);\n  top: 0;\n}\n.eg-code-block .eg-code-comment {\n  z-index: 10 !important;\n}\n\n/*# sourceMappingURL=CodeBlock.vue.map */"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$4 = "data-v-5c3a9fcd";
  /* module identifier */
  const __vue_module_identifier__$4 = undefined;
  /* functional template */
  const __vue_is_functional_template__$4 = false;
  /* style inject SSR */
  

  
  var CodeBlock = normalizeComponent_1(
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    browser,
    undefined
  );

var script$5 = {
  isWidget: true,
  name: 'eg-code-comment',
  props: {
    enter: {
      "default": null
    },
    leave: {
      "default": null
    },
    active: {
      "default": true
    },
    arrow: {
      "default": true
    }
  }
};

/* script */
const __vue_script__$5 = script$5;

/* template */
var __vue_render__$4 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "eg-transition",
    { attrs: { enter: _vm.enter, leave: _vm.leave } },
    [
      _vm.active
        ? _c(
            "div",
            { staticClass: "eg-code-comment" },
            [
              _vm.arrow ? _c("span", [_vm._v("←")]) : _vm._e(),
              _vm._t("default")
            ],
            2
          )
        : _vm._e()
    ]
  )
};
var __vue_staticRenderFns__$4 = [];
__vue_render__$4._withStripped = true;

  /* style */
  const __vue_inject_styles__$5 = function (inject) {
    if (!inject) return
    inject("data-v-0cbded58_0", { source: "\n.eg-code-comment {\n  display: inline-block\n}\n", map: {"version":3,"sources":["/Users/yao.ding/javascript/eagle.js/src/components/widgets/CodeComment.vue"],"names":[],"mappings":";AAmBA;EACA;AACA","file":"CodeComment.vue","sourcesContent":["<template lang='pug'>\neg-transition(:enter='enter', :leave='leave')\n  div.eg-code-comment(v-if='active')\n    span(v-if='arrow') &larr;\n    slot\n</template>\n<script>\nexport default {\n  isWidget: true,\n  name: 'eg-code-comment',\n  props: {\n    enter: {default: null},\n    leave: {default: null},\n    active: {default: true},\n    arrow: {default: true}\n  }\n}\n</script>\n<style>\n.eg-code-comment {\n  display: inline-block\n}\n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$5 = undefined;
  /* module identifier */
  const __vue_module_identifier__$5 = undefined;
  /* functional template */
  const __vue_is_functional_template__$5 = false;
  /* style inject SSR */
  

  
  var CodeComment = normalizeComponent_1(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$5,
    __vue_script__$5,
    __vue_scope_id__$5,
    __vue_is_functional_template__$5,
    __vue_module_identifier__$5,
    browser,
    undefined
  );

var script$6 = {
  isWidget: true,
  name: 'eg-toggle',
  props: {
    value: {
      "default": true
    },
    fontsize: {
      "default": '0.8em'
    }
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

/* script */
const __vue_script__$6 = script$6;

/* template */
var __vue_render__$5 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "eg-switch" }, [
    _c(
      "div",
      {
        staticClass: "switch",
        style: { "font-size": _vm.fontsize },
        on: { click: _vm.toggle }
      },
      [
        _c("input", {
          attrs: { type: "checkbox" },
          domProps: { checked: _vm.checked }
        }),
        _c("div", { staticClass: "slider", class: { checked: _vm.checked } }),
        _c("div", { staticClass: "sliderdot", class: { checked: _vm.checked } })
      ]
    ),
    _c("span", { class: { unchecked: !_vm.checked } }, [_vm._t("default")], 2)
  ])
};
var __vue_staticRenderFns__$5 = [];
__vue_render__$5._withStripped = true;

  /* style */
  const __vue_inject_styles__$6 = function (inject) {
    if (!inject) return
    inject("data-v-7848429c_0", { source: ".eg-switch[data-v-7848429c] {\n  /* The slider */\n}\n.eg-switch p[data-v-7848429c] {\n  display: inline;\n}\n.eg-switch .switch[data-v-7848429c] {\n  position: relative;\n  display: inline-block;\n  width: 2em;\n  height: 1em;\n}\n.eg-switch .switch input[data-v-7848429c] {\n  display: none;\n}\n.eg-switch .slider[data-v-7848429c] {\n  position: absolute;\n  cursor: pointer;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: #ccc;\n  -webkit-transition: 0.4s;\n  transition: 0.4s;\n  border-radius: 0.5em;\n}\n.eg-switch .sliderdot[data-v-7848429c] {\n  position: absolute;\n  cursor: pointer;\n  content: \"\";\n  height: 0.8em;\n  width: 0.8em;\n  left: 0.1em;\n  bottom: 0.1em;\n  background-color: white;\n  -webkit-transition: 0.4s;\n  transition: 0.4s;\n  border-radius: 0.4em;\n}\n.eg-switch .sliderdot.checked[data-v-7848429c] {\n  -webkit-transform: translateX(1em);\n  -ms-transform: translateX(1em);\n  transform: translateX(1em);\n}\n\n/*# sourceMappingURL=Toggle.vue.map */", map: {"version":3,"sources":["/Users/yao.ding/javascript/eagle.js/src/components/widgets/Toggle.vue","Toggle.vue"],"names":[],"mappings":"AAuCA;EAgBA,eAAA;ACrDA;ADsCA;EACA,eAAA;ACpCA;ADuCA;EACA,kBAAA;EACA,qBAAA;EACA,UAAA;EACA,WAAA;ACrCA;ADwCA;EACA,aAAA;ACtCA;AD0CA;EACA,kBAAA;EACA,eAAA;EACA,MAAA;EACA,OAAA;EACA,QAAA;EACA,SAAA;EACA,sBAAA;EACA,wBAAA;EACA,gBAAA;EACA,oBAAA;ACxCA;AD2CA;EACA,kBAAA;EACA,eAAA;EACA,WAAA;EACA,aAAA;EACA,YAAA;EACA,WAAA;EACA,aAAA;EACA,uBAAA;EACA,wBAAA;EACA,gBAAA;EACA,oBAAA;ACzCA;AD4CA;EACA,kCAAA;EACA,8BAAA;EACA,0BAAA;AC1CA;;AAEA,qCAAqC","file":"Toggle.vue","sourcesContent":["<template lang='pug'>\n.eg-switch\n  .switch(:style=\"{'font-size': fontsize}\", @click='toggle')\n\n    input(type='checkbox', :checked='checked')\n    .slider(:class=\"{checked: checked}\")\n    .sliderdot(:class=\"{checked: checked}\")\n\n  span(:class=\"{unchecked: !checked}\")\n    slot\n</template>\n\n<script>\nexport default {\n  isWidget: true,\n  name: 'eg-toggle',\n  props: {\n    value: {default: true},\n    fontsize: {default: '0.8em'}\n  },\n  data: function () {\n    return {\n      checked: this.value\n    }\n  },\n  methods: {\n    toggle: function () {\n      this.checked = !this.checked\n    }\n  },\n  watch: {\n    checked: function (val) {\n      this.$emit('input', val)\n    }\n  }\n}\n</script>\n<style lang=\"scss\" scoped>\n\n.eg-switch {\n  p {\n    display: inline;\n  }\n\n  .switch {\n    position: relative;\n    display: inline-block;\n    width: 2em;\n    height: 1em;\n  }\n\n  .switch input {\n    display:none;\n  }\n\n  /* The slider */\n  .slider {\n    position: absolute;\n    cursor: pointer;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    background-color: #ccc;\n    -webkit-transition: .4s;\n    transition: .4s;\n    border-radius: 0.5em;\n  }\n\n  .sliderdot {\n    position: absolute;\n    cursor: pointer;\n    content: \"\";\n    height: 0.8em;\n    width: 0.8em;\n    left: 0.1em;\n    bottom: 0.1em;\n    background-color: white;\n    -webkit-transition: .4s;\n    transition: .4s;\n    border-radius: .4em;\n  }\n\n  .sliderdot.checked {\n    -webkit-transform: translateX(1em);\n    -ms-transform: translateX(1em);\n    transform: translateX(1em);\n\n  }\n}\n</style>\n",".eg-switch {\n  /* The slider */\n}\n.eg-switch p {\n  display: inline;\n}\n.eg-switch .switch {\n  position: relative;\n  display: inline-block;\n  width: 2em;\n  height: 1em;\n}\n.eg-switch .switch input {\n  display: none;\n}\n.eg-switch .slider {\n  position: absolute;\n  cursor: pointer;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: #ccc;\n  -webkit-transition: 0.4s;\n  transition: 0.4s;\n  border-radius: 0.5em;\n}\n.eg-switch .sliderdot {\n  position: absolute;\n  cursor: pointer;\n  content: \"\";\n  height: 0.8em;\n  width: 0.8em;\n  left: 0.1em;\n  bottom: 0.1em;\n  background-color: white;\n  -webkit-transition: 0.4s;\n  transition: 0.4s;\n  border-radius: 0.4em;\n}\n.eg-switch .sliderdot.checked {\n  -webkit-transform: translateX(1em);\n  -ms-transform: translateX(1em);\n  transform: translateX(1em);\n}\n\n/*# sourceMappingURL=Toggle.vue.map */"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$6 = "data-v-7848429c";
  /* module identifier */
  const __vue_module_identifier__$6 = undefined;
  /* functional template */
  const __vue_is_functional_template__$6 = false;
  /* style inject SSR */
  

  
  var Toggle = normalizeComponent_1(
    { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
    __vue_inject_styles__$6,
    __vue_script__$6,
    __vue_scope_id__$6,
    __vue_is_functional_template__$6,
    __vue_module_identifier__$6,
    browser,
    undefined
  );

var script$7 = {
  isWidget: true,
  name: 'eg-radio-button',
  props: {
    value: {
      "default": null
    },
    label: {
      "default": null
    },
    fontsize: {
      "default": '0.7em'
    }
  },
  methods: {
    select: function select() {
      this.$emit('input', this.label);
    }
  }
};

/* script */
const __vue_script__$7 = script$7;

/* template */
var __vue_render__$6 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "eg-radio" },
    [
      _c(
        "div",
        {
          staticClass: "radiobutton",
          style: { "font-size": _vm.fontsize },
          on: { click: _vm.select }
        },
        [
          _c("div", { staticClass: "radio" }),
          _c("div", {
            staticClass: "radiodot",
            class: { checked: _vm.value === _vm.label }
          })
        ]
      ),
      _vm._t("default")
    ],
    2
  )
};
var __vue_staticRenderFns__$6 = [];
__vue_render__$6._withStripped = true;

  /* style */
  const __vue_inject_styles__$7 = function (inject) {
    if (!inject) return
    inject("data-v-2c78d29a_0", { source: ".eg-radio[data-v-2c78d29a] {\n  /* The slider */\n}\n.eg-radio p[data-v-2c78d29a] {\n  display: inline;\n}\n.eg-radio .radiobutton[data-v-2c78d29a] {\n  position: relative;\n  display: inline-block;\n  width: 1em;\n  height: 1em;\n}\n.eg-radio .radio[data-v-2c78d29a] {\n  position: absolute;\n  cursor: pointer;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  -webkit-transition: 0.4s;\n  transition: 0.4s;\n  border-radius: 0.5em;\n}\n.eg-radio .radiodot[data-v-2c78d29a] {\n  position: absolute;\n  cursor: pointer;\n  content: \"\";\n  height: 0em;\n  width: 0em;\n  left: 0.5em;\n  bottom: 0.5em;\n  background-color: white;\n  -webkit-transition: 0.4s;\n  transition: 0.4s;\n  border-radius: 50%;\n}\n.eg-radio .radiodot.checked[data-v-2c78d29a] {\n  height: 0.9em;\n  width: 0.9em;\n  left: 0.05em;\n  bottom: 0.05em;\n}\n\n/*# sourceMappingURL=RadioButton.vue.map */", map: {"version":3,"sources":["/Users/yao.ding/javascript/eagle.js/src/components/widgets/RadioButton.vue","RadioButton.vue"],"names":[],"mappings":"AA0BA;EAYA,eAAA;ACpCA;ADyBA;EACA,eAAA;ACvBA;AD0BA;EACA,kBAAA;EACA,qBAAA;EACA,UAAA;EACA,WAAA;ACxBA;AD4BA;EACA,kBAAA;EACA,eAAA;EACA,MAAA;EACA,OAAA;EACA,QAAA;EACA,SAAA;EACA,wBAAA;EACA,gBAAA;EACA,oBAAA;AC1BA;AD6BA;EACA,kBAAA;EACA,eAAA;EACA,WAAA;EACA,WAAA;EACA,UAAA;EACA,WAAA;EACA,aAAA;EACA,uBAAA;EACA,wBAAA;EACA,gBAAA;EACA,kBAAA;AC3BA;AD8BA;EACA,aAAA;EACA,YAAA;EACA,YAAA;EACA,cAAA;AC5BA;;AAEA,0CAA0C","file":"RadioButton.vue","sourcesContent":["<template lang='pug'>\n.eg-radio\n  .radiobutton(:style=\"{'font-size': fontsize}\", @click='select')\n    .radio\n    .radiodot(:class=\"{checked: value === label}\")\n  slot\n</template>\n\n<script>\nexport default {\n  isWidget: true,\n  name: 'eg-radio-button',\n  props: {\n    value: {default: null},\n    label: {default: null},\n    fontsize: {default: '0.7em'}\n  },\n  methods: {\n    select: function () {\n      this.$emit('input', this.label)\n    }\n  }\n}\n</script>\n\n<style lang=\"scss\" scoped>\n.eg-radio {\n  p {\n    display: inline;\n  }\n\n  .radiobutton {\n    position: relative;\n    display: inline-block;\n    width: 1em;\n    height: 1em;\n  }\n\n  /* The slider */\n  .radio {\n    position: absolute;\n    cursor: pointer;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    -webkit-transition: .4s;\n    transition: .4s;\n    border-radius: 0.5em;\n  }\n\n  .radiodot {\n    position: absolute;\n    cursor: pointer;\n    content: \"\";\n    height: 0em;\n    width: 0em;\n    left: 0.5em;\n    bottom: 0.5em;\n    background-color: white;\n    -webkit-transition: .4s;\n    transition: .4s;\n    border-radius: 50%;\n  }\n\n  .radiodot.checked {\n    height: .9em;\n    width: .9em;\n    left: 0.05em;\n    bottom: 0.05em;\n  }\n}\n</style>\n",".eg-radio {\n  /* The slider */\n}\n.eg-radio p {\n  display: inline;\n}\n.eg-radio .radiobutton {\n  position: relative;\n  display: inline-block;\n  width: 1em;\n  height: 1em;\n}\n.eg-radio .radio {\n  position: absolute;\n  cursor: pointer;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  -webkit-transition: 0.4s;\n  transition: 0.4s;\n  border-radius: 0.5em;\n}\n.eg-radio .radiodot {\n  position: absolute;\n  cursor: pointer;\n  content: \"\";\n  height: 0em;\n  width: 0em;\n  left: 0.5em;\n  bottom: 0.5em;\n  background-color: white;\n  -webkit-transition: 0.4s;\n  transition: 0.4s;\n  border-radius: 50%;\n}\n.eg-radio .radiodot.checked {\n  height: 0.9em;\n  width: 0.9em;\n  left: 0.05em;\n  bottom: 0.05em;\n}\n\n/*# sourceMappingURL=RadioButton.vue.map */"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$7 = "data-v-2c78d29a";
  /* module identifier */
  const __vue_module_identifier__$7 = undefined;
  /* functional template */
  const __vue_is_functional_template__$7 = false;
  /* style inject SSR */
  

  
  var RadioButton = normalizeComponent_1(
    { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
    __vue_inject_styles__$7,
    __vue_script__$7,
    __vue_scope_id__$7,
    __vue_is_functional_template__$7,
    __vue_module_identifier__$7,
    browser,
    undefined
  );

var script$8 = {
  isWidget: true,
  name: 'eg-image-slide',
  mixins: [Slide],
  props: {
    url: {
      "default": 'https://i.imgur.com/P7iyH.png'
    },
    enter: {
      "default": null
    },
    leave: {
      "default": null
    }
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

/* script */
const __vue_script__$8 = script$8;

/* template */
var __vue_render__$7 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "eg-transition",
    { attrs: { enter: _vm.enter, leave: _vm.leave } },
    [
      _vm.active
        ? _c("div", { staticClass: "eg-slide image-slide", style: _vm.style })
        : _vm._e()
    ]
  )
};
var __vue_staticRenderFns__$7 = [];
__vue_render__$7._withStripped = true;

  /* style */
  const __vue_inject_styles__$8 = undefined;
  /* scoped */
  const __vue_scope_id__$8 = undefined;
  /* module identifier */
  const __vue_module_identifier__$8 = undefined;
  /* functional template */
  const __vue_is_functional_template__$8 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var ImageSlide = normalizeComponent_1(
    { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
    __vue_inject_styles__$8,
    __vue_script__$8,
    __vue_scope_id__$8,
    __vue_is_functional_template__$8,
    __vue_module_identifier__$8,
    undefined,
    undefined
  );

var script$9 = {
  isWidget: true,
  name: 'eg-triggered-message',
  props: {
    enter: {
      "default": 'slideInLeft'
    },
    leave: {
      "default": 'slideOutLeft'
    },
    trigger: {
      "default": false
    },
    position: {
      "default": 'left top'
    },
    duration: {
      "default": 3
    }
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

/* script */
const __vue_script__$9 = script$9;

/* template */
var __vue_render__$8 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "eg-transition",
    { attrs: { enter: _vm.enter, leave: _vm.leave } },
    [
      _vm.active
        ? _c(
            "div",
            { staticClass: "eg-triggered-message", style: _vm.style },
            [_vm._t("default")],
            2
          )
        : _vm._e()
    ]
  )
};
var __vue_staticRenderFns__$8 = [];
__vue_render__$8._withStripped = true;

  /* style */
  const __vue_inject_styles__$9 = undefined;
  /* scoped */
  const __vue_scope_id__$9 = undefined;
  /* module identifier */
  const __vue_module_identifier__$9 = undefined;
  /* functional template */
  const __vue_is_functional_template__$9 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var TriggeredMessage = normalizeComponent_1(
    { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
    __vue_inject_styles__$9,
    __vue_script__$9,
    __vue_scope_id__$9,
    __vue_is_functional_template__$9,
    __vue_module_identifier__$9,
    undefined,
    undefined
  );

var script$a = {
  isWidget: true,
  name: 'eg-timer',
  props: {
    key: {
      "default": 'T'
    }
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

/* script */
const __vue_script__$a = script$a;

/* template */
var __vue_render__$9 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("eg-transition", { attrs: { enter: "fadeIn", leave: "fadeOut" } }, [
    _vm.display ? _c("div", { staticClass: "timer" }) : _vm._e(),
    _vm._v(_vm._s(_vm.text))
  ])
};
var __vue_staticRenderFns__$9 = [];
__vue_render__$9._withStripped = true;

  /* style */
  const __vue_inject_styles__$a = function (inject) {
    if (!inject) return
    inject("data-v-b8b192c0_0", { source: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", map: {"version":3,"sources":[],"names":[],"mappings":"","file":"Timer.vue"}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$a = "data-v-b8b192c0";
  /* module identifier */
  const __vue_module_identifier__$a = undefined;
  /* functional template */
  const __vue_is_functional_template__$a = false;
  /* style inject SSR */
  

  
  var Timer = normalizeComponent_1(
    { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
    __vue_inject_styles__$a,
    __vue_script__$a,
    __vue_scope_id__$a,
    __vue_is_functional_template__$a,
    __vue_module_identifier__$a,
    browser,
    undefined
  );

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
      document.body.style.transform = "scale(".concat(config.scale, ") translate(").concat(translateX, "px, ").concat(translateY, "px)");
    }
  };
};

var zoom = {
  isPlugin: true,
  init: function init(slideshow, config) {
    if (slideshow.embedded || slideshow.inserted || hasZoom) return;
    config = Object.assign({
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
          postMessage(slideshow, "{\n          \"method\": \"setCurrentSlide\", \n          \"slideIndex\": ".concat(slideshow.currentSlideIndex, ",\n          \"step\": ").concat(slideshow.step, "\n          }"));
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
      console.log("Presenter mode runs into an error: ".concat(e));
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
    config = Object.assign({
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
  install: function install(Vue) {
    Vue.component('slide', Slide);
    Vue.component('eg-transition', Transition);
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
export { CodeBlock, CodeComment, ImageSlide, Modal, Options, presenter as Presenter, RadioButton, Slide, Slideshow, Timer, Toggle, Transition, TriggeredMessage, zoom as Zoom };
