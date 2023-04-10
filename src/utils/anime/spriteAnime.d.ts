export declare class SpriteAnime {
    ctx: CanvasRenderingContext2D
    image: HTMLImageElement
    fps: number = 30
    timer: NodeJS.Timeout | null
    timerCallback: ((...args: any[]) => any) | null
    frameIndex: number = 0
    frameTotal: number = 15
    frameWidth: number | null = null
    frames: Array<number>
    loop: number = -1
    round: number = 0
    offsetX: number = 0
    offsetY: number = 0
    scalerX: number = 0
    scalerY: number = 0

    constructor(
        ctx: CanvasRenderingContext2D,
        image: HTMLImageElement,
        options?: {
            frameIndex?: number
            fps?: number
            loop?: number
            frameTotal?: number
            frameWidth?: number
            offsetX?: number
            offsetY?: number
            scalerX?: number = 0
            scalerY?: number = 0
        } = {
                frameIndex: 0,
                fps: 30,
                loop: -1,
                frameTotal: 15,
                frameWidth: null,
                offsetX: 0, offsetY: 0,
                scalerX: 1, scalerY: 1
            })

    initFrames(): void
    setTimer(cb: ((...args: any[]) => any) | null): void
    clearTimer(): void
    start(): void
    setSizer({ mw = null, mh = null }: { mw: number | null, mh: number | null }): void
    pause(): void
    unPause(): void
    nextFrame(): void
    render(): void
}