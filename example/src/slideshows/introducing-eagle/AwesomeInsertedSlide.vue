<template lang="pug">
eg-transition(:enter='enter', :leave='leave')
  .eg-slide(v-if='active')
    .eg-slide-content
      h3(v-if='step < 12') Slide reuse
      h3(v-else) Slideception !!


      eg-transition(leave='bounceOutLeft')

        .subslide(v-if='step <= 2')
          p.
            Place a slide in a separate file to reuse it in different slideshows.
            You can also import the slides of a whole slideshow inside another.

          eg-code-block(lang='html').
            .eg-slideshow

              slide
                h1 My research projects
                h3 Please hire me

              introducing-myself <eg-code-comment> One Inserted/Reused slide </eg-code-comment>

              my-first-project <eg-code-comment> Inserted slideshow ! </eg-code-comment>
              other-project(:firstSlide=3) <eg-code-comment> Cut slides out </eg-code-comment>

              slide
                h3 Thank you for listening
                p Please hire me

          eg-transition(enter='fadeIn')
            p(v-if='step === 2').
              For instance, this very complex slide you are watching is written in its own file.
      eg-transition(enter='bounceInRight')
        .subslide(v-if='(step >= 3) && (step < 15)')

          p(v-if='(3 <= step) && (step < 6)')
             | You: Wait did you say <i>complex</i> ?
             span(v-if='(4 <= step) && (step < 6)') &nbsp; How is this slide <i>complex</i>?
          p(v-if='(6 <= step) && (step <= steps)') You: ...

          eg-transition(enter='lightSpeedIn')
            #awesome-slideshow.embedded-slideshow-container(v-if='step >= 5')
              awesome-embedded-slideshow(:embedded='true', :username='username',
                                         :preference='preference')
          eg-transition(enter='slideInUp')
            p(v-if='(11 < step)  && (step <= 13)').
              If you lost track: you are watching a slideshow embedded
              in a slideshow embedded in a slide inserted in a slideshow.
      //- eg-transition(enter='bounceInRight')
      //-   .subslide(v-if='step >= 15')
      //-     p.
      //-       One last thing: <b>meta-slideshows</b>, playing existing slideshows
      //-       one after another to form a new one:
      //-     eg-code-block(lang='html').
      //-       .meta-slideshow
      //-         slideshow
      //-           slide
      //-             h1 My portfolio
      //-             h3 by Zulko
      //-
      //-         my-research-projects <eg-code-comment>AN EXISTING SLIDESHOW</eg-code-comment>
      //-         my-gifs-portfolio(:startSlide='2') <eg-code-comment>SKIP FIRST FRAME</eg-code-comment>
      //-         my-current-projects(:endSlide='40') <eg-code-comment>SKIP THE END</eg-code-comment>
      //-
      //-         slideshow
      //-           slide
      //-             h1 THE END
      //-             h3 Thank you
      //-
      //-     eg-transition(enter='fadein')
      //-       p(v-if='step === steps').
      //-         If you were waiting for an actually useful feature, that would be this one!
</template>

<script>
import AwesomeEmbeddedSlideshow from './AwesomeEmbeddedSlideshow'
import eagle from 'eagle.js'
export default {
  props: {
    steps: {default: 14},
    username: {default: 'Tracy'},
    preference: {default: 'baby bunnies'}
  },
  components: {
    'awesome-embedded-slideshow': AwesomeEmbeddedSlideshow
  },
  mixins: [eagle.slide]
}
</script>
<style lang='scss' scoped>
.eg-slide {
  .eg-slide-content {
    .chuckle {
      color: grey;
      font-size: 0.6em;
      margin-right: 0.5em;
    }

    #awesome-slideshow {
      position: relative;
      margin: 0 auto;
      width: 16em;
      height: 9em;
    }

  }
}
</style>
