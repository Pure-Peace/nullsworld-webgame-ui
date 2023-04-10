<template>
    <div class="dropdown-menu-box">
        <ul class="dropdown-menu-frame">
            <slot></slot>
        </ul>
    </div>
</template>

<style scoped>
.dropdown-menu-box {
    padding: 6px;
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
}

.dropdown-menu-frame {
    border: 3px dashed #fbede8;
    border-radius: 12px;
}

.dropdown-menu-frame :deep(li) {
    padding: 0 10px;
    transition: 0.2s ease;
    cursor: pointer;
}

.dropdown-menu-frame :deep(li div) {
    padding: 10px;
}

.dropdown-menu-frame :deep(li:not(:last-child) div) {
    border-bottom: 1px solid #f3f3f3;
}

.dropdown-menu-frame :deep(li:first-child) {
    border-radius: 10px 10px 0 0;
}

.dropdown-menu-frame :deep(li:last-child) {
    border-radius: 0 0 10px 10px;
}

.dropdown-menu-frame :deep(li:hover) {
    background-color: #efefef;
}

.dropdown-menu-frame :deep(li:active) {
    filter: brightness(0.9);
}
</style>