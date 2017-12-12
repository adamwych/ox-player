/**
 * This file is part of the Ox Player library.
 * Full license text is available in the LICENSE file in root directory.
 */

export default class DOMUtils {
    /**
     * Tries to find an element with given class name in specified node or its children.
     *
     * @param node
     * @param childName
     * @return the element or null
     */
    static findChild(node, childName) {
        var childrenNumber = node.childNodes.length

        for (var i = 0; i < childrenNumber; i++) {
            var child = node.childNodes[i]
            if (child.className && child.className.indexOf(childName) !== -1) {
                return child
            }

            var c = DOMUtils.findChild(child, childName)
            if (c !== null) {
                return c
            }
        }

        return null
    }
}