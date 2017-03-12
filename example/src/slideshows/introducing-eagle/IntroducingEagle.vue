<template lang="pug">
#IntroducingEagle.eg-theme-agrume
  .eg-slideshow
    slide(enter='fadeIn' leave='bounceOutLeft')
      .center.frontpage
        h1 Eagle.js
        img(src='./assets/logo.svg')
        h4 A Slideshow Framework for Vue.js
        eg-triggered-message(:trigger='slideTimer >= 2',
                            :duration='6', position='top right',
                            enter='bounceInRight', leave='bounceOutRight')
          p Next:
          img.control-schema(src='./assets/controlsNext.svg')
          p Previous:
          img.control-schema(src='./assets/controlsPrev.svg')

    slide(:steps=4, enter='bounceInRight' leave='bounceOutDown')
      h3
        | Vue
        .inline(class='animated infinite pulse heart')
        | slideshows
      .center
        eg-transition(enter='bounceInLeft' leave='bounceOutLeft')
          p(v-if="step >= 2")
            <b>Vue.js</b> is one of the coolest frontend frameworks out there
        eg-transition(enter='bounceInRight' leave='bounceOutRight')
          p(v-if="step >= 3")
            <b>Vue.js</b> supports components and transitions out of the box
        eg-transition(enter='bounceInLeft' leave='bounceOutLeft')
          p(v-if="step >= 4")
            <b>Eagle.js</b> adds navigation logics, scalable components, etc.

    slide(:steps=6, enter='bounceInDown')
      h3 What's in it for you

      eg-transition(enter='fadeIn' leave='fadeOut')
        .quarter(v-if='step >=2')
          img(src='./assets/icons/basic_paperplane.svg')
          h4 EASE OF USE
          p Clear syntax, live preview

      eg-transition(enter='fadeIn' leave='fadeOut')
        .quarter(v-if='step >=3')
          img(src='./assets/icons/basic_share.svg')
          h4 MODULARITY
          p Reuse slides and styles

      eg-transition(enter='fadeIn' leave='fadeOut')
        .quarter(v-if="step >= 4")
         img(src='./assets/icons/basic_mixer2.svg')
         h4 INTERACTIVITY
         p Embed forms and live demos

      eg-transition(enter='fadeIn' leave='fadeOut')
        .quarter(v-if="step >= 5")
          img(src='./assets/icons/basic_display.svg')
          h4 PORTABILITY
          p Play in any browser

      eg-transition(enter='fadeIn' leave='fadeOut')
        eg-modal(v-if='step >= 6')
          h3 You right now:
          .center
            img(:src="preloadedImages['youRightNow']",
                :style="{height: '10em'}")


    slide(:steps=4, leave='fadeOut')
      eg-transition(enter='flipInX')
        h3 Show me the codey !!!

      eg-transition(enter='flipInX')
        p Here is how you slideshow with Eagle.js:

      eg-transition(enter='flipInX')
        eg-code-block(lang='html').
          .eg-slideshow

            slide <eg-code-comment :active='step === 2' enter='flipInY'> EAGLE SLIDE TAG</eg-code-comment>
              h1 EagleJS <eg-code-comment :active='step === 3' enter='flipInY'> SIMPLIFIED HTML (PUG)</eg-code-comment>
              img(src='logo.png')

            slide(enter='slideInLeft', :steps=4)
              h3 EagleJS is the greatest slideshow framework
              p(v-if="step >= 2") The best !  <eg-code-comment :active='step === 4' enter='flipInY'> BULLET POINT WITH V-IF</eg-code-comment>
              p(v-if="step >= 3") All others are failed frameworks.
              p(v-if="step >= 4") Not even real frameworks. Fake !

    slide.boredYet(enter='fadeIn', :mouseNavigation='false', :keyboardNavigation='false')
      h3 Bored yet ?
      .center
        p What shall I call you ?
        input.center(v-model='username')
        p.
          {{ username }}<span v-if='username.length'>,</span> I got you.
          Tell me what you like, I'll skip the rest:

        .inline(v-for='category, name in slideCategories')
            eg-toggle(:key='name', v-model='category.show', :width='30',
                      on-text='', off-text='', on-color='#ffeeaa',
                      @change='changeMessage(category.changeMessage)')
              p.label {{ category.name }}
              eg-triggered-message(:trigger='!category.show',
                                  :duration='3', position='top right',
                                  enter='bounceInRight', leave='bounceOutRight')
                p(v-html="message(category.name)")

      .center
        p What's your favourite ?
        eg-radio.inline(v-for='pref in preferences', v-model="preference",
                        :label="pref.label" )
          p {{ pref.text}}
          eg-triggered-message(:trigger='preference=== pref.label',
                              :duration='3', position='top right',
                              enter='bounceInRight', leave='bounceOutRight')
                          p {{ message(pref.label) }}

      .button.prev(@click.stop='previousSlide')
        span &lt; Prev. slide
        br
        span.small  Ctrl + left
      .button.next(@click.stop='nextSlide')
        span Next slide &gt;
        br
        span.small Ctrl + right

    themes-slideshow(:skip="!slideCategories.themes.show", :inserted='true', firstSlide=3)

    awesome-inserted-slide(:username='username', :preference='preference',
                           enter='fadeIn', leave='hinge',
                           :skip="!slideCategories['slideReuse'].show")

    figures-slide(enter='flipInY', leave='rollOut', :skip="['slideReuse', 'themes', 'interactivity'].some(function (e) {return slideCategories[e].show})")

    slide(enter='zoomIn', leave='fadeOut')
      h3 That's all folks !
      p.center Think you can help ?
      .center
        img.shadowbox(src='http://i.imgur.com/AAlntwU.gif')
      p.center.
        I'm not a frontend person, so <br />any contribution is welcome.

    slide(enter='fadeIn')
      h3 Thank you !
      p This slideshow's so fresh, it has end credits.
      end-credits(:username='username')
