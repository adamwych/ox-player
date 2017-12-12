/**
 * This file is part of the Ox Player library.
 * Full license text is available in the LICENSE file in root directory.
 */

import Overlay from '../ui/Overlay'

const defaultOptions = {
    // Whether the video should start after the page loads.
    // Default: false
    autoPlay: false,

    // At what volume should the video play by default.
    // Default: 0.5
    volume: 0.5
}

 /** This class is responsible for initializing the player and managing its state. */
 export default class Player {
    /**
     * @param element <video> element to initialize the player for.
     * @param options
     */
    constructor(element, options) {
        this.videoElement = element
        this.rootElement = element.parentNode

        this.isPlaying = false
        this.isMuted = false
        this.isFullscreen = false

        this.options = this.normalizeOptions(options, defaultOptions)
        this.setVolume(this.options.volume)

        this.preparePlayerOverlay()
        this.overlay.controls.volumeSlider.setValue(this.volume)

        this.videoElement.addEventListener('loadstart', this.onVideoBufferingStart.bind(this))
        this.videoElement.addEventListener('loadedmetadata', this.onVideoMetadataLoaded.bind(this))
        this.videoElement.addEventListener('loadeddata', this.onVideoDataLoaded.bind(this))

        // If native controls are enabled - disable them.
        if (this.videoElement.hasAttribute('controls')) {
            this.videoElement.removeAttribute('controls')
        }

        if (this.options.autoPlay) {
            this.play()
        }
    }

    /**
     * Creates an element where Ox Player's messages and controls will be placed, and
     * prepends it to video's parent element.
     */
    preparePlayerOverlay() {
        this.overlay = new Overlay(this)
        this.overlay.createElements()

        this.rootElement.className += ' oxplayer-root'
        this.rootElement.insertBefore(this.overlay.rootNode, this.videoElement)
    }

    /**
     * Called after video's buffering has started.
     */
    onVideoBufferingStart() {
    }

    /**
     * Called after video's metadata has been loaded by the browser.
     */
    onVideoMetadataLoaded() {
        this.overlay.timeline.updateDuration()
    }

    onVideoDataLoaded(event) {

    }

    /**
     * Starts/resumes the video.
     */
    play() {
        this.videoElement.play()
        this.isPlaying = true
        this.overlay.showCircularNotification('<i class="fa fa-play"></i>')
    }

    /**
     * Pauses the video.
     */
    pause() {
        this.videoElement.pause()
        this.isPlaying = false
        this.overlay.showCircularNotification('<i class="fa fa-pause"></i>')
    }

    /**
     * Resumes the video if it's paused, pauses it otherwise.
     */
    toggle() {
        if (this.isPlaying) {
            this.pause()
        } else {
            this.play()
        }
    }

    /**
     * Changes volume to 0.
     */
    mute() {
        this.setVolume(0)
        this.isMuted = true
    }

    /**
     * Changes volume to the last known.
     */
    unmute() {
        this.setVolume(this.lastVolume)
        this.isMuted = false
    }

    /**
     * Mutes or unmutes the video, depnding on current state.
     */
    toggleMute() {
        if (this.isMuted) {
            this.unmute()
        } else {
            this.mute()
        }
    }

    /**
     * Changes volume of the player.
     * @param volume a number between 0 and 1
     */
    setVolume(volume) {
        this.lastVolume = this.volume
        this.volume = volume
        this.videoElement.volume = volume
    }

    setCurrentTime(time) {
        this.videoElement.currentTime = time
    }

    /**
     * @param options
     * @param defaults
     */
    normalizeOptions(options, defaults) {
        if (options == null) {
            options = {}
        }

        for (var key in defaults) {
            if (typeof options[key] === 'undefined') {
                options[key] = defaults[key]
            }
        }

        return options;
    }
 }