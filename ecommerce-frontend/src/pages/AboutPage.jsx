import './InfoPage.css'

export default function AboutPage() {
  return (
    <div className="container info-page">
      <span className="section-heading__eyebrow">About</span>
      <h1 className="info-page__title">Objects worth keeping</h1>
      <div className="info-page__body">
        <p>
          Fielding &amp; Vane started in 2019 with a simple frustration: most
          things sold as "premium" were just expensive versions of the same
          disposable products. We wanted to sell things people would still be
          using — and repairing, rather than replacing — a decade later.
        </p>
        <p>
          Today we work with twelve independent workshops across the country,
          each chosen for a specific craft: a joinery that still hand-cuts
          dovetails, a glassblower who mixes her own amber batches, a foundry
          that pours cast iron the slow way. We don't manufacture anything
          ourselves — our job is to find the people who already do it right,
          and get out of their way.
        </p>
        <p>
          Every product on this site ships with a repair guide, not just a
          warranty card. If something breaks, we'd rather help you fix it
          than send you a replacement.
        </p>
      </div>
    </div>
  )
}
