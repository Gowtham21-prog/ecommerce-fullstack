import { useEffect, useRef, useState } from 'react'
import { getProducts } from '../services/productService'

/**
 * Fetches a paginated/filtered product list and tracks loading + error state.
 * Re-fetches whenever the serialized params change. Cancels the in-flight
 * request if params change again or the component unmounts.
 *
 * @param {object} params - see productService.getProducts
 */
export function useProducts(params) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const paramsKey = JSON.stringify(params)

  const requestIdRef = useRef(0)

  useEffect(() => {
    let cancelled = false
    const requestId = ++requestIdRef.current

    setIsLoading(true)
    setError(null)

    getProducts(params)
      .then((result) => {
        if (cancelled || requestId !== requestIdRef.current) return
        setData(result)
      })
      .catch((err) => {
        if (cancelled || requestId !== requestIdRef.current) return
        setError(err)
      })
      .finally(() => {
        if (cancelled || requestId !== requestIdRef.current) return
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey])

  return { data, isLoading, error }
}
