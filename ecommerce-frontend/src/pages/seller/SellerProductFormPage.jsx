import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/common/Button'
import { useToast } from '../../components/common/Toast'
import * as sellerService from '../../services/sellerService'
import * as categoryService from '../../services/categoryService'
import './SellerProductFormPage.css'

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  originalPrice: '',
  categoryId: '',
  imageUrl: '',
  images: '',
  stock: '',
  featured: false,
  bestseller: false,
}

export default function SellerProductFormPage() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [form, setForm] = useState(EMPTY_FORM)
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(isEditing)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    categoryService.getCategories().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    if (!isEditing) return
    let cancelled = false
    sellerService
      .getMyProducts({ page: 0, size: 100 })
      .then((res) => {
        if (cancelled) return
        const product = (res.content || []).find((p) => String(p.id) === String(id))
        if (product) {
          setForm({
            name: product.name || '',
            description: product.description || '',
            price: product.price ?? '',
            originalPrice: product.originalPrice ?? '',
            categoryId: product.category?.id ?? '',
            imageUrl: product.imageUrl || '',
            images: (product.images || []).join(', '),
            stock: product.stock ?? '',
            featured: Boolean(product.featured),
            bestseller: Boolean(product.bestseller),
          })
        }
      })
      .catch((err) => setError(err?.message || 'Could not load this product'))
      .finally(() => !cancelled && setIsLoading(false))
    return () => {
      cancelled = true
    }
  }, [id, isEditing])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      categoryId: form.categoryId ? Number(form.categoryId) : null,
      imageUrl: form.imageUrl,
      images: form.images
        ? form.images.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      stock: Number(form.stock),
      featured: form.featured,
      bestseller: form.bestseller,
    }

    if (!payload.name || Number.isNaN(payload.price) || Number.isNaN(payload.stock)) {
      setError('Please fill in the required fields: name, price, and stock.')
      return
    }

    setIsSubmitting(true)
    try {
      if (isEditing) {
        await sellerService.updateProduct(id, payload)
        showToast('Product updated', { tone: 'success' })
      } else {
        await sellerService.createProduct(payload)
        showToast('Product created', { tone: 'success' })
      }
      navigate('/seller/products')
    } catch (err) {
      setError(err?.message || 'Could not save this product. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <p>Loading product…</p>
  }

  return (
    <div className="seller-product-form">
      <h1 className="seller-product-form__title">
        {isEditing ? 'Edit product' : 'Add a new product'}
      </h1>

      {error && (
        <div className="seller-product-form__error" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label className="seller-product-form__field">
          <span>Name *</span>
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </label>

        <label className="seller-product-form__field">
          <span>Description</span>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} />
        </label>

        <div className="seller-product-form__row">
          <label className="seller-product-form__field">
            <span>Price (in paise/cents) *</span>
            <input
              type="number"
              name="price"
              min="0"
              value={form.price}
              onChange={handleChange}
              required
            />
          </label>
          <label className="seller-product-form__field">
            <span>Original price (optional, for showing a discount)</span>
            <input
              type="number"
              name="originalPrice"
              min="0"
              value={form.originalPrice}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="seller-product-form__row">
          <label className="seller-product-form__field">
            <span>Category</span>
            <select name="categoryId" value={form.categoryId} onChange={handleChange}>
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="seller-product-form__field">
            <span>Stock *</span>
            <input
              type="number"
              name="stock"
              min="0"
              value={form.stock}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <label className="seller-product-form__field">
          <span>Main image URL</span>
          <input type="url" name="imageUrl" value={form.imageUrl} onChange={handleChange} />
        </label>

        <label className="seller-product-form__field">
          <span>Additional image URLs (comma-separated)</span>
          <input type="text" name="images" value={form.images} onChange={handleChange} />
        </label>

        <div className="seller-product-form__checkboxes">
          <label className="seller-product-form__checkbox">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
            />
            <span>Featured</span>
          </label>
          <label className="seller-product-form__checkbox">
            <input
              type="checkbox"
              name="bestseller"
              checked={form.bestseller}
              onChange={handleChange}
            />
            <span>Bestseller</span>
          </label>
        </div>

        <div className="seller-product-form__actions">
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : isEditing ? 'Save changes' : 'Create product'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/seller/products')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
