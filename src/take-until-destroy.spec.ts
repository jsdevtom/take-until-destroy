import test, { TestContext } from 'ava';
import { interval, of, Subscription } from 'rxjs';
import { Destroyable } from './destroyable.decorator';
import { ErrorMessages } from './error-messages';
import { takeUntilDestroy } from './take-until-destroy';

let testClassWithDec: TestClassWithDec
let testClassWithoutDec: TestClassWithoutDec

@Destroyable
class TestClassWithDec {
  bob = 'bob'
  stream$ = interval(1000)

  subscription!: Subscription

  ngOnInit () {
    this.subscription = this.stream$.pipe(
        takeUntilDestroy(this)
    ).subscribe()
  }

  ngOnDestroy () {
    return this.bob
  }
}

class TestClassWithoutDec {
  bob = 'bob'

  ngOnInit () {
    of(1, 2, 3, 4, 5, 6).pipe(
        takeUntilDestroy(this)
    ).subscribe()
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
