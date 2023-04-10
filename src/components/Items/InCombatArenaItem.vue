<template>
    <div class="incombat-arena-item">
        <img class="incombat-arena-img" :src="`/gamebg${calcArenaImage(data?.item_id)}.jpg`" />
        <div :class="`arena-num ${calcColor(data?.item_id)}`">#{{ data?.item_id }}</div>
        <div class="incombat-arena-mask">
            <!-- <img src="/ring.png" /> -->
            <canvas class="anime-canvas" ref="incombatAnimeCanvasDom" />
        </div>
    </div>
</template>


<script>
import { calcArenaImage, calcColor } from '@/utils/common'
import { SpriteAnime } from '@/utils/anime'


export default {
    props: {
        data: {
            default: {}
        }
    },
    data() {
        return {
            calcArenaImage, calcColor, SpriteAnime, anime: null,
        }
    },
    mounted() {
        if (this.animeCanvasDom) {
            const ctx = this.animeCanvasDom.getContext('2d')
            this.initAnime(ctx)
        }
    },
    computed: {
        animeCanvasDom() {
            return this.$refs['incombatAnimeCanvasDom']
        },
    },
    methods: {
        initAnime(ctx) {
            const image = new Image()
            image.src = `/combat-anime.png`
            image.onload = (_ev) => {
                this.anime = new SpriteAnime(
                    ctx,
                    image,
                    {
                        fps: 21,
                        frameTotal: 16,
                        scalerX: 1.5,
                        offsetX: 30
                    }
                )
                this.anime.start()
            }
        }
    },
}
</script>


<style scoped>
.incombat-arena-item {
    margin: 8px 0;
    border-radius: 12px;
    overflow: hidden;
    border: 2px solid rgb(255, 253, 149);
    position: relative;
    transition: 0.2s ease;
    cursor: pointer;
}

.incombat-arena-item:hover {
    filter: brightness(1.2);
}

.incombat-arena-item:hover .incombat-arena-img {
    transform: scale(1.1);
}

.incombat-arena-img {
    -webkit-user-drag: none;
    transition: 0.2s ease;
}

.incombat-arena-mask {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 16;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #00000033;
}

.incombat-arena-mask img {
    width: 42px;
    animation: shake 0.2s infinite linear;
}

@keyframes shake {
    0% {
        transform: rotate(0deg);
    }
    25% {
        transform: rotate(15deg);
    }
    50% {
        transform: rotate(0deg);
    }
    75% {
        transform: rotate(-15deg);
    }
}

.arena-num {
    padding: 2px 8px;
    border-radius: 0 0 8px 0;
    color: #ffffff;
    font-weight: bold;
    font-size: 12px;
    position: absolute;
    z-index: 17;
    top: 0;
    left: 0;
    user-select: none;
}

.anime-canvas {
    height: 70px;
    width: 70px;
    filter: opacity(0.8);
}
</style>