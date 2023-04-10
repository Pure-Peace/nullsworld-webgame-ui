<template>
    <div>
        <color-button v-if="window?.history?.length > 1" buttonStyle="blue" @click="$router.back(-1)">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                />
            </svg>
        </color-button>
    </div>
    <div class="flex justify-center items-center">
        <CombatReplay key="CombatInfoContent" :combatId="combatId" />
    </div>
</template>

<script>
import CombatReplay from '@/components/Combat/CombatReplay.vue'

export default {
    components: {
        CombatReplay
    },
    props: {
        combatId: {
            default: undefined
        }
    }
}
</script>