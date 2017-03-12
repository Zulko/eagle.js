<template lang='pug'>
#ThemesSlideshow
  .eg-slideshow

    slide.local-eg-theme-artic(enter='fadeIn' leave='fadeOut')
      h1 Themes<br />Slideshow

    slide.local-eg-theme-foreword(enter='fadeIn' leave='fadeOut')
      eg-transition(enter='fadeInDown')
        p.
          FOREWORD <br />
          The next slides can also be seen in "Introducing Eagle",
          where they are programmatically inserted.

    slide.local-eg-theme-bretagne(enter='fadeIn' leave='none')
      eg-transition(enter='fadeInDown')
        h3 About Themes

    slide.local-eg-theme-forest-road(enter='fadeIn' leave='none')
      eg-transition(enter='fadeInLeft')
        h3 You can change everything

    slide.local-eg-theme-spark(enter='fadeIn' leave='none')
      eg-transition(enter='fadeInUp')
        h3 Enjoy the versatility<br />of the CSS Technology<sup>TM</sup>

    slide.local-eg-theme-city(enter='fadeIn' leave='none')
      eg-transition(enter='flipInX')
        eg-code-block(lang='html').
          //- Use CSS classes to theme the slideshow or just one slide

          #MySlideshow.eg-theme-dark //- General theme for the slideshow
            .eg-slideshow
              slide
                h1 I am the darkness !
              slide.eg-theme-light //- slide-specific theme
                h1 Sometimes I am the light too
                slide.local-eg-theme-bretagne

    slide.local-eg-theme-space(enter='fadeIn'  leave='fadeOut')
      eg-transition(enter='zoomIn')
        h3 Your bad taste is the limit
</template>
<script>
import eagle from 'eagle.js'
export default {
  mixins: [eagle.slideshow],
  infos: {
    title: 'Themes Slideshows',
    description: 'You can change everything !',
    path: 'themes-slidehow'
  }
}
</script>

<style lang='scss'>
#ThemesSlideshow {
  // STYLES THAT ARE GLOBAL FOR THIS PARTICULAR SLIDESHOW
  h3 {
    font-weight: normal;
    text-transform: uppercase;
  }
  .eg-slide-content {
    width: 25em;
    max-width: 80%;
    margin: 0 auto;
  }

  // LOCAL THEMES FOR SLIDES

  .local-eg-theme-artic {
    background-color: #11a9e2;
    background-image: none;
    color: #fff;
    h1 {
      font-weight: bold;
      font-size: 3em;
    }
    h1, p {
      font-family: "Comfortaa", Helvetica, Arial, sans-serif;
      margin-top: 0;
      position: absolute;
      top:50%;
      left:50%;
      transform: translateX(-50%) translateY(-50%);
      width: 80%;

      text-shadow: 0 0.01em 0 #ccc,
                   0 0.02em 0 #c9c9c9,
                   0 0.03em 0 #bbb,
                   0 0.04em 0 #b9b9b9,
                   0 0.05em 0 #aaa,
                   0 0.06em 0.01em rgba(0,0,0,.1),
                   0 0 0.05em rgba(0,0,0,.1),
                   0 0.01em 0.03em rgba(0,0,0,.3),
                   0 0.03em 0.05em rgba(0,0,0,.2),
                   0 0.05em 0.1em rgba(0,0,0,.25),
                   0 0.1em 0.1em rgba(0,0,0,.2),
                   0 0.2em 0.2em rgba(0,0,0,.15);
    }
  }
  .local-eg-theme-foreword {
    @import url(https://fonts.googleapis.com/css?family=EB+Garamond);
    background: url('./assets/pw_maze_black.png') repeat;
    font-family: 'EB Garamond';
    color: #ccc;
    .eg-slide-content {
      max-width: 90%;
      width: 15em;
    }
    p {
      margin-top: 30%;
    }
  }

  .local-eg-theme-bretagne {
    @import url(https://fonts.googleapis.com/css?family=Pompiere);
    h3 {
      // letter-spacing: 1px;
      font-family: 'Pompiere';
      text-transform: none;
      font-size: 3em;
      color: rgba(255, 255, 255, .6);
    }
    background-image: url(http://i.imgur.com/rYkJ6I8.jpg);
    background-position: center;
    background-size: cover;
  }
  .local-eg-theme-forest-road {
    @import url(https://fonts.googleapis.com/css?family=Cabin+Sketch);
    h3 {
      font-family: 'Cabin Sketch';
      margin-top: 50%;
      text-align: left;
      color: rgba(255, 255, 255, .9);
    }
    background-image: url(http://i.imgur.com/hxTMFZW.jpg);
    background-position: center;
    background-size: cover;

  }

  .local-eg-theme-spark {
    @import url(https://fonts.googleapis.com/css?family=Special+Elite);
    h3 {
      position: absolute;
      font-family: 'Special Elite';
      color: rgba(255, 255, 255, .8);
      font-size: 1em;
      bottom: 10%;
      float: left;
    }
    background-image: url(http://i.imgur.com/FL9mwpd.jpg);
    background-position: center;
    background-size: cover;
  }
  .local-eg-theme-city {
    @import url(https://fonts.googleapis.com/css?family=Patrick+Hand+SC);
    @import './assets/monokai';
    .eg-code-block {
      margin-top: 30%;
    }
    .code-box {
      box-shadow: 0 0 0.25em 0.25em #ddd
    }
    background-image: url(http://i.imgur.com/kmmHith.jpg);
    background-position: center;
    background-size: cover;
  }
  .local-eg-theme-space {
    @import url(https://fonts.googleapis.com/css?family=Forum);
    h3 {
      font-family: 'Forum';
      font-size: 1.5em;
      color: rgba(255, 255, 255, 0.75);
      letter-spacing: 1.5px;
      margin-top: 50%
    }
    background-image: url(http://i.imgur.com/yO2ivoD.jpg);
    background-position: center;
    background-size: cover;
  }
}

</style>
