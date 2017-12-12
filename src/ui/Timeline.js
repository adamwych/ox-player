/**
 * This file is part of the Ox Player library.
 * Full license text is available in the LICENSE file in root directory.
 */

import DOMUtils from '../utils/DOMUtils'

export default class Timeline {
    /**
     * @param player
     */
    constructor(player) {
        this.player = player
        this.duration = 0
    }

    initializeElements(root) {
        this.timelineRoot    = DOMUtils.findChild(root, 'oxp-timeline')
        this.progressBar     = DOMUtils.findChild(root, 'oxp-timeline-progressbar')
        this.currentTimeText = DOMUtils.findChild(root, 'oxp-timer-current')
        this.durationText    = DOMUtils.findChild(root, 'oxp-timer-duration')

        this.timelineRoot.addEventListener('click', this.onTimelineClick.bind(this))
        this.player.videoElement.addEventListener('timeupdate', (e) => {
            this.currentTime = this.player.videoElement.currentTime
            this.duration = this.player.videoElement.duration
            this.updateProgress()
        })
    }

    updateProgress() {
        this.progressBar.style.width = ((this.currentTime / this.duration) * 100) + '%';
        this.currentTimeText.innerHTML = this.formatTime(this.currentTime)
    }

    updateDuration() {
        this.duration = this.player.videoElement.duration
        this.durationText.innerHTML = '/ ' + this.formatTime(this.duration)
    }

    onTimelineClick(event) {
        var mouseX = event.clientX
        var elementX = this.timelineRoot.getBoundingClientRect().left
        var elementWidth = this.timelineRoot.offsetWidth
        var diff = mouseX - elementX
        var value = diff / elementWidth

        this.currentTime = value * this.duration
        this.updateProgress()

        if (this.listener !== null) {
            this.listener(value * this.duration)
        }
    }

    formatTime(time) {
        var minutes = Math.floor(time / 60)
        if (minutes < 10) {
            minutes = '0' + minutes;
        }

        var seconds = Math.floor(time) - (minutes * 60)
        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        return minutes + ':' + seconds;
    }

    addListener(listener) {
        this.listener = listener
    }
}