import Vue from 'vue'
import { mount } from '@vue/test-utils'
import Slideshow from '../fixtures/simpleSlideshow.vue'
import ComplexSlideshow from '../fixtures/complexSlideshow.vue'

let wrapper, vm

beforeEach(() => {
  wrapper = mount(Slideshow, {
    attachToDocument: true
  })
  vm = wrapper.vm
})

describe('Slideshow initilization', () => {
  it('has correct slides count', () => {
    expect(vm.slides.length).toBe(4)
  })

  it('has set current slide', () => {
    expect(vm.currentSlideIndex).toBe(1)    
  })

  it('has the correct active slide', () => {
    expect(vm.slides[0].active).toBeTruthy()
  })
})

describe('Slideshow pre/next', () => {
  it('Slideshow goes to next slide when current slide\'s step run out', done => {
    vm.nextStep()
    setTimeout(() => {
      expect(vm.slides[0].active).toBeFalsy()
      expect(vm.slides[1].active).toBeTruthy()
      done()
    }, 1000)
  })

  it('Slideshow goes to prev slide when current slide\'s step run out', done => {
    vm.currentSlideIndex = 2
    vm.previousStep()
    setTimeout(() => {
      expect(vm.slides[1].active).toBeFalsy()
      expect(vm.slides[0].active).toBeTruthy()
      done()
    }, 1000)
  })

  it('Slideshow sets correct step within current slide', done => {
    vm.currentSlideIndex = 3
    vm.nextStep()
    setTimeout(() => {
      expect(vm.slides[2].active).toBeTruthy()
      expect(vm.step).toBe(2)
      done()
    }, 1000)
  })
})

describe('Slideshow events', () => {
  it('left arrow would perform prev', () => {
    const spy = jest.spyOn(vm, 'previousStep')
    wrapper.trigger('keydown', {
      key: 'ArrowLeft'
    })
    expect(spy).toHaveBeenCalled()
    
    spy.mockReset()
    spy.mockRestore()
  })

  it('right arrow would perform next', () => {
    const spy = jest.spyOn(vm, 'nextStep')
    wrapper.trigger('keydown', {
      key: 'ArrowRight'
    })
    expect(spy).toHaveBeenCalled()
    
    spy.mockReset()
    spy.mockRestore()
  })

  it('wheel would perform next', done => {
    const spy = jest.spyOn(vm, 'nextStep')
    wrapper.trigger('wheel', {
      deltaY: 100
    })
    setTimeout(() => { 
      expect(spy).toHaveBeenCalled()
      spy.mockReset()
      spy.mockRestore()
      done()
    }, 1000)
  })

  it('wheel event is throttled', done => {
    const spy = jest.spyOn(vm, 'nextStep')
    wrapper.trigger('wheel', {
      deltaY: 100
    })
    wrapper.trigger('wheel', {
      deltaY: 100
    })
   
    setTimeout(() => { 
      expect(spy).toHaveBeenCalledTimes(1)
      spy.mockReset()
      spy.mockRestore()
      done()
    }, 1000)
  })
})

describe('Slideshow back mode', () => {
  it('go back by slide would result to previous slide first step', done => {
    wrapper = mount(ComplexSlideshow, {
      attachToDocument: true,
      propsData: {
        backBySlide: true
      }
    })
    vm = wrapper.vm
    vm.currentSlideIndex = 3
    vm.previousStep()
    setTimeout(() => {
      expect(vm.slides[1].active).toBeTruthy()
      expect(vm.step).toBe(1)
      done()
    }, 1000)
  })

  it('go back by step would result to previous slide last step', done => {
    wrapper = mount(ComplexSlideshow)
    vm = wrapper.vm
    vm.currentSlideIndex = 3
    // need to wait watcher funciton finishes for currentSlideIndex
    setTimeout(() => {
      vm.previousStep()
    }, 500);
    setTimeout(() => {
      expect(vm.slides[1].active).toBeTruthy()
      expect(vm.step).toBe(5)
      done()
    }, 1000)
  })
})

describe('Slideshow properties', () => {
  it('default value matches', () => {
    wrapper = mount(Slideshow)
    expect(wrapper.props().firstSlide).toBe(1)
    expect(wrapper.props().startStep).toBe(1)
    expect(wrapper.props().lastSlide).toBe(null)
    expect(wrapper.props().embedded).toBe(false)
    expect(wrapper.props().inserted).toBe(false)
    expect(wrapper.props().keyboardNavigation).toBe(true)
    expect(wrapper.props().mouseNavigation).toBe(true)
    expect(wrapper.props().firstSlide).toBe(1)
    expect(wrapper.props().skip).toBe(false)
    expect(wrapper.props().backBySlide).toBe(false)
    expect(wrapper.props().repeat).toBe(false)
  })

  it('user set props matches', () => {
    wrapper = mount(Slideshow, {
      attachToDocument: true,
      propsData: {
        firstSlide: 2,
        startStep: 2,
        lastSlide: 3,
        embedded: true,
        inserted: true,
        keyboardNavigation: false,
        mouseNavigation: false,
        skip: true,
        backBySlide: true,
        repeat: true
      }
    })
    expect(wrapper.props().firstSlide).toBe(2)
    expect(wrapper.props().startStep).toBe(2)
    expect(wrapper.props().lastSlide).toBe(3)
    expect(wrapper.props().embedded).toBe(true)
    expect(wrapper.props().inserted).toBe(true)
    expect(wrapper.props().keyboardNavigation).toBe(false)
    expect(wrapper.props().mouseNavigation).toBe(false)
    expect(wrapper.props().skip).toBe(true)
    expect(wrapper.props().backBySlide).toBe(true)
    expect(wrapper.props().repeat).toBe(true)
  })

  it('props work in slideshow initialization', () => {
    wrapper = mount(Slideshow, {
      attachToDocument: true,
      propsData: {
        firstSlide: 2,
        startStep: 2,
        lastSlide: 3,
        embedded: true,
        inserted: true,
        keyboardNavigation: false,
        mouseNavigation: false,
        skip: true,
        backBySlide: true
      }
    })
    vm = wrapper.vm
    expect(vm.step).toBe(2)
    expect(vm.slides.length).toBe(2)
  })

  it('repeat prop for slideshow ', () => {
    wrapper = mount(Slideshow, {
      attachToDocument: true,
      propsData: {
        firstSlide: 4,
        startStep: 4,
        repeat: true
      }
    })
    vm = wrapper.vm
    vm.nextStep()
    setTimeout(() => {
      expect(vm.slides[1].active).toBeTruthy()
      expect(vm.step).toBe(1)
      done()
    }, 1000)
  })
})