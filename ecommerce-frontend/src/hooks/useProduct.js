import { useEffect, useState } from 'react'
import { getProductBySlug } from '../services/productService'

export function useProduct(slug) {
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    setIsLoading(true)
    setError(null)
    setProduct(null)

    getProductBySlug(slug)
      .then((result) => {
        if (!cancelled) setProduct(result)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  return { product, isLoading, error }
}
