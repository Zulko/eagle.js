import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import Eagle, { Slideshow, Zoom, Presenter } from '../src/main.js'

import '../src/themes/agrume/agrume.scss' 
import '../src/themes/gourmet/gourmet.scss' 
import 'animate.css'

Vue.use(Eagle)
Eagle.use(Zoom)
Eagle.use(Presenter)

const render = (slides, useTheme=true, theme='agrume') => {
  const template = (useTheme ? `<div class='eg-theme-${theme}'>` : '') +
    `<div class='eg-slideshow'>
      ${slides}
    </div>` +
    (useTheme ? '</div>' : '')

  return {
    mixins: [Slideshow],
    template: template
  }
}

Vue.component('NestedSlideshow', {
  mixins: [Slideshow],
  template: `
  <div class='eg-theme-agrume'>
    <div class='eg-slideshow'>
      <slide>
        This is a nested slideshow with only one slide.
        <slot />
      </slide>
    </div>
  </div>
  `
})

storiesOf('Slideshow', module)
  .add('single slide', () => 
    render(`
    <slide>
      <h1>Eagle.js</h1>
    </slide>
    `)
  )
  .add('multiple slides', () => 
    render(`
    <slide>
      <h1>multiple slides</h1>
    </slide>
    <slide>
      <h1>Eagle.js is easy to use</h1>
    </slide>
    <slide>
      <h1>Eagle.js offers max hackbility</h1>
    </slide>
    `)
  )
  .add('multiple slides with enter/exit animation', () => 
    render(`
    <slide enter='bounceInLeft' leave='bounceOutLeft'>
      <h1>Eagle.js</h1>
    </slide>
    <slide enter='fadeIn' leave='fadeOut'>
      <h1>Eagle.js is easy to use</h1>
    </slide>
    <slide enter='zoomIn' leave='zoomOut'>
      <h1>Eagle.js offers max hackbility</h1>
    </slide>
    `)
  )
  .add('single slide multiple steps with animation', () => 
    render(`
    <slide :steps='4'>
      <h4>
        <eg-transition enter='bounceInLeft' leave='bounceOutLeft'>
          <p v-if='step >= 2'><b>Vue.js</b> is one of the coolest frontend frameworks out there</p>
        </eg-transition>
        <eg-transition enter='bounceInRight' leave='bounceOutRight'>
          <p v-if='step >= 3'><b>Vue.js</b> supports components and transitions out of the box</p>
        </eg-transition>
        <eg-transition enter='bounceInLeft' leave='bounceOutLeft'>
          <p v-if='step >= 4'><b>Eagle.js</b> adds navigation logics, scalable components, etc.</p>
        </eg-transition>
      </h4>
    </slide>
    `)
  )
  .add('inserted slideshow, slideshow within slideshow', () => 
    render(`
      <nested-slideshow :inserted='true' >1</nested-slideshow>
      <nested-slideshow :inserted='true' >2</nested-slideshow>
      <nested-slideshow :inserted='true' >3</nested-slideshow>
    `)
  )
  .add('embedded slideshow, slideshow within slide', () => 
    render(`
      <slide>
        <nested-slideshow :embedded='true' />
      </slide>
    `)
  )

storiesOf('Theme', module)
  .add('default theme', () =>
    render(`
    <slide>
      <h1>Eagle.js</h1>
    </slide>
    `, false)
  )
  .add('gourmet theme', () =>
    render(`
    <slide>
      <h1>Eagle.js</h1>
    </slide>
    `, true, 'gourmet')
  )

  // storiesOf('Plugin', module)
  //   .add('presenter', () =>)
