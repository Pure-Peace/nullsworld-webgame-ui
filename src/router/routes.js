import Home from '@/views/Dashboard/Home.vue'
import RecentTrading from '@/views/Dashboard/RecentTrading.vue'
import RecentCombat from '@/views/Dashboard/RecentCombat.vue'

import ArenaHome from '@/views/Arena/ArenaHome.vue'
import CombatInfo from '@/views/Arena/CombatInfo.vue'

import MarketHome from '@/views/Market/MarketHome.vue'
import MarketNullsInfo from '@/views/Market/MarketNullsInfo.vue'

import Profile from '@/views/Me/Profile.vue'
import MyNulls from '@/views/Me/MyNulls.vue'
import MyEggs from '@/views/Me/MyEggs.vue'
import MyCombatRecords from '@/views/Me/MyCombatRecords.vue'
import MyTransactionHistory from '@/views/Me/MyTransactionHistory.vue'

import NullsDetails from '@/views/Common/NullsDetails.vue'



/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [
  // Dashboard ----------------------------
  {
    name: 'Home',
    path: '/',
    component: Home,
    // component: () => import('@/views/Dashboard/Home.vue'),
    meta: { title: 'Home', }
  },
  {
    name: 'RecentTrading',
    path: '/recent/trading',
    component: RecentTrading,
    // component: () => import('@/views/Dashboard/RecentTrading.vue'),
    meta: { title: 'RecentTrading' }
  },
  {
    name: 'RecentCombat',
    path: '/recent/combat',
    component: RecentCombat,
    // component: () => import('@/views/Dashboard/RecentCombat.vue'),
    meta: { title: 'RecentCombat' }
  },
  // Arena ----------------------------
  {
    name: 'Arena',
    path: '/arena',
    component: ArenaHome,
    // component: () => import('@/views/Arena/ArenaHome.vue'),
    meta: { title: 'Arena', }
  },
  {
    name: 'CombatInfo',
    path: '/arena/combat/:combatId',
    component: CombatInfo,
    // component: () => import('@/views/Arena/CombatInfo.vue'),
    meta: { title: 'CombatInfo', },
    props: true
  },
  // Market ----------------------------
  {
    name: 'Market',
    path: '/market',
    component: MarketHome,
    // component: () => import('@/views/Market/MarketHome.vue'),
    meta: { title: 'Market' }
  },
  {
    name: 'MarketNullsInfo',
    path: '/market/commodities/:sellId',
    component: MarketNullsInfo,
    // component: () => import('@/views/Market/MarketNullsInfo.vue'),
    meta: { title: 'MarketNullsInfo' },
    props: true
  },
  // Me ----------------------------
  {
    name: 'Profile',
    path: '/profile',
    component: Profile,
    // component: () => import('@/views/Me/Profile.vue'),
    meta: { title: 'Profile' },
    children: [
      {
        name: 'MyNulls',
        path: 'nulls',
        component: MyNulls,
        // component: () => import('@/views/Me/MyNulls.vue'),
        meta: { title: 'MyNulls' }
      },
      {
        name: 'MyCombatRecords',
        path: 'combat-records',
        component: MyCombatRecords,
        // component: () => import('@/views/Me/MyCombatRecords.vue'),
        meta: { title: 'MyCombatRecords' }
      },
      {
        name: 'MyTransactionHistory',
        path: 'transation-history',
        component: MyTransactionHistory,
        // component: () => import('@/views/Me/MyTransactionHistory.vue'),
        meta: { title: 'MyTransactionHistory' }
      },
    ]
  },
  {
    name: 'MyEggs',
    path: '/profile/eggs',
    component: MyEggs,
    // component: () => import('@/views/Me/MyEggs.vue'),
    meta: { title: 'MyEggs' }
  },
  // Common Components ----------------------------
  {
    name: 'NullsDetails',
    path: '/nulls/details/:nullsId?',
    component: NullsDetails,
    // component: () => import('@/views/Common/NullsDetails.vue'),
    meta: {
      title: 'NullsDetails'
    },
    props: true
  }
]
