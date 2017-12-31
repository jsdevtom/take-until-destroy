import { Component, Directive, OnDestroy, OnInit } from '@angular/core'
import { interval } from 'rxjs/observable/interval'
import { Subscription } from 'rxjs/Subscription'
import { takeUntilDestroy } from './take-until-destroy'
import test, { AssertContext } from 'ava'

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

function testUnSubscription (declaration: AngularTestDeclaration, t: AssertContext) {
  declaration.ngOnInit()
  t.false(declaration.subscription.closed)

  declaration.ngOnDestroy()
  t.true(declaration.subscription.closed)
}

function shouldNotReplaceNgOnDestroyMoreThanOnce (declaration: AngularTestDeclaration, t: AssertContext) {
  const originalNgOnDestroy = declaration.ngOnDestroy

  declaration.ngOnInit()

  const secondNgOnDestroy = declaration.ngOnDestroy

  t.not(originalNgOnDestroy, secondNgOnDestroy)

  declaration.initSecondSub()

  const thirdNgOnDestroy = declaration.ngOnDestroy

  t.is(secondNgOnDestroy, thirdNgOnDestroy)
}

let comp: TestComponentWithTUD
let directive: TestDirective

test.beforeEach(() => {
  comp = new TestComponentWithTUD()
  directive = new TestDirective()
})

test('sanity', t => t.is(true, true))

test(`the stream should be unsubscribed from after ngOnDestroy is called`, t => {
  testUnSubscription(comp, t)
  testUnSubscription(directive, t)
})

test(`should not replace the ngOnDestroy method more than once`, t => {
  shouldNotReplaceNgOnDestroyMoreThanOnce(comp, t)
  shouldNotReplaceNgOnDestroyMoreThanOnce(directive, t)
})
