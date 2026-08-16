import Icon from '../common/Icon'
import './Pagination.css'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i)

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="pagination__nav"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        aria-label="Previous page"
      >
        <Icon name="chevronLeft" size={16} />
      </button>

      <div className="pagination__pages">
        {pages.map((p) => (
          <button
            key={p}
            className={`pagination__page ${p === currentPage ? 'pagination__page--active' : ''}`}
            onClick={() => onPageChange(p)}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {p + 1}
          </button>
        ))}
      </div>

      <button
        className="pagination__nav"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        aria-label="Next page"
      >
        <Icon name="chevronRight" size={16} />
      </button>
    </nav>
  )
}
