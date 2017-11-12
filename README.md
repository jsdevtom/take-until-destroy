# take-until-destroy
A simple way to unsubscribe from an RxJs stream in Angular (2+) when the component is destroyed

[![Coverage Status](https://coveralls.io/repos/jsdevtom/take-until-destroy/badge.svg?branch=master)](https://coveralls.io/r/jsdevtom/take-until-destroy?branch=master) [![Build Status](https://travis-ci.org/jsdevtom/take-until-destroy.svg?branch=master)](https://travis-ci.org/jsdevtom/take-until-destroy) [![Dependencies](https://david-dm.org/jsdevtom/take-until-destroy.svg)](https://david-dm.org/jsdevtom/take-until-destroy.svg)

```typescript
 import {Destroyable} from 'take-until-destroy'
 import 'take-until-destroy/takeUntilDestroy'
 
 @Destroyable
 @Component({
   ...
 })
 export class ExampleComponent {
    constructor(randomService: RandomService) {
        randomService.getObservable
            .takeUntilDestroy(this)
            .subscribe(v => {
                console.log(v)
            })
    }
 }
``` 
 If you have already implemented `OnDestroy`, you don't need the `@Destroyable` decorator.
