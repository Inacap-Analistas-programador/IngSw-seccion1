<template>
  <button :class="cn(buttonVariants({ variant, size }), props.class)" v-bind="$attrs">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { buttonVariants } from './index'
import { cn } from '../../../utils'
const $attrs = useAttrs()

// defineOptions es un macro del compilador, no necesita importarse
defineOptions({ inheritAttrs: false })

// Definir Props explícitamente sin tipos complejos de CVA
interface Props {
  variant?: 'primary' | 'success' | 'secondary' | 'default'
  size?: 'default' | 'sm' | 'lg'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default'
})

// Extraer variant y size para el template
const { variant, size } = props
</script>