"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const takeUntil_1 = require("rxjs/operators/takeUntil");
const error_messages_1 = require("./error-messages");
// Compose the operator:
/**
 * An RxJs operator which takes an Angular class instance as a parameter. When the component is destroyed, the stream will be
 * unsubscribed from.
 *
 * <b>Important:</b> Make sure you have either {@link Destroyable @Destroyable} decorating your class like so:
 * <pre><code>
 * @Destroyable
 * @Component({
 *   ...
 * })
 * export class ExampleComponent {}
 * </code></pre>
 *
 * or that your class implements OnDestroy like so:
 * <pre><code>
 * @Component({
 *   ...
 * })
 * export class ExampleComponent implements OnDestroy {
 *    ngOnDestroy () {}
 * }
 * </code></pre>
 *
 * @example
 * <pre><code>
 * ngOnInit() {
 *   this.randomObservable
 *     .pipe(takeUntilDestroy(this))
 *     .subscribe((val) => console.log(val))
 * }
 * </code></pre>
 * @param {Object} target (normally `this`)
 * @returns {Observable<T>}
 */
exports.takeUntilDestroy = (target) => (stream) => {
    const targetPrototype = Object.getPrototypeOf(target);
    const originalDestroy = targetPrototype.ngOnDestroy;
    if (!(originalDestroy && typeof originalDestroy === 'function')) {
        throw new Error(error_messages_1.ErrorMessages.NO_NGONDESTROY);
    }
    const destroy$ = new rxjs_1.Subject();
    targetPrototype.ngOnDestroy = function () {
        originalDestroy.apply(this, arguments);
        destroy$.next();
        destroy$.complete();
    };
    return stream.pipe(takeUntil_1.takeUntil(destroy$));
};
//# sourceMappingURL=take-until-destroy.js.map