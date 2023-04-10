<template>
    <button :class="[disabled ? 'color-button-disabled' : '', 'color-button']">
        <span class="color-button-bulb"></span>
        <slot></slot>
    </button>
</template>

<script>
const styleDict = {
    orange: {
        bg: ['#ff863b', '#ff6e35'],
        shadow: ['#ffa051', '#bc430f'],
        circle: '#ffb367',
        bulb: '#ff9e52'
    },
    blue: {
        bg: ['#7199FC', '#5D91F1'],
        shadow: ['#A1B4FF', '#4273C8'],
        circle: '#9EB2FF',
        bulb: '#B1C0FF'
    },
    red: {
        bg: ['#FF5151', '#FF4457'],
        shadow: ['#FF7968', '#C51B23'],
        circle: '#FF8A75',
        bulb: '#FF7468'
    },
    yellow: {
        bg: ['#FFB50B', '#FFB026'],
        shadow: ['#FFDA82', '#F49800'],
        circle: '#FFD97F',
        bulb: '#FFD97F'
    },
    grey: {
        bg: ['#D0D0D0', '#9E9E9E'],
        shadow: ['#EAEAEA', '#7A7A7A'],
        circle: '#DEDEDE',
        bulb: '#DEDEDE'
    }
}

export default {
    props: {
        buttonStyle: {
            default: 'orange'
        },
        customStyle: {
            default: null
        },
        disabled: {
            default: false
        }
    },
    computed: {
        s() {
            return this.disabled ? styleDict.grey : this.customStyle || (styleDict[this.buttonStyle] || styleDict.orange)
        },
        colorTop() {
            return this.s.bg[0]
        },
        colorButtom() {
            return this.s.bg[1]
        },
        shadowTop() {
            return this.s.shadow[0]
        },
        shadowBottom() {
            return this.s.shadow[1]
        },
        circle() {
            return this.s.circle
        },
        bulb() {
            return this.s.bulb
        }
    }
}
</script>

<style scoped>
button {
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
}

.color-button {
    position: relative;
    font-weight: 600;
    padding: 7px 18px;
    background: linear-gradient(v-bind(colorTop), v-bind(colorButtom));
    box-shadow: v-bind(shadowTop) 0px -2px, v-bind(shadowBottom) 0px 2.7px;
    color: #ffffff;
    text-shadow: 0px 2px 0px rgba(0, 0, 0, 0.5);
    transition: 0.2s cubic-bezier(0.19, 1, 0.22, 1);
    border-radius: 30px;
}

.color-button:hover {
    transform: scale(1.05);
    filter: brightness(1.1);
}

.color-button:active {
    transform: scale(0.95);
    filter: brightness(0.9);
}

.color-button::after {
    content: "";
    position: absolute;
    top: 43%;
    left: 6%;
    background-color: v-bind(circle);
    box-shadow: #0000004d -0.3px -0.8px 0px;
    height: 5px;
    width: 5px;
    border-radius: 50%;
}

.color-button::before {
    content: "";
    position: absolute;
    top: 45%;
    right: 6%;
    background-color: v-bind(circle);
    box-shadow: #0000004d -0.3px -0.8px 0px;
    height: 5px;
    width: 5px;
    border-radius: 50%;
}

.color-button-bulb {
    top: 10%;
    left: 10%;
    width: 15%;
    height: 40%;
    position: absolute;
    pointer-events: none;
}

.color-button-bulb::after {
    content: "";
    left: 7%;
    top: 44%;
    position: absolute;
    height: 3px;
    width: 3.75px;
    transform: rotate(-45deg);
    background-color: v-bind(bulb);
    border-radius: 50% / 50%;
}

.color-button-bulb::before {
    content: "";
    left: 20%;
    position: absolute;
    width: 7.4px;
    height: 5px;
    transform: rotate(-45deg);
    background-color: v-bind(bulb);
    border-radius: 50% / 50%;
}

.color-button-disabled {
    pointer-events: none;
}
</style>