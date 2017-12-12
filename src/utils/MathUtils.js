/**
 * This file is part of the Ox Player library.
 * Full license text is available in the LICENSE file in root directory.
 */

export default class MathUtils {
    static clamp(value, min, max) {
        if (value > max) {
            return max
        }

        if (value < min) {
            return min
        }

        return value
    }
}