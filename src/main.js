import Slideshow from './components/Slideshow.vue'
import Slide from './components/Slide.vue'
import Modal from './components/widgets/Modal.vue'
import CodeBlock from './components/widgets/CodeBlock.vue'
import CodeComment from './components/widgets/CodeComment.vue'
import Toggle from './components/widgets/Toggle.vue'
import AnimatedTransition from './components/AnimatedTransition.vue'
import RadioButton from './components/widgets/RadioButton.vue'
import ImageSlide from './components/ImageSlide.vue'
import TriggeredMessage from './components/widgets/TriggeredMessage.vue'

export default {
  slideshow: Slideshow,
  slide: Slide,
  install (Vue) {
    Vue.component('slideshow', Slideshow)
    Vue.component('slide', Slide)
    Vue.component('image-slide', ImageSlide)

    Vue.component('eg-modal', Modal)

    Vue.component('eg-transition', AnimatedTransition)
    Vue.component('eg-code-block', CodeBlock)
    Vue.component('eg-code-comment', CodeComment)
    Vue.component('eg-toggle', Toggle)
    Vue.component('eg-radio', RadioButton)
    Vue.component('eg-triggered-message', TriggeredMessage)
  }
}
