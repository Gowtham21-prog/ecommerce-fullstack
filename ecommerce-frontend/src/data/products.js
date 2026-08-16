// Mock product data — mirrors the exact shape of GET /api/products
// (the objects inside `content[]`) from API_CONTRACT.md.
//
// Kept entirely separate from UI components. When the Spring Boot backend
// is ready, only src/services/productService.js needs to change — this
// file (and its consumers) stay untouched, or can simply be deleted.

import { categories } from './categories'

const cat = (slug) => categories.find((c) => c.slug === slug)

export const products = [
  {
    id: 1,
    name: 'Wireless Over-Ear Headphones',
    slug: 'wireless-over-ear-headphones',
    description:
      'Precision-tuned 40mm drivers, adaptive noise cancellation, and a memory-foam headband finished in vegetable-tanned leather. 32-hour battery life.',
    price: 24900,
    originalPrice: 29900,
    category: cat('audio'),
    rating: 4.7,
    reviewCount: 214,
    imageUrl:
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1200&q=80',
    ],
    stock: 18,
    featured: true,
    bestseller: true,
  },
  {
    id: 2,
    name: 'Turntable, Walnut Edition',
    slug: 'turntable-walnut-edition',
    description:
      'A belt-driven turntable in solid walnut with a hand-calibrated tonearm. Built-in preamp, Bluetooth aptX, and a felt platter mat woven in-house.',
    price: 39900,
    originalPrice: null,
    category: cat('audio'),
    rating: 4.9,
    reviewCount: 87,
    imageUrl:
      'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1200&q=80',
      'https://images.unsplash.com/photo-1552422535-c45813c61732?w=1200&q=80',
    ],
    stock: 6,
    featured: true,
    bestseller: false,
  },
  {
    id: 3,
    name: 'Compact Bookshelf Speakers (Pair)',
    slug: 'compact-bookshelf-speakers-pair',
    description:
      'Bi-amplified bookshelf speakers with a birch-ply cabinet and silk dome tweeters. Room-filling sound without the footprint.',
    price: 34900,
    originalPrice: 38900,
    category: cat('audio'),
    rating: 4.6,
    reviewCount: 132,
    imageUrl:
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=1200&q=80',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=1200&q=80',
    ],
    stock: 11,
    featured: false,
    bestseller: true,
  },
  {
    id: 4,
    name: 'Oak Lounge Chair',
    slug: 'oak-lounge-chair',
    description:
      'Steam-bent white oak frame with a wool bouclé cushion. Joinery is pegged, not glued — built to be repaired, not replaced.',
    price: 68900,
    originalPrice: null,
    category: cat('furniture'),
    rating: 4.8,
    reviewCount: 56,
    imageUrl:
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200&q=80',
      'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=1200&q=80',
    ],
    stock: 4,
    featured: true,
    bestseller: false,
  },
  {
    id: 5,
    name: 'Modular Shelving System',
    slug: 'modular-shelving-system',
    description:
      'Powder-coated steel frame with adjustable ash shelves. Expandable in every direction — start with one bay, grow to a wall.',
    price: 52900,
    originalPrice: 59900,
    category: cat('furniture'),
    rating: 4.5,
    reviewCount: 74,
    imageUrl:
      'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=1200&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&q=80',
    ],
    stock: 9,
    featured: false,
    bestseller: false,
  },
  {
    id: 6,
    name: 'Slatted Side Table',
    slug: 'slatted-side-table',
    description:
      'A low side table with a slatted top in solid ash, finished with hardwax oil. Pairs with the Oak Lounge Chair or stands alone.',
    price: 18900,
    originalPrice: null,
    category: cat('furniture'),
    rating: 4.4,
    reviewCount: 41,
    imageUrl:
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=1200&q=80',
    ],
    stock: 22,
    featured: false,
    bestseller: false,
  },
  {
    id: 7,
    name: 'Arc Floor Lamp',
    slug: 'arc-floor-lamp',
    description:
      'A brushed-brass arc lamp with a hand-blown opal glass shade. The marble base is quarried in single slabs, never composite.',
    price: 42900,
    originalPrice: 47900,
    category: cat('lighting'),
    rating: 4.7,
    reviewCount: 63,
    imageUrl:
      'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=1200&q=80',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&q=80',
    ],
    stock: 7,
    featured: true,
    bestseller: true,
  },
  {
    id: 8,
    name: 'Ceramic Table Lamp',
    slug: 'ceramic-table-lamp',
    description:
      'Hand-thrown stoneware base in a reactive glaze — no two are identical. Paired with a natural linen drum shade.',
    price: 12900,
    originalPrice: null,
    category: cat('lighting'),
    rating: 4.6,
    reviewCount: 98,
    imageUrl:
      'https://images.unsplash.com/photo-1543198126-cb4dee7cf1b3?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1543198126-cb4dee7cf1b3?w=1200&q=80',
    ],
    stock: 30,
    featured: false,
    bestseller: true,
  },
  {
    id: 9,
    name: 'Pendant Light, Amber Glass',
    slug: 'pendant-light-amber-glass',
    description:
      'Mouth-blown amber glass globe on a matte-black adjustable cord. Casts a warm, low-glare light suited to dining tables.',
    price: 15900,
    originalPrice: 17900,
    category: cat('lighting'),
    rating: 4.5,
    reviewCount: 52,
    imageUrl:
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&q=80',
    ],
    stock: 14,
    featured: false,
    bestseller: false,
  },
  {
    id: 10,
    name: 'Cast Iron Skillet, 10-inch',
    slug: 'cast-iron-skillet-10-inch',
    description:
      'Pre-seasoned in-house with three coats of flaxseed oil. Poured, not stamped — the extra mass holds heat evenly, edge to edge.',
    price: 8900,
    originalPrice: null,
    category: cat('kitchen'),
    rating: 4.9,
    reviewCount: 301,
    imageUrl:
      'https://images.unsplash.com/photo-1584990347449-a8b2a1d38f37?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1584990347449-a8b2a1d38f37?w=1200&q=80',
      'https://images.unsplash.com/photo-1584990347646-92c0e7477d56?w=1200&q=80',
    ],
    stock: 45,
    featured: true,
    bestseller: true,
  },
  {
    id: 11,
    name: 'Ceramic Pour-Over Set',
    slug: 'ceramic-pour-over-set',
    description:
      'A dripper, server, and two cups in matte stoneware. Ribbed interior walls slow the pour for a fuller extraction.',
    price: 9900,
    originalPrice: 11900,
    category: cat('kitchen'),
    rating: 4.7,
    reviewCount: 118,
    imageUrl:
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1200&q=80',
    ],
    stock: 26,
    featured: false,
    bestseller: false,
  },
  {
    id: 12,
    name: 'Walnut Cutting Board',
    slug: 'walnut-cutting-board',
    description:
      'End-grain walnut, self-healing under the blade. A juice groove on one face, a flat serving surface on the other.',
    price: 7400,
    originalPrice: null,
    category: cat('kitchen'),
    rating: 4.8,
    reviewCount: 89,
    imageUrl:
      'https://images.unsplash.com/photo-1594736797933-d0f06ba1d1a8?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1594736797933-d0f06ba1d1a8?w=1200&q=80',
    ],
    stock: 33,
    featured: false,
    bestseller: true,
  },
  {
    id: 13,
    name: 'Leather Journal, A5',
    slug: 'leather-journal-a5',
    description:
      'Full-grain vegetable-tanned leather cover that darkens with use. 192 pages of 100gsm cotton paper, sewn — not glued — binding.',
    price: 5400,
    originalPrice: null,
    category: cat('stationery'),
    rating: 4.6,
    reviewCount: 176,
    imageUrl:
      'https://images.unsplash.com/photo-1518893883800-45cd0954574b?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1518893883800-45cd0954574b?w=1200&q=80',
    ],
    stock: 50,
    featured: false,
    bestseller: true,
  },
  {
    id: 14,
    name: 'Brass Desk Set',
    slug: 'brass-desk-set',
    description:
      'A weighted brass ruler, letter opener, and pen tray that age into a deep patina. Sold as a set of three.',
    price: 11900,
    originalPrice: 13900,
    category: cat('stationery'),
    rating: 4.5,
    reviewCount: 44,
    imageUrl:
      'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=1200&q=80',
    ],
    stock: 19,
    featured: false,
    bestseller: false,
  },
  {
    id: 15,
    name: 'Fountain Pen, Ebonite',
    slug: 'fountain-pen-ebonite',
    description:
      'Hand-turned ebonite body with a steel nib in fine or medium. Balanced for long writing sessions, capped or posted.',
    price: 6900,
    originalPrice: null,
    category: cat('stationery'),
    rating: 4.7,
    reviewCount: 67,
    imageUrl:
      'https://images.unsplash.com/photo-1583485088034-697b5bc36b60?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1583485088034-697b5bc36b60?w=1200&q=80',
    ],
    stock: 28,
    featured: true,
    bestseller: false,
  },
  {
    id: 16,
    name: 'Canvas Weekender Bag',
    slug: 'canvas-weekender-bag',
    description:
      'Waxed cotton canvas with full-grain leather straps and base. A brass zip and interior pocket sized for a 15-inch laptop.',
    price: 19900,
    originalPrice: 22900,
    category: cat('bags'),
    rating: 4.8,
    reviewCount: 143,
    imageUrl:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&q=80',
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=1200&q=80',
    ],
    stock: 15,
    featured: true,
    bestseller: true,
  },
]

export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug)
}

export function getProductById(id) {
  return products.find((p) => p.id === Number(id))
}
