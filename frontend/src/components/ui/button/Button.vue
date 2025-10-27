<template>
  <button :class="cn(buttonVariants({ variant, size }), $attrs.class)" v-bind="$attrs">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { buttonVariants, type ButtonVariants } from '.'
import { cn } from '@/lib/utils'

interface Props extends ButtonVariants {
  class?: string
}

defineProps<Props>()
</script>