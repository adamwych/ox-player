/**
 * This file is part of the Ox Player library.
 * Full license text is available in the LICENSE file in root directory.
 */

import Player from './core/Player'

// Add custom jQuery function to easily initialize the player, if jQuery is included.
if (typeof jQuery !== 'undefined') {
    $.fn.extend({
        oxPlayer: function (options) {
            return new Player(this[0], options)
        }
    })
}
