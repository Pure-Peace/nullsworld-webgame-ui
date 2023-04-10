<template>
    <div class="frame-border">
        <a-image :src="`/nulls${calcNullsImage(nullsId)}.png`" />
        <span :class="isGuardians ? 'guardians' : 'nulls'">{{ isGuardians ? 'Guardians' : 'Nulls' }}</span>
        <span :class="`nulls-id ${calcColor(nullsId)}`">#{{ nullsId }}</span>
    </div>
</template>

<script>
import { calcNullsImage, calcColor } from '@/utils/common'

export default {
    props: {
        nullsType: {
            default: 1
        },
        nullsId: {
            default: 1
        }
    },
    data() {
        return {
            calcNullsImage, calcColor
        }
    },
    computed: {
        isGuardians() {
            return this.nullsType === 255
        },
    },
}

</script>

<style scoped>
.frame-border {
    width: 305px;
    height: 330px;
    border-radius: 16px;
    border: 4px dashed #ff742733;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #fff4c333;
}

.nulls {
    margin-top: 20px;
    font-size: 18px;
}

.guardians {
    margin-top: 20px;
    font-size: 18px;
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

:deep(.ant-image) {
    width: 170px;
    margin-right: 10px;
    transition: 0.2s ease;
    cursor: pointer;
}

:deep(.ant-image:hover) {
    transform: scale(1.2);
}

.nulls-id {
    margin-top: 20px;
    font-weight: bold;
    font-size: 14px;
    color: #ffffff;
    padding: 4px 8px;
    border-radius: 8px;
}
</style>