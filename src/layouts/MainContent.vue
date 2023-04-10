<template>
  <main :class="mainClass" style="min-width: 1280px !important">
    <transition name="slide-left" mode="out-in">
      <router-view></router-view>
    </transition>

    <!-- <router-view v-slot="{ Component }">
      <transition name="slide-left" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view> -->
  </main>
</template>

<script>
export default {
  computed: {
    mainClass() {
      const WIDE = 'main'
      const NARROW = 'main container mx-auto py-9'
      return this?.$route?.meta?.wide ? WIDE : NARROW
    }
  }
}
</script>

<style scoped>
.main {
  min-height: calc(100vh - 8rem);
}

.slide-left-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-left-enter-to {
  transform: translateX(0px);
}

.slide-left-leave-from {
  transform: translateX(0);
}

.slide-left-leave-to {
  display: none;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s;
}
</style>