</template>

<script>
import eagle from 'eagle.js'

export default {
  mixins: [eagle.slideshow],
  infos: {
    title: 'Introducing Eagle.js',
    description: 'Watch this first if you are new to Eagle.js',
    path: 'introducing-eagle'
  },
  components: {
    'awesome-inserted-slide': require('./AwesomeInsertedSlide'),
    'figures-slide': require('./FiguresSlide'),
    'end-credits': require('./components/EndCredits'),
    'themes-slideshow': require('../themes-slideshow/ThemesSlideshow')
  },
  data: function () {
    return {
      username: 'Tracy',
      preference: 'baby bunnies',
      preferences: [
        {
          label: 'baby bunnies',
          text: 'Baby bunnies'
        },
        {
          label: 'fluffy puppies',
          text: 'Fluffy puppies'
        },
        {
          label: 'funny kitties',
          text: 'Funny kitties'
        }
      ],
      slideCategories: {
        themes: {
          show: true,
          name: 'Theming'
        },
        slideReuse: {
          show: true,
          name: 'Slide reuse'
        },
        interactivity: {
          show: true,
          name: 'Interactivity'
        }
      },
      preloadedImages: {
        computerKid: 'http://i.imgur.com/AAlntwU.gif',
        youRightNow: 'http://i.imgur.com/DFBTj0a.gif',
        bretagne: 'http://i.imgur.com/rYkJ6I8.jpg',
        forrestRoad: 'http://i.imgur.com/hxTMFZW.jpg',
        starrySky: 'http://i.imgur.com/yO2ivoD.jpg',
        cityBokeh: 'http://i.imgur.com/kmmHith.jpg',
        darkWoods: 'http://i.imgur.com/FL9mwpd.jpg'
      }
    }
  },
  methods: {
    message: function (name) {
      return {
        'baby bunnies': 'Yeeeeah my favorite too !',
        'fluffy puppies': 'Wow so original.',
        'funny kitties': 'Good for you ' + this.username + '.',
        'Theming': 'Ok ' + this.username + ', whatever.',
        'Slide reuse': 'Seriously ' + this.username + ' you <em>want</em> to see this.',
        'Interactivity': 'Well that\'s this slide, ' + this.username +
                         '. <br /> A bit too late to unsee it, heh ?'
      }[name]
    }
  }
}
</script>

<style lang='scss'>
@import 'node_modules/eagle.js/src/themes/agrume/agrume';
#IntroducingEagle {
  .frontpage {
    img {
      height: 7em;
    }
    img.control-schema {
      width: 8em;
      height: 3em;
    }
  }
  .heart {
    width: 1em;
    height: 0.8em;
    margin-left: 0.1em;
    margin-right: 0.1em;
    background-image: url('./assets/heart.svg');
    background-position: center center;
    background-repeat:  no-repeat;
    background-size: contain;

  }

  .quarter {
    text-align: center;
    p {
      margin-top: 0;
      text-align: center;
    }
    h4 {
      margin-top: 0;
      margin-bottom: 0
    }
  }
  .boredYet {
    p {
      margin-bottom: 0.3em;
      margin-top: 1.3em;
    }
    .button {
      border: none;
    }
    .button.prev {
      float: left;
    }
    .button.next {
      float: right;
    }
  }
}
</style>
