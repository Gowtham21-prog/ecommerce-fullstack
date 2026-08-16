import { useEffect, useRef, useState } from 'react'
import Icon from '../common/Icon'
import './SortDropdown.css'

const OPTIONS = [
  { value: '', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating_desc', label: 'Top Rated' },
  { value: 'name_asc', label: 'Name: A–Z' },
]

export default function SortDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)
  const current = OPTIONS.find((o) => o.value === value) || OPTIONS[0]

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div className="sort-dropdown" ref={ref}>
      <button
        className="sort-dropdown__trigger"
        onClick={() => setIsOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="sort-dropdown__label">Sort: {current.label}</span>
        <Icon
          name="chevronDown"
          size={16}
          className={`sort-dropdown__chevron ${isOpen ? 'sort-dropdown__chevron--open' : ''}`}
        />
      </button>
      {isOpen && (
        <ul className="sort-dropdown__menu" role="listbox">
          {OPTIONS.map((opt) => (
            <li key={opt.value}>
              <button
                className={`sort-dropdown__option ${
                  opt.value === value ? 'sort-dropdown__option--active' : ''
                }`}
                role="option"
                aria-selected={opt.value === value}
                onClick={() => {
                  onChange(opt.value)
                  setIsOpen(false)
                }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
