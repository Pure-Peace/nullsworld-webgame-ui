<template>
    <div class="eggs-item eggs-item-empty" @click="$root.openGlobalModal('buyEggs')">
        <buttton class="add-button" />
        <div class="eggs-empty-text mx-auto px-2">Go buy eggs!</div>
    </div>
</template>


<style scoped>
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

.eggs-item-empty {
    justify-content: center;
}

.eggs-item-empty:hover {
    transform: scale(1.05);
}

.eggs-item-empty:active {
    transform: scale(0.95);
}

.eggs-empty-text {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
}

.add-button {
    background: url("/add-button.png");
    background-repeat: round;
    margin-bottom: 32px;
    height: 60px;
    width: 60px;
}
</style>