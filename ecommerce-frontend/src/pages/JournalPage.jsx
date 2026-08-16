import './InfoPage.css'

const ENTRIES = [
  {
    date: 'July 2026',
    title: 'Inside the Kerala joinery behind our Oak Lounge Chair',
    excerpt: 'A third-generation workshop still cutting dovetails by hand, and why that matters for a chair meant to last decades.',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80',
  },
  {
    date: 'June 2026',
    title: 'How our cast iron skillets get their first seasoning',
    excerpt: 'Three coats of flaxseed oil, poured — not stamped — iron, and a process that hasn\'t changed in forty years.',
    image: 'https://images.unsplash.com/photo-1584990347449-a8b2a1d38f37?w=600&q=80',
  },
  {
    date: 'May 2026',
    title: 'A single-room glass studio outside Pune',
    excerpt: 'The maker behind our amber pendant lights on why mouth-blown glass is worth the wait.',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&q=80',
  },
]

export default function JournalPage() {
  return (
    <div className="container info-page">
      <span className="section-heading__eyebrow">Journal</span>
      <h1 className="info-page__title">Stories from the workshop</h1>
      <div className="journal-list">
        {ENTRIES.map((entry) => (
          <article key={entry.title} className="journal-entry">
            <div className="journal-entry__image">
              <img src={entry.image} alt="" loading="lazy" />
            </div>
            <div>
              <span className="journal-entry__date">{entry.date}</span>
              <h2 className="journal-entry__title">{entry.title}</h2>
              <p className="journal-entry__excerpt">{entry.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
