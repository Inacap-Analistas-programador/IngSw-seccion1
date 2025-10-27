<template>
  <div :class="cn('flex items-center p-6 pt-0', $attrs.class)" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
</script>