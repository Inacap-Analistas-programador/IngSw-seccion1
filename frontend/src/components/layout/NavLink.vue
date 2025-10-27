<template>
  <router-link
    :to="to"
    class="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors flex items-center space-x-2"
    active-class="text-green-600 bg-green-50"
  >
    <span v-if="icon" class="inline-flex">
      <svg v-if="icon === 'home'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7m-9 2v8a2 2 0 002 2h3m0 0a2 2 0 002-2v-8m0 0l2 2"></path>
      </svg>
      <svg v-else-if="icon === 'academic-cap'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422A12.083 12.083 0 0112 20.944 12.083 12.083 0 015.84 10.578L12 14z"></path>
      </svg>
      <svg v-else-if="icon === 'user-group'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path>
      </svg>
      <svg v-else-if="icon === 'credit-card'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
      </svg>
      <svg v-else-if="icon === 'folder'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h4l2 2h10a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z"></path>
      </svg>
    </span>
    <span>
      <slot />
    </span>
  </router-link>
</template>

<script setup lang="ts">
defineProps<{ to: string; icon?: 'home' | 'academic-cap' | 'user-group' | 'credit-card' | 'folder' }>()
</script>

<!-- No component-scoped styles needed here -->