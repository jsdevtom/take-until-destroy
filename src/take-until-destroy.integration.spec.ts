import { Component, Directive, OnDestroy, OnInit } from '@angular/core'
import { interval } from 'rxjs/observable/interval'
import { Subscription } from 'rxjs/Subscription'
import { takeUntilDestroy } from './take-until-destroy'

interface AngularTestDeclaration extends OnInit, OnDestroy {
  subscription: Subscription
  subscription2: Subscription
  initSecondSub: Function
}

@Directive({
  selector: 'app-any'
})
class TestDirective implements AngularTestDeclaration {
  bob = 'bob'
  intervalMs = 1000
  stream$ = interval(this.intervalMs)

  subscription: Subscription
  subscription2: Subscription

  ngOnInit () {
    this.subscription = this.stream$.pipe(
            takeUntilDestroy(this)
        ).subscribe()
  }

  initSecondSub () {
    this.subscription2 = this.stream$.pipe(
            takeUntilDestroy(this)
        ).subscribe()
  }

  ngOnDestroy () {
    return this.bob
  }
}

@Component({
  selector: 'app-random',
  template: ''
})
class TestComponentWithTUD implements AngularTestDeclaration {
  bob = 'bob'
  intervalMs = 1000
  stream$ = interval(this.intervalMs)

  subscription: Subscription
  subscription2: Subscription

  ngOnInit () {
    this.subscription = this.stream$.pipe(
            takeUntilDestroy(this)
        ).subscribe()
  }

  initSecondSub () {
    this.subscription2 = this.stream$.pipe(
            takeUntilDestroy(this)
        ).subscribe()
  }

  ngOnDestroy () {
    return this.bob
  }
}

function testUnSubscription (declaration: AngularTestDeclaration) {
  declaration.ngOnInit()
  expect(declaration.subscription.closed).toBeFalsy()

  declaration.ngOnDestroy()
  expect(declaration.subscription.closed).toBeTruthy()
}

function shouldNotReplaceNgOnDestroyMoreThanOnce (declaration: AngularTestDeclaration) {
  const originalNgOnDestroy = declaration.ngOnDestroy

  declaration.ngOnInit()

  const secondNgOnDestroy = declaration.ngOnDestroy

  expect(originalNgOnDestroy).not.toBe(secondNgOnDestroy)

  declaration.initSecondSub()

  const thirdNgOnDestroy = declaration.ngOnDestroy

  expect(secondNgOnDestroy).toBe(thirdNgOnDestroy)
}

describe('takeUntilDestroy', () => {

  let comp: TestComponentWithTUD
  let directive: TestDirective

  beforeEach(() => {
    comp = new TestComponentWithTUD()
    directive = new TestDirective()
  })

  describe('sanity', () => {
    it('true is true', () => expect(true).toBe(true))
  })

  it(`the stream should be unsubscribed from after ngOnDestroy is called`, () => {
    testUnSubscription(comp)
    testUnSubscription(directive)
  })

  it(`should not replace the ngOnDestroy method more than once`, () => {
    shouldNotReplaceNgOnDestroyMoreThanOnce(comp)
    shouldNotReplaceNgOnDestroyMoreThanOnce(directive)
  })
})
