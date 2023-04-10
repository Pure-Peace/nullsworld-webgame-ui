export class SpriteAnime {
    ctx = null
    image = null
    fps = 30
    timer = null
    timerCallback = null
    frameIndex = 0
    frameTotal = 15
    frameWidth = 0
    frames = []
    loop = -1
    round = 0
    offsetX = 0
    offsetY = 0
    scalerX = 1
    scalerY = 1
    // ------
    playing = false
    paused = false
    constructor(ctx, image, options = {}) {
        this.ctx = ctx
        this.image = image
        this.frameIndex = options?.frameIndex || 0
        this.frameTotal = options?.frameTotal || 15
        this.frameWidth =
            options?.frameWidth || image.width / this.frameTotal || this.ctx.canvas.width
        this.fps = options?.fps || 30
        this.loop = options?.loop || -1
        this.offsetX = options?.offsetX || 0
        this.offsetY = options?.offsetY || 0
        this.scalerX = options?.scalerX || 1
        this.scalerY = options?.scalerY || 1
        this.initFrames()
        this.setSizer({ mh: this.ctx.canvas.height })
    }

    initFrames() {
        const frames = []
        for (let f = 0; f < this.frameTotal; f++) {
            frames.push(f * this.frameWidth)
        }
        this.frames = frames
    }

    setTimer(cb) {
        this.clearTimer()
        cb && (this.timerCallback = cb)
        this.timerCallback &&
            (this.timer = setInterval(this.timerCallback, 1000 / this.fps))
    }

    clearTimer() {
        if (!this.timer) return

        clearInterval(this.timer)
        this.timer = null
    }

    start() {
        if (!this.playing) {
            this.paused = false
            this.playing = true
            this.setTimer(() => {
                this.render()
            })
        }
    }

    setSizer({ mw = null, mh = null }) {
        this.sizer = Math.max(mw / this.image.width, mh / this.image.height)
    }

    pause() {
        this.paused = true
        this.clearTimer()
        this.playing = false
    }

    unPause() {
        this.paused = false
        this.setTimer()
        this.playing = true
    }

    nextFrame() {
        // If the current frame index is in range
        if (this.frameIndex < this.frames.length - 1) {
            // Go to the next frame
            this.frameIndex++
        } else if (this.loop === -1) {
            // `-1` means infinite loop
            this.frameIndex = 0
        } else if (this.round < this.loop) {
            this.round++
            this.frameIndex = 0
        } else {
            this.pause()
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        this.ctx.drawImage(
            this.image,
            this.frames[this.frameIndex],
            0,
            this.frameWidth,
            this.image.height,
            this.offsetX,
            this.offsetY,
            this.frameWidth * this.sizer * this.scalerX,
            this.image.height * this.sizer * this.scalerY,
        )
        this.nextFrame()
    }
}
