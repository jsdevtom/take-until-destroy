import test, { TestContext } from 'ava'
import { Observable } from 'rxjs/Observable'
import { Destroyable } from './destroyable.decorator'
import { ErrorMessages } from './error-messages'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/map'
import './take-until-destroy'
import { Subscription } from 'rxjs/Subscription'

let testClassWithDec: TestClassWithDec
let testClassWithoutDec: TestClassWithoutDec

@Destroyable
class TestClassWithDec {
  bob = 'bob'
  stream$ = Observable.interval(1000)
      .takeUntilDestroy(this)

  subscription: Subscription

  ngOnInit () {
    this.subscription = this.stream$.subscribe()
  }

  ngOnDestroy () {
    return this.bob
  }
}

class TestClassWithoutDec {
  bob = 'bob'

  ngOnInit () {
    Observable.of(1, 2, 3, 4, 5, 6)
            .takeUntilDestroy(this)
  }
}

test.beforeEach(() => {
  testClassWithDec = new TestClassWithDec()
  testClassWithoutDec = new TestClassWithoutDec()
})

test(`throw error NO_NGONDESTROY if the class DOESN'T have a ngOnDestroy method`, (t: TestContext) => {
  const error = t.throws(() => testClassWithoutDec.ngOnInit())
  t.is(error.message, ErrorMessages.NO_NGONDESTROY)
})

test(`the stream should be unsubscribed from after ngOnDestroy is called`, (t: TestContext) => {
  testClassWithDec.ngOnInit()
  t.false(testClassWithDec.subscription.closed)

  testClassWithDec.ngOnDestroy()
  t.true(testClassWithDec.subscription.closed)
})
