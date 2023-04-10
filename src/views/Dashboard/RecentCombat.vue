<template>
  <RecentCombat :displayFullAddress="true" :pagination="true" />
</template>

<script>
import RecentCombat from '@/components/Dashboard/RecentCombat.vue'

export default {
  components: {
    RecentCombat
  }
}
</script>