interface IPagination<T> {
  pages: number
  currentPage: number
  results: Array<T>
}
