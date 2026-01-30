import { useEffect } from 'react'
import Button from '../components/Button'
import '../styles/WhyUs.css'

function WhyUs() {
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
    <div className="why-us">
      {/* Hero */}
      <section className="section why-us-hero">
        <div className="container">
          <div className="hero-content fade-in">
            <h1>Why Launchpad Prep?</h1>
            <p>
              You want to be coached by someone who's actually played the game.
              Our mentors aren't just advisors—they're Ivy+ admits who've been
              exactly where you are now.
            </p>
          </div>
        </div>
      </section>

      {/* Main Value Props */}
      <section className="section value-props">
        <div className="container">
          <div className="value-prop-grid">
            {/* Mentors who've been in your shoes */}
            <div className="value-prop-card featured fade-in">
              <div className="value-prop-icon">🎓</div>
              <h3>Mentors Who've Been in Your Shoes</h3>
              <p>
                Our mentors are Ivy+ admits who share your major, interests, and goals.
                They understand your journey because they've lived it. No generic advice—just
                real guidance from someone who knows exactly what you're going through.
              </p>
            </div>

            {/* Deep project insights */}
            <div className="value-prop-card fade-in">
              <div className="value-prop-icon">🔬</div>
              <h3>Deep Project Insights</h3>
              <p>
                Our mentors have actually built the projects they'll help you create.
                They know the pitfalls, the shortcuts, and exactly what makes a project
                stand out to admissions committees.
              </p>
            </div>

            {/* Know what colleges look for */}
            <div className="value-prop-card fade-in">
              <div className="value-prop-icon">🎯</div>
              <h3>Inside Knowledge</h3>
              <p>
                They know what top colleges are really looking for—not from guidebooks,
                but from their own experiences and those of their peers who got into
                Stanford, MIT, Harvard, and beyond.
              </p>
            </div>

            {/* Older sibling relationship */}
            <div className="value-prop-card fade-in">
              <div className="value-prop-icon">🤝</div>
              <h3>Like an Older Sibling</h3>
              <p>
                More than a tutor or consultant—your mentor becomes someone who genuinely
                gets you. They connect with your ideas, resonate with your ambitions, and
                build a real relationship that goes beyond college apps.
              </p>
            </div>

            {/* AI Native */}
            <div className="value-prop-card fade-in">
              <div className="value-prop-icon">⚡</div>
              <h3>AI-Native Mentors</h3>
              <p>
                Our mentors know the best AI tools, the smartest workflows, and the
                most effective resources to help you build anything. They'll teach you
                to leverage technology the way top students and professionals do.
              </p>
            </div>

            {/* Build fast */}
            <div className="value-prop-card fade-in">
              <div className="value-prop-icon">🚀</div>
              <h3>Build Fast, Ship Real</h3>
              <p>
                No more spinning your wheels. Our mentors help you move quickly from
                idea to execution, so you can launch real projects that make a real
                impact—not just talk about them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="section comparison">
        <div className="container">
          <h2 className="section-title fade-in">The Launchpad Difference</h2>
          <div className="comparison-table fade-in">
            <div className="comparison-header">
              <div className="comparison-cell"></div>
              <div className="comparison-cell highlight">Launchpad Prep</div>
              <div className="comparison-cell">Traditional Services</div>
            </div>
            <div className="comparison-row">
              <div className="comparison-cell label">Mentors</div>
              <div className="comparison-cell highlight">Ivy+ students in your field</div>
              <div className="comparison-cell">Professional consultants</div>
            </div>
            <div className="comparison-row">
              <div className="comparison-cell label">Project Experience</div>
              <div className="comparison-cell highlight">Built it themselves</div>
              <div className="comparison-cell">Read about it</div>
            </div>
            <div className="comparison-row">
              <div className="comparison-cell label">Relationship</div>
              <div className="comparison-cell highlight">Older sibling energy</div>
              <div className="comparison-cell">Transactional</div>
            </div>
            <div className="comparison-row">
              <div className="comparison-cell label">Tech Skills</div>
              <div className="comparison-cell highlight">AI-native, cutting edge</div>
              <div className="comparison-cell">Traditional methods</div>
            </div>
            <div className="comparison-row">
              <div className="comparison-cell label">Pace</div>
              <div className="comparison-cell highlight">Build and ship fast</div>
              <div className="comparison-cell">Slow, bureaucratic</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section why-us-cta">
        <div className="container">
          <div className="cta-content fade-in">
            <h2>Ready to Work with a Real Mentor?</h2>
            <p>
              Get matched with an Ivy+ mentor who shares your interests and
              knows exactly how to help you stand out.
            </p>
            <Button to="/apply" variant="white" size="large">
              Apply Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default WhyUs
