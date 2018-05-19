import { Subject, MonoTypeOperatorFunction } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { Observable } from 'rxjs/internal/Observable'

import { ErrorMessages } from './error-messages'

/**
 * A Map where the component instance is stored as the key
 * and the destroy$ subject as the value
 * @type {WeakMap<Object, Observable>}
 */
const instanceDestroy$Map = new WeakMap()

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
export const takeUntilDestroy = <T>(target: any): MonoTypeOperatorFunction<T> => <T>(stream: Observable<T>): Observable<T> => {
  const originalDestroy = target.ngOnDestroy

  if (!(originalDestroy && typeof originalDestroy === 'function')) {
    throw new Error(ErrorMessages.NO_NGONDESTROY)
  }

  if (instanceDestroy$Map.has(target)) {
    const destroy$FoundInMap: Observable<null> = instanceDestroy$Map.get(target)
    return stream.pipe(takeUntil(destroy$FoundInMap))
  }

  const newDestroy$ = new Subject<null>()

  instanceDestroy$Map.set(target, newDestroy$.asObservable())

  target.ngOnDestroy = function () {
    originalDestroy.apply(this, arguments)

    newDestroy$.next()
    newDestroy$.complete()
  }

  return stream.pipe(takeUntil(newDestroy$.asObservable()))
}
