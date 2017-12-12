/**
 * This file is part of the Ox Player library.
 * Full license text is available in the LICENSE file in root directory.
 */

import DOMUtils from '../utils/DOMUtils'
import VolumeSlider from './VolumeSlider'
import Velocity from 'velocity-animate'
import fscreen from 'fscreen'

/** This class is responsible for managing the controls. */
export default class Controls {
    /**
     * @param player
     */
    constructor(player) {
        this.player = player
    }

    /**
     * Creates the controls and adds them to the specified element.
     */
    createElements(root) {
        this.rootNode = document.createElement('div')
        this.rootNode.className = 'oxplayer-controls'
        this.rootNode.innerHTML = `
            <div class="oxp-timeline">
                <div class="oxp-timeline-progressbar"></div>
            </div>

            <div class="oxplayer-align-left">
                <div class="icon-button oxplayer-control-play">
                    <i class="fa fa-play"></i>
                </div>

                <div class="icon-button oxplayer-control-volume">
                    <i class="fa fa-volume-up"></i>
                </div>

                <div class="oxp-volume-slider">
                    <div class="oxp-volume-slider-inner"></div>
                </div>
            </div>

            <div class="oxp-timer">
                <span class="oxp-timer-current">00:00</span>
                <span class="oxp-timer-duration">
                    / 00:00
                </span>
            </div>

            <div class="oxplayer-align-right">
                <div class="icon-button oxplayer-control-fullscreen">
                    <i class="fa fa-expand"></i>
                </div>
            </div>
        `;

        root.appendChild(this.rootNode)

        this.playButton = DOMUtils.findChild(this.rootNode, 'oxplayer-control-play')
        this.volumeButton = DOMUtils.findChild(this.rootNode, 'oxplayer-control-volume')
        this.fullscreenButton = DOMUtils.findChild(this.rootNode, 'oxplayer-control-fullscreen')
        this.volumeSliderRoot = DOMUtils.findChild(this.rootNode, 'oxp-volume-slider')
        this.volumeSlider = new VolumeSlider(this.volumeSliderRoot)
        this.volumeSlider.addListener((value) => {
            this.player.setVolume(value)
        })

        this.player.overlay.rootNode.addEventListener('click', (e) => {
            // Toggle only if the overlay itself was clicked, not any of its children.
            if (e.target === this.player.overlay.rootNode) {
                this.onPlayButtonClick()
            }
        })

        this.playButton.addEventListener('click', this.onPlayButtonClick.bind(this))
        this.volumeButton.addEventListener('click', this.onVolumeButtonClick.bind(this))
        this.volumeButton.addEventListener('mouseenter', this.onVolumeButtonMouseEnter.bind(this))
        this.volumeButton.addEventListener('mouseleave', this.onVolumeButtonMouseLeave.bind(this))
        this.volumeSliderRoot.addEventListener('mouseenter', this.onVolumeSliderMouseEnter.bind(this))
        this.volumeSliderRoot.addEventListener('mouseleave', this.onVolumeSliderMouseLeave.bind(this))
        this.fullscreenButton.addEventListener('click', this.onFullscreenButtonClick.bind(this))

        if (!fscreen.fullscreenEnabled) {
            this.fullscreenButton.remove()
        } else {
            fscreen.addEventListener('fullscreenchange', this.onFullscreenChange.bind(this))
        }

        this.isHoveringOverVolumeButton = false
        this.isHoveringOverVolumeSlider = false
    }

    /**
     * Shows the controls.
     */
    show() {
        Velocity(this.rootNode, { scaleY: 1 }, { duration: 250, easing: 'easeOutQuad' });
    }

    /**
     * Hides the controls.
     */
    hide() {
        Velocity(this.rootNode, { scaleY: 0 }, { duration: 250, easing: 'easeOutQuad' });
    }

    onPlayButtonClick() {
        this.player.toggle()

        if (this.player.isPlaying) {
            this.playButton.innerHTML = '<i class="fa fa-pause"></i>';
        } else {
            this.playButton.innerHTML = '<i class="fa fa-play"></i>';
        }
    }

    onVolumeButtonMouseEnter() {
        this.isHoveringOverVolumeButton = true
        Velocity(this.volumeSliderRoot, { width: 100 }, { duration: 250, easing: 'easeOutQuad' });
    }

    onVolumeButtonMouseLeave() {
        this.isHoveringOverVolumeButton = false
        this.hideVolumeSliderIfPossible()
    }

    onVolumeButtonClick() {
        this.player.toggleMute()

        if (this.player.isMuted) {
            this.volumeSlider.setValue(0)
        } else {
            this.volumeSlider.setValue(this.player.volume)
        }
    }

    onVolumeSliderMouseEnter() {
        this.isHoveringOverVolumeSlider = true
    }

    onVolumeSliderMouseLeave() {
        this.isHoveringOverVolumeSlider = false
        this.hideVolumeSliderIfPossible()
    }

    hideVolumeSliderIfPossible() {
        // 150ms timeout because it may take user some time to move cursor to the slider
        // if they are on the volume button.
        setTimeout(() => {
            if (!this.isHoveringOverVolumeButton && !this.isHoveringOverVolumeSlider) {
                Velocity(this.volumeSliderRoot, { width: 0 }, { duration: 250, easing: 'easeOutQuad' });
            }
        }, 100)
    }

    onFullscreenButtonClick() {
        if (fscreen.fullscreenEnabled) {
            var parent = this.player.rootElement

            if (this.player.isFullscreen) {
                fscreen.exitFullscreen()

                parent.style.width = null
                parent.style.height = null
            } else {
                this.player.width = parent.offsetWidth
                this.player.height = parent.offsetHeight

                fscreen.requestFullscreen(parent)

                parent.style.width = '100%'
                parent.style.height = '100%'
            }

            this.player.isFullscreen = !this.player.isFullscreen
        }
    }

    onFullscreenChange() {
        this.player.isFullscreen = (fscreen.fullscreenElement !== null)

        if (!this.player.isFullscreen) {
            var parent = this.player.rootElement
                parent.style.width = null
                parent.style.height = null
        }
    }
}