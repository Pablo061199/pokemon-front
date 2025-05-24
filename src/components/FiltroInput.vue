<template>
  <div class="mb-4">
    <input
      type="text"
      v-model="searchText"
      @input="$emit('update:modelValue', searchText)"
      placeholder="Filtrar por nombre..."
      class="border border-gray-300 rounded-md p-2 w-full"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const searchText = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    searchText.value = newVal
  },
)
</script>
