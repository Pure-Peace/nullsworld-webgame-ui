<template>
    <div class="nulls-empty nulls-empty-empty" @click="nullsClick">
        <buttton class="add-button" />
        <div class="nulls-empty-text mx-auto px-2">Go get your first nulls!</div>
    </div>
    <div class="nulls-empty nulls-empty-empty" @click="eggClick">
        <img src="/egg1.png" class="egg-button" />
        <div class="nulls-empty-text mx-auto px-2">Go check your Eggs!</div>
    </div>
</template>

<script>
export default {
    methods: {
        nullsClick() {
            this.$root.closeGlobalModal()
            this.$router.push({ name: 'Market' })
        },
        eggClick() {
            this.$root.closeGlobalModal()
            this.$router.push({ name: 'MyEggs' })
        }
    }
}
</script>


<style scoped>
.nulls-empty {
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
    margin: 0 15px;
    background-color: #fff4c333;
    border-color: #ff742733;
}

.nulls-empty:hover {
    background-color: #fff4c34d;
    border-color: #ff74274c;
}

.nulls-empty:active {
    border-color: #ff7427;
}

.nulls-empty:hover .nulls-egg {
    animation: shake 2s 0.15s ease infinite;
}

.nulls-empty:active .nulls-image {
    filter: brightness(0.9);
}

.nulls-empty-empty {
    justify-content: center;
}

.nulls-empty-empty:hover {
    transform: scale(1.05);
}

.nulls-empty-empty:active {
    transform: scale(0.95);
}

.add-button {
    background: url("/add-button.png");
    background-repeat: round;
    margin-bottom: 32px;
    height: 70px;
    width: 70px;
}

.egg-button {
    height: 90px;
    margin-bottom: 12px;
}

.nulls-empty-text {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: #666666;
}
</style>