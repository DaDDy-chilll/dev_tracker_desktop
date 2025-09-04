// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buildQuery = (query: { [key: string]: any }): string => {
  const params = new URLSearchParams()
  for (const key in query) {
    if (query[key] !== undefined) {
      params.append(key, query[key])
    }
  }
  return params.toString()
}
