import Slideshow from './components/Slideshow.vue'
import Slide from './components/Slide.vue'
import Modal from './components/widgets/Modal.vue'
import CodeBlock from './components/widgets/CodeBlock.vue'
import CodeComment from './components/widgets/CodeComment.vue'
import Toggle from './components/widgets/Toggle.vue'
import Transition from './components/AnimatedTransition.vue'
import RadioButton from './components/widgets/RadioButton.vue'
import ImageSlide from './components//widgets/ImageSlide.vue'
import TriggeredMessage from './components/widgets/TriggeredMessage.vue'
import Timer from './components/widgets/Timer.vue'

const Options = {}

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
  Options
}

export default {
  slideshow: Slideshow,
  slide: Slide,
  install (Vue) {
    Vue.component('slide', Slide)
    Vue.component('eg-image-slide', ImageSlide)
    Vue.component('eg-modal', Modal)
    Vue.component('eg-transition', Transition)
    Vue.component('eg-code-block', CodeBlock)
    Vue.component('eg-code-comment', CodeComment)
    Vue.component('eg-toggle', Toggle)
    Vue.component('eg-radio-button', RadioButton)
    Vue.component('eg-timer', Timer)
    Vue.component('eg-triggered-message', TriggeredMessage)
  }
}
