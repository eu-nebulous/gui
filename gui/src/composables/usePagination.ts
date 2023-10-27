import { computed, ComputedRef, Ref, ref } from "vue"

interface PaginationConfig<T> {
  rowsPerPage?: Ref<number>
  arrayToPaginate: Ref<Array<T>>
  currentPage: Ref<number>
}

export function usePagination<T>(config: PaginationConfig<T>): {
  paginatedArray: ComputedRef<T[]>
  numberOfPages: ComputedRef<number>
} {
  const rowsPerPage = config.rowsPerPage || ref(10)

  const paginatedArray = computed(() =>
    config.arrayToPaginate.value.slice(
      (config.currentPage.value - 1) * rowsPerPage.value,
      config.currentPage.value * rowsPerPage.value
    )
  )

  const numberOfPages = computed(() => Math.ceil((config.arrayToPaginate.value.length || 0) / rowsPerPage.value))

  return {
    paginatedArray,
    numberOfPages
  }
}
