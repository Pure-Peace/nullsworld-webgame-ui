<template>
  <div @click="$emit('onItemClick')" :class="[isGuardians ? 'border-guardians' : '', 'nulls-item']">
    <div v-if="renderAnime" class="anime-mask">
      <canvas :class="animeCanvasClass" ref="animeCanvasDom" />
    </div>
    <div class="nulls-status-icon" v-if="nullsStatusIcon || isSale">
      <img v-if="nullsStatusIcon" :src="`/${nullsStatusIcon}.png`" />
      <img v-if="isSale" src="/status-sale.png" />
    </div>
    <div style="height: 127px">
      <img :class="['nulls-image']" :src="`/nulls${calcNullsImage(id)}.png`" />
    </div>
    <div class="nulls-name-box">
      <span :class="[renderAnime ? 'nulls-name-anime' : 'nulls-name']">
        <span :class="isGuardians ? 'guardians' : ''">{{ isGuardians ? 'Guardians' : 'Nulls' }}</span>
        <span :class="[calcColor(id), 'nulls-id']">#{{ id }}</span>
      </span>
    </div>
    <div style="position: relative; height: 33px; width: 100%">
      <div class="image-button-box">
        <color-button
          :disabled="data.status_code !== 4"
          buttonStyle="yellow"
          @click.stop="$emit('onButtonClick')"
        >{{ imageBtnText }}</color-button>
      </div>
    </div>
  </div>
</template>


<script>
import { calcNullsImage, calcColor } from '@/utils/common'
import { SpriteAnime } from '@/utils/anime'


export default {
  data() {
    return {
      calcColor,
      SpriteAnime,
      calcNullsImage,
      anime: null,
      animeCanvasClass: 'anime-canvas',
      animeImages: ['rest', 'ring', 'combat'],
    }
  },
  props: {
    amount: {
      default: 0
    },
    id: {
      default: 0
    },
    itemType: {
      default: 'nulls'
    },
    data: {
      default: {
        name: '',
        type: undefined,
        status: '',
        image: 1
      }
    }
  },
  mounted() {
    if (this.animeCanvasDom) {
      const ctx = this.animeCanvasDom.getContext('2d')
      this.initAnime(ctx)
    }
  },
  methods: {
    initAnime(ctx) {
      const image = new Image()
      image.src = `/${this.data?.status}-anime.png`
      image.onload = (_ev) => {
        this.anime = new SpriteAnime(
          ctx,
          image,
          Object.assign(
            {
              fps: 21,
              frameTotal: this.animeFrames,
              scalerX: 1.3
            },
            this.extraOptions
          )
        )
        this.anime.start()
      }
    }
  },
  computed: {
    animeCanvasDom() {
      return this.$refs['animeCanvasDom']
    },
    isGuardians() {
      return this.data.type === 255
    },
    renderAnime() {
      return this.animeImages.includes(this.data?.status)
    },
    imageBtnText() {
      const dict = {
        1: 'Combating',
        2: 'Guarding',
        3: 'Resting',
      }
      if (dict[this.data.status_code]) return dict[this.data.status_code]
      return this.isGuardians ? 'Create Arena' : 'Go Combat'
    },
    nullsStatusIcon() {
      const dict = {
        combat: 'status-combat',
        rest: 'status-resting',
        sale: 'status-sale',
        ring: 'status-guarding'
      }
      return dict[this.data.status]
    },
    buttonColor() {
      const dict = {
        combat: 'blue',
        rest: 'grey',
        hatch: 'grey',
        sale: 'red',
        ring: 'blue'
      }
      return dict[this.data.status] || 'yellow'
    },
    animeFrames() {
      const dict = {
        rest: 38,
        ring: 16,
        combat: 16
      }
      return dict[this.data.status]
    },
    extraOptions() {
      const dict = {
        combat: {
          offsetX: 40
        },
        ring: {
          offsetY: 10,
          offsetX: 50,
          scalerX: 1.3,
          scalerY: 0.9
        }
      }
      return dict[this.data.status] || {}
    },
    isSale() {
      return this.data?.is_sell === 1
    }
  }
}
</script>

<style scoped>
.color-button {
  font-size: 16px;
  height: 33px;
}

.anime-canvas {
  margin-top: 30px;
  height: 150px;
  filter: opacity(0.8);
  width: 100%;
}

.nulls-item {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 198px;
  height: 257px;
  border-radius: 8px;
  border: 2px solid #e1cab94d;
  padding: 15px;
  user-select: none;
  cursor: pointer;
  transition: 0.2s ease;
  position: relative;
  background-color: #fff4c333;
  border-color: #ff742733;
  margin: 0 1rem 2rem;
}

.nulls-item:hover {
  background-color: #fff4c34d;
  border-color: #ff74274c;
}

.nulls-item:active {
  border-color: #ff7427;
}

.nulls-item:hover .anime-mask {
  opacity: 0.5;
  height: 0;
  display: block;
  border-radius: 0 0 50px 50px;
}

.nulls-item:hover .nulls-name-anime {
  color: #d3d3d3;
}

.nulls-item:active .nulls-image {
  filter: brightness(0.9);
}

.nulls-name-box {
  position: relative;
  font-size: 16px;
  font-weight: 400;
  padding: 6px 0;
  height: 36px;
  width: 100%;
}

.nulls-name {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 4;
  transition: 0.2s ease;
  color: #666666;
  width: 100%;
}

.nulls-name-anime {
  display: flex;
  justify-content: center;
  position: absolute;
  z-index: 4;
  transition: 0.2s ease;
  color: #666666;
  width: 100%;
}

.anime-mask {
  display: block;
  opacity: 1;
  transition: 0.3s ease;
  background: #2a2f57d9;
  overflow: hidden;
  z-index: 4;
  position: absolute;
  border-radius: 6px;
  top: -1px;
  left: -1px;
  height: calc(100% + 2px);
  width: calc(100% + 2px);
}

.nulls-image {
  height: 127px;
  transition: 0.2s ease;
}

.nulls-status-icon {
  z-index: 5;
  position: absolute;
  left: 10px;
  top: 10px;
  display: flex;
}

.nulls-status-icon img {
  height: 37px;
  width: 37px;
  margin-right: 4px;
}

.border-guardians {
  border: 3px solid #ff8585;
}

.border-guardians:hover {
  border-color: #ff9c62;
}

.image-button-box {
  position: absolute;
  z-index: 5;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
}

.guardians {
  font-weight: bold;
  background-image: -webkit-linear-gradient(
    left,
    #ff2e2e,
    #e6d205 25%,
    #003cff 50%,
    #e6d205 75%,
    #ff5252
  );
  -webkit-text-fill-color: transparent;

  -webkit-background-clip: text;
  -webkit-background-size: 200% 100%;
  -webkit-animation: maskedAnimation 4s infinite linear;

  background-clip: text;
  background-size: 200% 100%;
  animation: maskedAnimation 4s infinite linear;
}

@keyframes maskedAnimation {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -100% 0;
  }
}

@keyframes shake {
  10% {
    transform: scale(1.1) rotate(15deg);
  }
  20% {
    transform: scale(1.1) rotate(-10deg);
  }
  30% {
    transform: scale(1.1) rotate(5deg);
  }
  40% {
    transform: scale(1.1) rotate(-5deg);
  }
  50%,
  100% {
    transform: rotate(0deg);
  }
}

.nulls-id {
  font-size: 12px;
  padding: 0 8px;
  font-weight: bold;
  margin-left: 6px;
  padding: 2px 4px;
  color: #ffffff;
  border-radius: 8px;
}
</style>