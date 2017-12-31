"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
function Destroyable(target) {
    if (!target.prototype.ngOnDestroy) {
        target.prototype.ngOnDestroy = function () {
            //
        };
    }
}
exports.Destroyable = Destroyable;
//# sourceMappingURL=destroyable.decorator.js.map