"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const interval_1 = require("rxjs/observable/interval");
const take_until_destroy_1 = require("./take-until-destroy");
const ava_1 = require("ava");
let TestDirective = class TestDirective {
    constructor() {
        this.bob = 'bob';
        this.intervalMs = 1000;
        this.stream$ = interval_1.interval(this.intervalMs);
    }
    ngOnInit() {
        this.subscription = this.stream$.pipe(take_until_destroy_1.takeUntilDestroy(this)).subscribe();
    }
    initSecondSub() {
        this.subscription2 = this.stream$.pipe(take_until_destroy_1.takeUntilDestroy(this)).subscribe();
    }
    ngOnDestroy() {
        return this.bob;
    }
};
TestDirective = __decorate([
    core_1.Directive({
        selector: 'app-any'
    })
], TestDirective);
let TestComponentWithTUD = class TestComponentWithTUD {
    constructor() {
        this.bob = 'bob';
        this.intervalMs = 1000;
        this.stream$ = interval_1.interval(this.intervalMs);
    }
    ngOnInit() {
        this.subscription = this.stream$.pipe(take_until_destroy_1.takeUntilDestroy(this)).subscribe();
    }
    initSecondSub() {
        this.subscription2 = this.stream$.pipe(take_until_destroy_1.takeUntilDestroy(this)).subscribe();
    }
    ngOnDestroy() {
        return this.bob;
    }
};
TestComponentWithTUD = __decorate([
    core_1.Component({
        selector: 'app-random',
        template: ''
    })
], TestComponentWithTUD);
function testUnSubscription(declaration, t) {
    declaration.ngOnInit();
    t.false(declaration.subscription.closed);
    declaration.ngOnDestroy();
    t.true(declaration.subscription.closed);
}
function shouldNotReplaceNgOnDestroyMoreThanOnce(declaration, t) {
    const originalNgOnDestroy = declaration.ngOnDestroy;
    declaration.ngOnInit();
    const secondNgOnDestroy = declaration.ngOnDestroy;
    t.not(originalNgOnDestroy, secondNgOnDestroy);
    declaration.initSecondSub();
    const thirdNgOnDestroy = declaration.ngOnDestroy;
    t.is(secondNgOnDestroy, thirdNgOnDestroy);
}
let comp;
let directive;
ava_1.default.beforeEach(() => {
    comp = new TestComponentWithTUD();
    directive = new TestDirective();
});
ava_1.default('sanity', t => t.is(true, true));
ava_1.default(`the stream should be unsubscribed from after ngOnDestroy is called`, t => {
    testUnSubscription(comp, t);
    testUnSubscription(directive, t);
});
ava_1.default(`should not replace the ngOnDestroy method more than once`, t => {
    shouldNotReplaceNgOnDestroyMoreThanOnce(comp, t);
    shouldNotReplaceNgOnDestroyMoreThanOnce(directive, t);
});
//# sourceMappingURL=take-until-destroy.integration.spec.js.map