<template>
  <StatisticCard />
  <div class="dashboard-content flex flex-col md:flex-row">
    <RecentCombat :pageSize="11" :showMoreButton="true" class="dashboard-recent" />
    <RecentTrading :pageSize="11" :showMoreButton="true" class="dashboard-recent" />
  </div>
</template>

<script>
import StatisticCard from '@/components/Dashboard/StatisticCard.vue'
import RecentTrading from '@/components/Dashboard/RecentTrading.vue'
import RecentCombat from '@/components/Dashboard/RecentCombat.vue'

export default {
  components: {
    StatisticCard,
    RecentTrading,
    RecentCombat
  }
}
</script>

<style scoped>
.dashboard-content {
  margin: 55px 0;
}

.dashboard-recent {
  min-height: 1176px;
}

:deep(.item-list-card-body) {
  min-height: calc(1249px - 50px);
}
</style>
