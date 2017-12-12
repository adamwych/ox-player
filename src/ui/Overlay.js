/**
 * This file is part of the Ox Player library.
 * Full license text is available in the LICENSE file in root directory.
 */

import Controls from './Controls'
import Timeline from './Timeline'
import Velocity from 'velocity-animate'

/** This class is responsible for managing Ox Player's overlay above the video. */
export default class Overlay {
    /**
     * @param player
     */
    constructor(player) {
        this.player = player
    }

    /**
     * Creates the overlay.
     */
    createElements() {
        this.rootNode = document.createElement('div')
        this.rootNode.className = 'oxplayer-overlay-root'
        this.rootNode.addEventListener('mousemove', this.onMouseMoved.bind(this))
        this.rootNode.addEventListener('mouseleave', this.onMouseLeft.bind(this))

        this.controls = new Controls(this.player)
        this.controls.createElements(this.rootNode)

        this.timeline = new Timeline(this.player)
        this.timeline.initializeElements(this.rootNode)
        this.timeline.addListener((value) => {
            this.player.setCurrentTime(value)
        })
    }

    onMouseMoved(e) {
        this.lastMouseX = e.clientX
        this.lastMouseY = e.clientY

        if (!this.controlsVisible) {
            this.rootNode.style.cursor = 'default'

            this.controlsShowMouseX = this.lastMouseX
            this.controlsShowMouseY = this.lastMouseY

            this.showControls()
        }

        if (this.checkControls && this.player.isPlaying) {
            clearInterval(this.controlsInterval)

            this.controlsShowMouseX = this.lastMouseX
            this.controlsShowMouseY = this.lastMouseY

            // Hide controls if mouse is not moving for more than 2 seconds.
            this.controlsInterval = setTimeout(() => {
                if (this.controlsVisible) {
                    if (this.lastMouseX == this.controlsShowMouseX &&
                        this.lastMouseY == this.controlsShowMouseY)
                    {
                        this.rootNode.style.cursor = 'none'
                        this.hideControls()
                    } else {
                        this.checkControls = true
                    }
                }
            }, 2000)
        }
    }

    onMouseLeft() {
        if (this.player.isPlaying) {
            this.hideControls()
        }
    }

    /**
     * Shows the controls.
     */
    showControls() {
        this.controlsVisible = true
        this.checkControls = true
        this.controls.show()
    }

    /**
     * Hides the controls.
     */
    hideControls() {
        this.controlsVisible = false
        this.checkControls = false
        this.controls.hide()
    }

    /**
     * Shows a circular notification in the center of the player.
     * @param text
     */
    showCircularNotification(text) {
        var notification = document.createElement('div');
        notification.className = 'oxplayer-notification oxplayer-circle';
        notification.innerHTML = text;

        // Velocity ignores initial transform values to achieve better optimization,
        // so setting them via CSS does not work.
        Velocity(notification, { scale: 0.25 }, { duration: 0 });

        Velocity(notification, { scale: 1 }, { duration: 300, queue: false, easing: 'easeOutQuad' });
        Velocity(notification, { opacity: 1 }, {
            duration: 100,
            easing: 'easeOutQuad',
            complete: () =>
            {
                Velocity(notification, { opacity: 0 },
                {
                    duration: 450,
                    complete: () =>
                    {
                        notification.remove();
                    }
                });
            }
        });

        this.rootNode.appendChild(notification);
    }
}