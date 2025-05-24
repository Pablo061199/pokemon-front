<template>
  <div class="overflow-x-auto rounded-xl shadow">
    <table class="min-w-full table-fixed divide-y divide-gray-200 bg-white text-sm">
      <colgroup>
        <col v-if="props.selectable" style="width: 40px" />
        <col v-for="key in headers" :key="key" />
        <col v-if="slots.actions" style="width: 100px" />
      </colgroup>

      <thead class="bg-gray-100 sticky top-0 z-10">
        <tr>
          <th v-if="props.selectable" class="px-2 py-3 text-left font-semibold text-gray-700">
            <input
              type="checkbox"
              :checked="selectedRows.length === props.data.length"
              @change="toggleSelectAll"
            />
          </th>
          <th
            v-for="header in headers"
            :key="header"
            class="px-4 py-3 text-left font-semibold text-gray-700 truncate"
          >
            {{ header }}
          </th>
          <th
            v-if="slots.actions && props.data.length > 0"
            class="px-4 py-3 text-left font-semibold text-gray-700"
          >
            Acciones
          </th>
        </tr>
      </thead>
    </table>

    <div class="max-h-[350px] overflow-y-auto">
      <table class="min-w-full table-fixed divide-y divide-gray-200 bg-white text-sm">
        <colgroup>
          <col v-if="props.selectable" style="width: 40px" />
          <col v-for="key in headers" :key="key" />
          <col v-if="slots.actions && props.data.length > 0" style="width: 100px" />
        </colgroup>

        <tbody>
          <tr
            v-for="(item, index) in props.data"
            :key="index"
            class="hover:bg-gray-50 cursor-pointer"
            @click="handleRowClick(item)"
          >
            <td v-if="props.selectable" class="px-2 py-2">
              <input
                type="checkbox"
                :checked="isSelected(item)"
                @click.stop
                @change="toggleRowSelection(item)"
              />
            </td>
            <td
              v-for="key in Object.keys(item)"
              :key="key"
              class="px-4 py-2 text-gray-800 truncate"
            >
              <img
                v-if="isImageUrl(item[key])"
                :src="item[key] as string"
                alt="image"
                class="h-10 w-10 object-contain"
              />
              <span v-else>
                {{ item[key] }}
              </span>
            </td>
            <td v-if="slots.actions && props.data.length > 0" class="px-4 py-2" @click.stop>
              <slot name="actions" :item="item" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div v-if="props.pagination" class="flex justify-center mt-4 gap-2 flex-wrap">
    <button
      :disabled="props.pagination.page === 1"
      @click="changePage(props.pagination.page - 1)"
      class="px-3 py-1 rounded border text-sm bg-white text-gray-700 hover:bg-blue-100"
    >
      ←
    </button>

    <button
      v-for="page in visiblePages"
      :key="page"
      @click="changePage(page)"
      :class="[
        'px-3 py-1 rounded border text-sm',
        page === props.pagination.page
          ? 'bg-blue-600 text-white'
          : 'bg-white text-gray-700 hover:bg-blue-100',
      ]"
    >
      {{ page }}
    </button>

    <button
      :disabled="props.pagination.page === totalPages"
      @click="changePage(props.pagination.page + 1)"
      class="px-3 py-1 rounded border text-sm bg-white text-gray-700 hover:bg-blue-100"
    >
      →
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'

interface Props {
  data: Array<Record<string, unknown>>
  selectable?: boolean
  pagination?: {
    total: number
    page: number
    limit: number
  }
}
const slots = useSlots()
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'row-click', item: Record<string, unknown>): void
  (e: 'selected-changed', selected: Record<string, unknown>[]): void
  (e: 'page-changed', page: number): void
}>()
const selectedRows = ref<Record<string, unknown>[]>([])

function toggleRowSelection(item: Record<string, unknown>) {
  const index = selectedRows.value.findIndex((row) => row === item)
  if (index >= 0) {
    selectedRows.value.splice(index, 1)
  } else {
    selectedRows.value.push(item)
  }
  emit('selected-changed', selectedRows.value)
}

function isSelected(item: Record<string, unknown>) {
  return selectedRows.value.includes(item)
}

function toggleSelectAll(event: Event) {
  const checked = (event.target as HTMLInputElement).checked
  selectedRows.value = checked ? [...props.data] : []
  emit('selected-changed', selectedRows.value)
}

function changePage(page: number) {
  if (props.pagination && page >= 1 && page <= totalPages.value) {
    emit('page-changed', page)
  }
}

const headers = computed(() => (props.data.length ? Object.keys(props.data[0]) : []))

function handleRowClick(item: Record<string, unknown>) {
  emit('row-click', item)
}
const totalPages = computed(() => {
  if (!props.pagination) return 1
  return Math.ceil(props.pagination.total / props.pagination.limit)
})
const visiblePages = computed(() => {
  if (!props.pagination) return []
  const current = props.pagination.page
  const total = totalPages.value
  const maxVisible = 10

  const start = Math.floor((current - 1) / maxVisible) * maxVisible + 1
  const end = Math.min(start + maxVisible - 1, total)

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})
function isImageUrl(value: unknown): boolean {
  return typeof value === 'string' && !!value.match(/\.(jpeg|jpg|gif|png|webp)$/i)
}
</script>
