<template>
  <div @click="$emit('onItemClick')" :class="[!amount ? 'disabled-eggs' : '', 'eggs-item']">
    <div style="height: 133px">
      <img class="eggs-egg eggs-image" :src="`/egg${eggId}.png`" />
    </div>
    <div class="eggs-amount-box">{{ formatNumber(amount) }} Eggs</div>
    <color-button
      @click="$emit('onButtonClick')"
      :disabled="!amount"
      buttonStyle="yellow"
    >{{ amount ? 'Go open' : 'No eggs' }}</color-button>
  </div>
</template>


<script>
import { formatNumber } from '@/utils/common'

export default {
  data() {
    return {
      formatNumber
    }
  },
  props: {
    amount: {
      default: 0
    },
    eggId: {
      default: 1
    },
    groupSize: {
      default: 20
    }
  },
  computed: {
    eggGroups() {
      return Math.ceil(this.amount / this.groupSize)
    },
    eggRemainder() {
      return this.amount % this.groupSize
    }
  },
  methods: {
    calculatedAmount(group) {
      return (this.eggRemainder && group + 1 === this.eggGroups) ? this.eggRemainder : this.groupSize
    }
  }
}
</script>

<style scoped>
.color-button {
  font-size: 16px;
}

.disabled-eggs {
  pointer-events: none;
}

.eggs-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 260px;
  height: 260px;
  border-radius: 8px;
  border: 2px solid #ff742733;
  background-color: #fff4c31a;
  padding: 15px;
  user-select: none;
  cursor: pointer;
  transition: 0.2s ease;
  position: relative;
  margin-right: 20px;
}

.eggs-item:hover {
  background-color: #fff4c34d;
  border-color: #ff74274c;
}

.eggs-item:active {
  border-color: #ff7427;
}

.eggs-item-empty:hover {
  transform: scale(1.05);
}

.eggs-item:hover .eggs-egg {
  animation: shake 2s 0.15s ease infinite;
}

.eggs-item-empty:active {
  transform: scale(0.95);
}

.eggs-item:active .eggs-image {
  filter: brightness(0.9);
}

.eggs-amount-box {
  margin-top: 10px;
  padding: 6px 0;
  font-weight: bold;
  font-size: 16px;
  width: 100%;
  text-align: center;
}

.eggs-image {
  transition: 0.2s ease;
}

.eggs-egg {
  height: 100%;
}

.eggs-egg:hover {
  animation: shake 2s 0.15s ease-in-out infinite;
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
</style>