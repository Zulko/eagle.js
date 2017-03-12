<template lang="pug">
#AwesomeEmbeddedSlideshow
  .eg-slideshow
    slide(enter='fadeIn' leave='fadeOut').slide-intro
      eg-transition(enter='bounceInRight' leave='bounceOutLeft')
        h3 Oh hi there, <br />{{ username }} who likes {{ preference }}

    slide(:steps='2', enter='fadeIn' leave='fadeOut').slide-two
      eg-transition(enter='bounceInLeft' leave='bounceOutRight')
        .div
          h3 Hope you like it so far.
          h4 By the way, dope theme, Zulko.
      eg-transition(enter='slideInRight' leave='slideOutRight')
          p.thanks(v-if='step === 2') Thanks mate. Big fan.

    slide(enter='fadeIn' leave='fadeOut').slide-three
      eg-transition(enter='bounceInLeft' leave='bounceOutRight')
        h3 Now {{ username }}, <br />see anything you like ?

    slide(enter='fadeIn' leave='fadeOut').slide-four
      eg-transition(enter='bounceInLeft' leave='bounceOutRight')
        h4 "OMG AN <b>EMBEDDED</b> SLIDESHOW I'M DYING <br /> I'VE NEVER SEEN ONE BEFORE <br /> BECAUSE I LIVE UNDER A ROCK"

    slide(:steps='4').slide-five
      eg-transition(leave='fadeOut')
        .subslide(v-if='step === 1')
          h3 Oh really {{ username }} ? <br /> Want some more ?
      eg-transition(enter='bounceInDown' leave='bounceOutDown')
        .subslide(v-if='step >= 2')
          h3(v-if='step===2') *Boom*
          h3(v-if='step===3') Roooo...
          h3(v-if='step===4') Hnnnnng...

          #ImageSlideshow.embedded-slideshow-container
            example-image-slideshow(:embedded='true', :preference='preference')

    slide.slide-six
      h3 That's all for today {{ username }} <br /> Hope you liked it
</template>

<script>
import eagle from 'eagle.js'
import ExampleImageSlideshow from './ExampleImageSlideshow'

export default {
  mixins: [eagle.slideshow],
  props: {
    preference: {default: 'baby bunnies'},
    username: {default: 'Tracy'}
  },
  data: function () {
    return {
      preloadedImages: {
        hiThere: 'http://i.imgur.com/ZLT46UN.jpg',
        hopeyoulikeit: 'http://i.imgur.com/N06RFlq.jpg',
        seeAnything: 'http://i.imgur.com/5EuWG4w.jpg',
        OmgEmbedded: 'http://i.imgur.com/wucwFvf.jpg',
        reallyok: 'http://i.imgur.com/qVTNk3Q.jpg',
        thatall: 'http://i.imgur.com/AExXJwF.jpg',
        bunny1: 'http://i.imgur.com/1PL2k1H.jpg',
        bunny2: 'http://i.imgur.com/GfFUcPQ.jpg',
        bunny3: 'http://i.imgur.com/et8w8Rn.gif',
        kitty1: 'https://i.imgur.com/P7iyH.png',
        kitty2: 'http://i.imgur.com/sHOqlJc.jpg',
        kitty3: 'http://i.imgur.com/wiAwNQZ.gif',
        puppy1: 'http://i.imgur.com/Scj7lzM.jpg',
        puppy2: 'http://i.imgur.com/FyFhTEE.jpg',
        puppy3: 'http://i.imgur.com/G62BWuI.gif'
      }
    }
  },
  infos: {
    title: 'Deadpool',
    description: 'Demo embedded slideshow',
    path: 'deadpool'
  },
  components: {
    'example-image-slideshow': ExampleImageSlideshow
  }
}
</script>

<style lang='scss'>
@import url(https://fonts.googleapis.com/css?family=Permanent+Marker);

#AwesomeEmbeddedSlideshow {
  @import 'node_modules/eagle.js/src/themes/base';
  .eg-slideshow {
    .eg-slide {
      .eg-slide-content, .subslide{
        width: 40em;
        max-width: 80%;
        margin: 0 auto;
        h1, h2, h3, h4, p {
          font-family: 'Permanent Marker', Impact;
          font-weight: normal;
        }
        p.thanks {
          color: gray;
          text-align: right;
          font-size: 1.3em;
        }
        em {
          font-style: normal;
          text-decoration: underline;
        }
      }
      background-repeat: no-repeat;
      background-color: white;
    }

    .slide-intro {
      background-image: url('http://i.imgur.com/ZLT46UN.jpg');
      background-position: center bottom;
      background-size: 28em;
    }
    .slide-two {
      background-image: url('http://i.imgur.com/N06RFlq.jpg');
      background-position: center bottom;
      background-size: 25em;
    }

    .slide-three {
      background-image: url('http://i.imgur.com/5EuWG4w.jpg');
      background-position: center bottom;
      background-size: 30em;
    }

    .slide-four {
      background-image: url('http://i.imgur.com/wucwFvf.jpg');
      background-position: right bottom;
      background-size: 17em;
    }

    .slide-five {
      background-image: url('http://i.imgur.com/qVTNk3Q.jpg');
      background-position: right bottom;
      background-size: 9em;
    }

    .slide-six {
      background-image: url('http://i.imgur.com/AExXJwF.jpg');
      background-position: center bottom;
      background-size: 30em;
    }
    #ImageSlideshow {
      position: relative;
      margin: 0 auto;
      width: 16em;
      height: 9em;
      box-shadow: 0 0 0.25em 0.25em #bbb;
    }
  }

}
</style>

I dont want to blow your mind, but right now,
your are in an inserted slideshow

Slideception !

So yeah, inserted slideshows, crazy right...

oh wait...
>bouncing in
Hi there Tracy. Seen any sweet Fluppy puppy lately ?

>Omg is that a slideshow embedded in a slideshow
deadpool: Oh im sorry, didn't mean to impress you

dp: Let me make it right with some of your favorite animals.

Oh yeah, oh oh, yeah


dp It's just a slideshow embedded in a slideshow embedded in an inserted slideshow
 But I really wouldn't want to blow your mind.

> Woooooow its

dp: So here is me
