# take-until-destroy
A simple way to unsubscribe from an **RxJs** stream in **Angular (5.1+)** when the component is destroyed

For an overview of how this works see [this post about unsubscription in angular](https://toms.blog/auto-unsubscribing-in-angular/)

[![Coverage Status](https://coveralls.io/repos/jsdevtom/take-until-destroy/badge.svg?branch=master)](https://coveralls.io/r/jsdevtom/take-until-destroy?branch=master) [![Build Status](https://travis-ci.org/jsdevtom/take-until-destroy.svg?branch=master)](https://travis-ci.org/jsdevtom/take-until-destroy) [![Dependencies](https://david-dm.org/jsdevtom/take-until-destroy.svg)](https://david-dm.org/jsdevtom/take-until-destroy.svg) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


## Installation
`npm install take-until-destroy --save` || `yarn add take-until-destroy`

## Use
```typescript
 import { Destroyable, takeUntilDestroy } from 'take-until-destroy'
 
 // If you have already implemented `OnDestroy`, you don't need the `@Destroyable` decorator.
 @Destroyable
 @Component({
   ...
 })
 export class ExampleComponent {
    constructor(randomService: RandomService) {
        randomService.getObservable
            .pipe(takeUntilDestroy(this))
            .subscribe(v => {
                console.log(v)
            })
    }
 }
``` 

## Known Issues
The `@Destroyable` decorator doesn't work in production. See https://github.com/jsdevtom/take-until-destroy/issues/7 for updates. The current fully working work around is to simply implement `OnDestroy` for you component and it will work as expected. Example:
```typescript
 import { Destroyable, takeUntilDestroy } from 'take-until-destroy'
 
 // If you have already implemented `OnDestroy`, you don't need the `@Destroyable` decorator.
 @Component({
   ...
 })
 export class ExampleComponent implements OnDestroy {
    constructor(randomService: RandomService) {
        randomService.getObservable
            .pipe(takeUntilDestroy(this))
            .subscribe(v => {
                console.log(v)
            })
    }
    
    ngOnDestroy() {/**/}
 }
``` 

