"use strict";
exports.__esModule = true;
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
 *
 * @alias src:Destroyable
 * @param {Object} target The angular component to be listened to.
 */
exports.Destroyable = function Destroyable(target) {
    if (!target.prototype.ngOnDestroy) {
        target.prototype.ngOnDestroy = function () {
            //
        };
    }
};
