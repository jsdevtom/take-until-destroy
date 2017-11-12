"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const of_1 = require("rxjs/observable/of");
const interval_1 = require("rxjs/observable/interval");
const destroyable_decorator_1 = require("./destroyable.decorator");
const error_messages_1 = require("./error-messages");
const take_until_destroy_1 = require("./take-until-destroy");
let testClassWithDec;
let testClassWithoutDec;
let TestClassWithDec = class TestClassWithDec {
    constructor() {
        this.bob = 'bob';
        this.stream$ = interval_1.interval(1000);
    }
    ngOnInit() {
        this.subscription = this.stream$.pipe(take_until_destroy_1.takeUntilDestroy(this)).subscribe();
    }
    ngOnDestroy() {
        return this.bob;
    }
};
TestClassWithDec = __decorate([
    destroyable_decorator_1.Destroyable
], TestClassWithDec);
class TestClassWithoutDec {
    constructor() {
        this.bob = 'bob';
    }
    ngOnInit() {
        of_1.of(1, 2, 3, 4, 5, 6).pipe(take_until_destroy_1.takeUntilDestroy(this)).subscribe();
    }
}
ava_1.default.beforeEach(() => {
    testClassWithDec = new TestClassWithDec();
    testClassWithoutDec = new TestClassWithoutDec();
});
ava_1.default(`throw error NO_NGONDESTROY if the class DOESN'T have a ngOnDestroy method`, (t) => {
    const error = t.throws(() => testClassWithoutDec.ngOnInit());
    t.is(error.message, error_messages_1.ErrorMessages.NO_NGONDESTROY);
});
ava_1.default(`the stream should be unsubscribed from after ngOnDestroy is called`, (t) => {
    testClassWithDec.ngOnInit();
    t.false(testClassWithDec.subscription.closed);
    testClassWithDec.ngOnDestroy();
    t.true(testClassWithDec.subscription.closed);
});
//# sourceMappingURL=take-until-destroy.spec.js.map