import Slideshow from './components/Slideshow'
import Slide from './components/Slide'
import Modal from './components/widgets/Modal'
import CodeBlock from './components/widgets/CodeBlock'
import CodeComment from './components/widgets/CodeComment'
import Toggle from './components/widgets/Toggle'
import AnimatedTransition from './components/AnimatedTransition'
import RadioButton from './components/widgets/RadioButton'
import ImageSlide from './components/ImageSlide'
import TriggeredMessage from './components/widgets/TriggeredMessage'

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
