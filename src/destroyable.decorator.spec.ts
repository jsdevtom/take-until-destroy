import test, { TestContext } from 'ava'
import { Destroyable } from './destroyable.decorator'

let testClassWith: TestClassWith
let testClassWithout: TestClassWithout

@Destroyable
class TestClassWith {
  bob = 'bob'
  ngOnDestroy () {
    return this.bob
  }
}

@Destroyable
class TestClassWithout {
  bob = 'bob'
}

test.beforeEach(() => {
  testClassWith = new TestClassWith()
  testClassWithout = new TestClassWithout()
})

test(`It shouldn't add a new 'ngOnInit' method to classes that already have one`, (t: TestContext) => {
  t.true(testClassWith.ngOnDestroy() === 'bob')
})

test(`It should add a new 'ngOnInit' method to classes that DON'T already have one`, (t: TestContext) => {
    // anyed because typescript is not yet capable of checking the decorator's dynamic
    // attachment of the ngOnDestroy method
  t.truthy((testClassWithout as any).ngOnDestroy)
  t.is(typeof (testClassWithout as any).ngOnDestroy, 'function')
})
