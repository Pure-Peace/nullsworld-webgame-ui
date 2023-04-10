<template>
  <RecentTrading :displayFullAddress="true" :pagination="true" />
</template>

<script>
import RecentTrading from '@/components/Dashboard/RecentTrading.vue'


export default {
  components: {
    RecentTrading
  }
}
</script>