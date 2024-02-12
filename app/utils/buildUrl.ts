export function buildUrl(url: string, searchParams?: URLSearchParams | null | undefined) {
  if (!searchParams) {
    return url
  }

  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : ''
  return `${url}${queryString}`
}
