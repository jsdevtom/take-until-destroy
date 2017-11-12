"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
require("rxjs/add/operator/takeUntil");
const error_messages_1 = require("./error-messages");
// Compose the operator:
/**
 * An augmentation which takes an Angular class instance. When the component is destroyed, the stream will be
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
 *     .takeUntilDestroy(this)
 *     .subscribe((val) => console.log(val))
 * }
 * </code></pre>
 * @param {Object} target (normally `this`)
 * @returns {Observable<T>}
 */
function takeUntilDestroy(target) {
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
    return this.takeUntil(destroy$);
}
exports.takeUntilDestroy = takeUntilDestroy;
// Add the operator to the Observable prototype:
rxjs_1.Observable.prototype.takeUntilDestroy = takeUntilDestroy;
//# sourceMappingURL=take-until-destroy.js.map