// Mock category data — mirrors the exact shape of GET /api/categories
// from API_CONTRACT.md. Swap this module out for services/categoryService.js
// once the Spring Boot backend is live; nothing else in the app needs to change.

export const categories = [
  {
    id: 1,
    name: 'Audio',
    slug: 'audio',
    imageUrl:
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
  },
  {
    id: 2,
    name: 'Furniture',
    slug: 'furniture',
    imageUrl:
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80',
  },
  {
    id: 3,
    name: 'Lighting',
    slug: 'lighting',
    imageUrl:
      'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=800&q=80',
  },
  {
    id: 4,
    name: 'Kitchen',
    slug: 'kitchen',
    imageUrl:
      'https://images.unsplash.com/photo-1584990347449-a8b2a1d38f37?w=800&q=80',
  },
  {
    id: 5,
    name: 'Stationery',
    slug: 'stationery',
    imageUrl:
      'https://images.unsplash.com/photo-1518893883800-45cd0954574b?w=800&q=80',
  },
  {
    id: 6,
    name: 'Bags',
    slug: 'bags',
    imageUrl:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
  },
]

export function getCategoryBySlug(slug) {
  return categories.find((c) => c.slug === slug)
}
