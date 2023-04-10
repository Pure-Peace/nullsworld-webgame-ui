<template>
  <div class="announce-bar">
    <img src="/notice.png" />
    <div class="item-notice-content">
      <ul :class="play ? 'animation-notice' : ''">
        <li v-for="(item, index) in dataSource" :key="index">{{ item.msg }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { formatNumber } from '@/utils/common'

export default {
  mounted() {
    setInterval(this.startPlay, 2000)
  },
  data() {
    return {
      formatNumber,
      dataSource: [
        { msg: `Player 0645... .04b68 won ${formatNumber(1234)} USDT in arena #12345` },
        { msg: `Player 1234... .v04g1 won ${formatNumber(233)} USDT in arena #43210` },
      ],
      play: false
    }
  },
  methods: {
    startPlay() {
      this.play = true
      setTimeout(() => {
        this.dataSource.push(this.dataSource[0])
        this.dataSource.shift()
        this.play = false
      }, 500)
    }
  }
}
</script>
<style scoped>
.item-notice-content {
  width: 433px;
  background: #fef8de;
  display: flex;
  align-items: center;
  padding: 2px 12px;
  z-index: 1;
  position: absolute;
  top: 4px;
  height: 24px;
  left: 30px;
  background: #fef8dee6;
  border-radius: 0px 10px 10px 0px;
  overflow: hidden;
}

.announce-bar {
  height: 33px;
  position: relative;
  overflow: hidden;
}

.announce-bar img {
  position: absolute;
  z-index: 2;
  height: 33px;
  width: 33px;
}

.animation-notice {
  transform: translateY(-22px);
  transition: transform 0.5s;
}

ul {
  margin-top: 22px;
  padding: 0;
  list-style: none;
}

ul li {
  width: 433px;
  line-height: 22px;
  height: 22px;
}
</style>