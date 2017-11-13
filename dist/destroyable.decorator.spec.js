"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const destroyable_decorator_1 = require("./destroyable.decorator");
let testClassWith;
let testClassWithout;
let TestClassWith = class TestClassWith {
    constructor() {
        this.bob = 'bob';
    }
    ngOnDestroy() {
        return this.bob;
    }
};
TestClassWith = __decorate([
    destroyable_decorator_1.Destroyable
], TestClassWith);
let TestClassWithout = class TestClassWithout {
    constructor() {
        this.bob = 'bob';
    }
};
TestClassWithout = __decorate([
    destroyable_decorator_1.Destroyable
], TestClassWithout);
ava_1.default.beforeEach(() => {
    testClassWith = new TestClassWith();
    testClassWithout = new TestClassWithout();
});
ava_1.default(`It shouldn't add a new 'ngOnInit' method to classes that already have one`, (t) => {
    t.true(testClassWith.ngOnDestroy() === 'bob');
});
ava_1.default(`It should add a new 'ngOnInit' method to classes that DON'T already have one`, (t) => {
    // anyed because typescript is not yet capable of checking the decorator's dynamic
    // attachment of the ngOnDestroy method
    t.truthy(testClassWithout.ngOnDestroy);
    t.is(typeof testClassWithout.ngOnDestroy, 'function');
});
//# sourceMappingURL=destroyable.decorator.spec.js.map