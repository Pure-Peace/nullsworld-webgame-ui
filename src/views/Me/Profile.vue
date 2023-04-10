<template>
    <div class="w-full md:mr-8 flex-1">
        <div class="item-list-card">
            <div class="item-list-card-header">
                <div class="item-list-card-header-tabs">
                    <button
                        v-for="item in routes"
                        :key="`${item.name}-profile-route`"
                        @click="$router.push({ name: item.name })"
                        :class="[
                            $route.name === item.name ? 'current-route' : '',
                            'item-list-card-header-button', 'item-list-card-header-button-active'
                        ]"
                    >
                        <span class="item-list-card-header-button-text">{{ item.title }}</span>
                    </button>
                </div>
            </div>
            <div class="item-list-card-body" style="min-height: 50vh;">
                <router-view />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            routes: [
                {
                    name: 'MyNulls',
                    title: 'My Nulls'
                },
                {
                    name: 'MyCombatRecords',
                    title: 'Combat Records'
                },
                {
                    name: 'MyTransactionHistory',
                    title: 'Transaction History'
                }
            ]
        }
    }
}
</script>


<style scoped>
.current-route {
    background-color: rgba(255, 255, 255, 0.9);
    font-weight: bold;
    border-color: #6CC5FF66 !important;
}

.item-list-card-header-button {
    background-image: none;
    border-top: 3px solid transparent;
}

.item-list-card-header-button-active::after {
    content: none;
}

.item-list-card-header-button:first-child {
    border-radius: 16px 0 0 0;
}

.item-list-card-header-button:last-child {
    border-radius: 0 16px 0 0;
}

.item-list-card-header-button:not(:first-child):not(:last-child) {
    border-radius: 0;
}
</style>