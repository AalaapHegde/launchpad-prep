import { useEffect } from 'react'
import Button from '../components/Button'
import ImagePlaceholder from '../components/ImagePlaceholder'
import '../styles/About.css'

function About() {
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
    <div className="about">
      {/* Our Story */}
      <section className="section our-story">
        <div className="container">
          <div className="story-grid">
            <div className="story-content fade-in">
              <h2>Our Story</h2>
              <p>
                Launchpad Prep was founded by two friends who experienced firsthand the
                transformative power of mentorship. As students at top universities, we
                saw how guidance from the right mentor could unlock potential that students
                didn't even know they had.
              </p>
              <p>
                We noticed a gap: while many students had academic talent, they lacked the
                personalized support needed to translate that talent into standout college
                applications and meaningful career paths. Generic advice wasn't cutting it.
              </p>
              <p>
                That's why we created Launchpad Prep—to give every motivated student access
                to the kind of mentorship that changes trajectories. Our mentors don't just
                offer advice; they work alongside students, helping them discover their
                passions and turn ideas into real accomplishments.
              </p>
            </div>
            <div className="story-image fade-in">
              <ImagePlaceholder text="Founders photo" aspectRatio="4/5" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section className="section our-promise">
        <div className="container">
          <h2 className="section-title fade-in">Our Promise to You</h2>
          <p className="section-subtitle fade-in">
            Three commitments that set Launchpad Prep apart.
          </p>

          <div className="promise-grid fade-in">
            <div className="promise-card">
              <div className="promise-icon">🎯</div>
              <h3>Real Outcomes</h3>
              <p>
                We don't just talk about potential—we help you achieve it. Every student
                leaves with tangible accomplishments: published research, completed projects,
                and skills that impress admissions officers.
              </p>
            </div>
            <div className="promise-card">
              <div className="promise-icon">👨‍👩‍👧‍👦</div>
              <h3>Families in the Loop</h3>
              <p>
                Parents aren't left wondering what's happening. We provide regular updates,
                progress reports, and are always available to discuss your student's journey
                and next steps.
              </p>
            </div>
            <div className="promise-card">
              <div className="promise-icon">🤝</div>
              <h3>True Mentorship</h3>
              <p>
                Our mentors aren't tutors reading from a script. They're invested partners
                who share their own experiences, provide genuine guidance, and care about
                each student's success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section our-values">
        <div className="container">
          <div className="values-content fade-in">
            <h2>What We Stand For</h2>
            <div className="values-grid">
              <div className="value">
                <h4>Authenticity</h4>
                <p>We help students discover and showcase their true selves, not fit a mold.</p>
              </div>
              <div className="value">
                <h4>Excellence</h4>
                <p>We hold ourselves and our students to the highest standards of quality.</p>
              </div>
              <div className="value">
                <h4>Accessibility</h4>
                <p>Top-tier mentorship shouldn't be reserved for the privileged few.</p>
              </div>
              <div className="value">
                <h4>Impact</h4>
                <p>Every project we guide should make a real difference in the world.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section about-cta">
        <div className="container">
          <div className="cta-content fade-in">
            <h2>Ready to Meet Your Mentor?</h2>
            <p>
              Take the first step toward discovering your potential. Apply today and
              we'll match you with a mentor who understands your goals.
            </p>
            <Button to="/apply" variant="white" size="large">
              Start Your Application
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
