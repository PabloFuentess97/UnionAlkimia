export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string }

export type PaginatedResult<T> = {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type SortDirection = "asc" | "desc"

export type SearchParams = {
  page?: string
  pageSize?: string
  search?: string
  sort?: string
  direction?: SortDirection
}
