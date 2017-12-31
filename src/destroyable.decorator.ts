/**
 * A decorator that simply adds the ngOnDestroy method to the components's prototype so that
 * angular will call ngOnDestroy when the component is destroyed.
 *
 * @example
 * <pre><code>
 * @Destroyable
 * @Component({
 *   ...
 * })
 * export class ExampleComponent {}
 * </code></pre>
 * @type ClassDecorator
 * @alias src:Destroyable
 * @param {Object} target The angular component to be listened to.
 */
function Destroyable (target: Function) {
  if (!target.prototype.ngOnDestroy) {
    target.prototype.ngOnDestroy = function () {
      //
    }
  }
}

export { Destroyable }
