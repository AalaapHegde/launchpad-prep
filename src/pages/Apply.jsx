import { useEffect } from 'react'
import '../styles/Apply.css'

function Apply() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="apply">
      <section className="apply-main">
        <div className="container">
          <div className="apply-layout fade-in">
            {/* Sidebar with info */}
            <div className="apply-sidebar">
              <h1>Start Your <span className="text-gold">Journey</span></h1>
              <p className="apply-description">
                Tell us about yourself and your goals. We'll be in touch within 48 hours.
              </p>

              <div className="apply-benefits">
                <div className="benefit">
                  <span className="benefit-icon">📞</span>
                  <div>
                    <strong>Free consultation</strong>
                    <span>No commitment required</span>
                  </div>
                </div>
                <div className="benefit">
                  <span className="benefit-icon">⚡</span>
                  <div>
                    <strong>Fast response</strong>
                    <span>Within 2-3 days</span>
                  </div>
                </div>
                <div className="benefit">
                  <span className="benefit-icon">🎯</span>
                  <div>
                    <strong>Perfect match</strong>
                    <span>Personalized mentor pairing</span>
                  </div>
                </div>
              </div>

              <div className="apply-contact">
                <p>Questions? Reach out anytime:</p>
                <a href="mailto:hello@launchpadprep.com">hello@launchpadprep.com</a>
              </div>
            </div>

            {/* Typeform */}
            <div className="apply-form-wrapper">
              <iframe
                src="https://form.typeform.com/to/yu0gXekQ"
                title="Launchpad Prep Application"
                className="typeform-iframe"
                allow="camera; microphone; autoplay; encrypted-media;"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Apply
