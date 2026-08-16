import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../common/Icon'
import './SearchOverlay.css'

const POPULAR_SEARCHES = ['Headphones', 'Oak chair', 'Table lamp', 'Cast iron']

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [isOpen])

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  function handleSubmit(e) {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`)
    onClose()
  }

  function handlePopularClick(term) {
    navigate(`/shop?search=${encodeURIComponent(term)}`)
    onClose()
  }

  return (
    <div className={`search-overlay ${isOpen ? 'search-overlay--open' : ''}`} aria-hidden={!isOpen}>
      <div className="search-overlay__backdrop" onClick={onClose} />
      <div className="search-overlay__panel" role="dialog" aria-modal="true" aria-label="Search">
        <div className="container search-overlay__inner">
          <form className="search-overlay__form" onSubmit={handleSubmit}>
            <Icon name="search" size={22} className="search-overlay__icon" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products, categories…"
              className="search-overlay__input"
              aria-label="Search query"
            />
            <button type="button" onClick={onClose} className="search-overlay__close" aria-label="Close search">
              <Icon name="close" size={22} />
            </button>
          </form>
          <div className="search-overlay__suggestions">
            <span className="search-overlay__suggestions-label">Popular</span>
            <div className="search-overlay__chips">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  className="search-overlay__chip"
                  onClick={() => handlePopularClick(term)}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
