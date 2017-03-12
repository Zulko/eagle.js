<template lang="pug">
eg-transition(:enter='enter', :leave='leave')
  .eg-slide(v-if='active')
    .eg-slide-content
      h3 Secret Slide !
      eg-transition(leave='fadeOutLeft', enter='fadeIn')
        .subslide(v-if='step <= 3')
          p.
            Congratulations ! By switching off the totality of this slideshow you
            unlocked the <b>secret slide</b>.
          p.
            Wanna know Eagle's secret ? It rocks at animating SVG!
            Below is a single SVG animated by inserting CSS and <b>v-if</b> directives.
          .center.included-svg
            include assets/animated.svg
      eg-transition(enter='slideInRight', leave='fadeOutRight')
        .subslide(v-if='step >3')
          p.center And if you like plots, you can use awesome libraries like Chart.js
          .figure
            p.caption(v-html='title')
            chart(:data='figureData(step)', :options='figureOptions', type='bar',
                  :height='250')
</template>
<script>
import eagle from 'eagle.js'
import chart from './Chart'
export default {
  components: { chart },
  props: {
    steps: {default: 5}
  },
  data: function () {
    return {
      figureOptions: {
        legend: {
          display: false
        },
        animation: {
          duration: 1000
        },
        scales: {
          yAxes: [{
            ticks: {
              fontFamily: 'Pompiere',
              fontSize: 20,
              callback: function (value) {
                console.log('cb', value)
                if (value % 10000) {
                  return null
                } else if (value) {
                  return (value / 1000) + 'k'
                } else {
                  return 0
                }
              },
              min: 0,
              max: 99000
            }
          }],
          xAxes: [{
            gridLines: {
              display: false
            },
            ticks: {
              fontFamily: 'Pompiere',
              fontSize: 28
            }
          }]
        }
      }
    }
  },
  computed: {
    title: function () {
      var line = 'Github stars of top slideshow frameworks - '
      if (this.step <= 4) {
        return line + 'March 2017'
      } else {
        return line + 'March 2018 projections'
      }
    }
  },
  methods: {
    figureData: function (step) {
      return {
        labels: ['Reveal.JS', 'Impress.JS', 'Shower.JS', 'Eagle.JS'],
        datasets: [{
          label: 'Stars',
          data: (step === 4 ? [33000, 31000, 3500, 1] : [55000, 47000, 11500, 95000]),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      }
    }
  },
  mixins: [eagle.slide]
}
</script>
<style lang='scss' scoped>
.eg-slide {
  .eg-slide-content {
    // FIGURE AND CAPTIONS
    .figure {
      p {
        font-size: 0.7em;
        margin-top: 2em;
        margin-bottom: 0;
        color: #555;
      }
      width: 80%;
      margin-left: 10%;
    }
    // SVG ANIMATIONS
    .included-svg {
      width: 80%;
      margin-left: 10%;
      g path {
        transform-origin: center bottom;
        animation-duration: 1s;
        animation-fill-mode: both;
        animation-iteration-count: infinite;
      }
      .svg-bounce path {
        -webkit-animation-name: bounce;
        transform-origin: center bottom;
      }
      .svg-pulse path {
        -webkit-animation-name: pulse;
        -moz-animation-name: bounce;
        transform-origin: center center;
      }
      .svg-swing path {
        -webkit-animation-name: swing;
        -moz-animation-name: bounce;
        transform-origin: center center;
      }
    }

  }
}
</style>
