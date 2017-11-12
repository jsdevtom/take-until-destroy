import { Observable, Subject } from 'rxjs'
import 'rxjs/add/operator/takeUntil'
import { ErrorMessages } from './error-messages'

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
export function takeUntilDestroy<T> (this: Observable<T>, target: Object): Observable<T> {
  const targetPrototype = Object.getPrototypeOf(target)
  const originalDestroy = targetPrototype.ngOnDestroy

  if (!(originalDestroy && typeof originalDestroy === 'function')) {
    throw new Error(ErrorMessages.NO_NGONDESTROY)
  }

  const destroy$ = new Subject<null>()

  targetPrototype.ngOnDestroy = function () {
    originalDestroy.apply(this, arguments)

    destroy$.next()
    destroy$.complete()
  }

  return this.takeUntil(destroy$)
}

// Add the operator to the Observable prototype:
Observable.prototype.takeUntilDestroy = takeUntilDestroy

// Extend the TypeScript interface for Observable to include the operator:
declare module 'rxjs/Observable' {

    interface Observable<T> {
      takeUntilDestroy: typeof takeUntilDestroy
    }
}
