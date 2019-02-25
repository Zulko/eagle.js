import Vue from 'vue'

import Slideshow from './components/Slideshow.vue'
import Slide from './components/Slide.vue'
import Transition from './components/AnimatedTransition.vue'

import Modal from './components/widgets/Modal.vue'
import CodeBlock from './components/widgets/CodeBlock.vue'
import CodeComment from './components/widgets/CodeComment.vue'
import Toggle from './components/widgets/Toggle.vue'
import RadioButton from './components/widgets/RadioButton.vue'
import ImageSlide from './components//widgets/ImageSlide.vue'
import TriggeredMessage from './components/widgets/TriggeredMessage.vue'
import Timer from './components/widgets/Timer.vue'

import Zoom from './components/plugins/zoom'
import Presenter from './components/plugins/presenter'

const Options = {
  plugins: []
  // hljs: used by CodeBlock widget
}

export {
  Slideshow,
  Slide,
  Modal,
  CodeBlock,
  CodeComment,
  Toggle,
  Transition,
  RadioButton,
  ImageSlide,
  TriggeredMessage,
  Timer,
  Zoom,
  Presenter,
  Options
}

export default {
  install (Vue) {
    Vue.component('slide', Slide)
    Vue.component('eg-transition', Transition)
  },
  use (extension, config) {
    if (extension.isPlugin) {
      Options.plugins.push([extension, config])
    }
    if (extension.isWidget) {
      Vue.component(extension.name, extension)
    }
  }
}
