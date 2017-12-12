/**
 * This file is part of the Ox Player library.
 * Full license text is available in the LICENSE file in root directory.
 */

import DOMUtils from '../utils/DOMUtils'
import MathUtils from '../utils/MathUtils'

export default class VolumeSlider {
    constructor(element) {
        this.element = element
        this.progressBar = DOMUtils.findChild(element, 'oxp-volume-slider-inner')

        this.init()
    }

    init() {
        this.element.addEventListener('mouseup', this.onMouseUp.bind(this))
        this.element.addEventListener('mousedown', this.onMouseDown.bind(this))
        this.element.addEventListener('mousemove', this.onMouseMove.bind(this))
    }

    onMouseUp() {
        this.isHolding = false
    }

    onMouseDown(event) {
        this.isHolding = true
        this.updateSliderBar(event.clientX)
    }

    onMouseMove(event) {
        if (this.isHolding) {
            this.updateSliderBar(event.clientX)
        }
    }

    updateSliderBar(mouseX) {
        var elementX = this.element.getBoundingClientRect().left
        var elementWidth = this.element.offsetWidth
        var diff = MathUtils.clamp(mouseX - elementX, 0, elementWidth)
        var value = diff / elementWidth
        this.setValue(value)

        if (this.listener !== null) {
            this.listener(value)
        }
    }

    /**
     * @param value number between 0 and 1
     */
    setValue(value) {
        this.progressBar.style.width = (value * 100) + '%'
    }

    addListener(listener) {
        this.listener = listener
    }
}