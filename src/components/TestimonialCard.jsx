import './TestimonialCard.css'

function TestimonialCard({ quote, name, role, university }) {
  return (
    <div className="testimonial-card">
      <div className="quote-mark">"</div>
      <p className="quote">{quote}</p>
      <div className="author">
        <div className="author-avatar">
          {name.charAt(0)}
        </div>
        <div className="author-info">
          <span className="author-name">{name}</span>
          <span className="author-role">{role}</span>
          {university && <span className="author-university">{university}</span>}
        </div>
      </div>
    </div>
  )
}

export default TestimonialCard
