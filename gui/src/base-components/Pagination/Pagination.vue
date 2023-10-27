<template>
  <nav v-if="numberOfPages >= 1">
    <ul class="pagination flex w-full mr-0 sm:w-auto sm:mr-auto">
      <Link
        class="page-item"
        aria-label="go to previous page"
        @click="previous()"
        :class="{
          disabled: currentPage === 1
        }"
      >
        <Lucide icon="ChevronLeft" class="w-4 h-4" />
      </Link>
      <Link
        v-for="index in numberOfPages"
        :key="index"
        :aria-label="'go to page ' + index"
        class="page-item"
        @click="setCurrentPage(index)"
      >
        {{ index }}
      </Link>
      <Link
        class="page-item"
        :class="{
          disabled: currentPage === numberOfPages || !numberOfPages
        }"
        aria-label="go to next page"
        @click="next()"
      >
        <Lucide icon="ChevronRight" class="w-4 h-4" />
      </Link>
      <FormSelect class="w-20 mt-3 !box sm:mt-0" @change="setRowsPerPage(($event.target as HTMLSelectElement).value)">
        <option>10</option>
        <option>25</option>
        <option>35</option>
        <option>50</option>
      </FormSelect>
    </ul>
  </nav>
</template>
<script setup lang="ts">
import { toRefs } from "vue"
import { FormSelect } from "@/base-components/Form"
import Link from "@/base-components/Pagination/Link.vue"
import Lucide from "@/base-components/Lucide/Lucide.vue"

interface PaginationProps {
  numberOfPages: number
  modelValue: number
  rowsPerPage: number
}

interface PaginationEmit {
  (e: "update:modelValue", value: number): void
  (e: "rowsPerPageChange", value: number): void
}

const props = defineProps<PaginationProps>()

const { numberOfPages, modelValue: currentPage } = toRefs(props)

const emit = defineEmits<PaginationEmit>()

const setCurrentPage = (number: number) => {
  emit("update:modelValue", number)
}

const setRowsPerPage = (number: string) => {
  emit("rowsPerPageChange", Number(number))
}

const previous = () => {
  if (currentPage.value === 1) return
  emit("update:modelValue", currentPage.value - 1)
}

const next = () => {
  if (currentPage.value >= numberOfPages.value) return
  emit("update:modelValue", currentPage.value + 1)
}
</script>
