import { useState, useEffect, useRef } from 'react'
import Button from '../components/Button'
import ImagePlaceholder from '../components/ImagePlaceholder'
import ProgramTabs from '../components/ProgramTabs'
import TestimonialCard from '../components/TestimonialCard'
import '../styles/Home.css'

function Home() {
  const [activeTab, setActiveTab] = useState('counseling')

  // Fade-in animation on scroll
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

  const testimonials = [
    {
      quote: "Launchpad Prep transformed my college application journey. My mentor helped me discover my passion for computational biology and guided me through publishing my first research paper.",
      name: "Sarah M.",
      role: "Student",
      university: "Stanford '28"
    },
    {
      quote: "As a parent, I was impressed by the personalized attention my son received. The mentors truly care about each student's success and kept us informed every step of the way.",
      name: "Michael T.",
      role: "Parent"
    },
    {
      quote: "The research program exceeded all expectations. I went from knowing nothing about academic research to presenting at a national conference. This experience was invaluable.",
      name: "James L.",
      role: "Student",
      university: "MIT '27"
    },
    {
      quote: "We saw a complete transformation in our daughter's confidence and clarity about her future. The mentorship she received was worth every penny.",
      name: "Rebecca K.",
      role: "Parent"
    }
  ]

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero hero-centered">
        <div className="container">
          <div className="hero-content-centered">
            <p className="hero-tagline">Ivy+ Mentorship for High Schoolers</p>
            <h1 className="hero-title-large">
              We turn your child's goals into <span className="text-gold">standout achievements</span>
            </h1>
            <p className="hero-subtitle-large">
              Launchpad Prep matches you with accomplished Ivy+ admits who share your major, interests, and goals. Work with them for college counseling or building a research project.
            </p>
            <div className="hero-cta-centered">
              <Button to="/apply" variant="primary" size="large">
                Start Your Journey
              </Button>
              <a href="#programs" className="btn btn-secondary btn-large">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Banner */}
      <section className="mission-banner">
        <div className="container">
          <p>
            We want to provide you with the <span className="highlight">clearest possible pathway</span> to achieving your dreams, so we work hard to match you with a mentor who has achieved them. Work with a mentor who was accepted into <span className="highlight">your dream program</span> at <span className="highlight">your dream school</span> and build a profile that is <span className="gold">undeniable</span>.
          </p>
        </div>
      </section>

      {/* Program Overview */}
      <section className="section programs-overview" id="programs">
        <div className="container">
          <h2 className="section-title fade-in">Two Paths to Success</h2>
          <p className="section-subtitle fade-in">
            Whether you want to conduct original research or need comprehensive college guidance,
            we have a program designed for you.
          </p>

          <ProgramTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="programs-grid fade-in">
            {/* College Counseling */}
            <div className={`program-card ${activeTab === 'counseling' ? 'active' : ''}`} id="counseling">
              <div className="program-price-tag">$3,000</div>
              <h3>College Counseling <span className="program-duration">(6 months)</span></h3>
              <p className="program-description">
                Comprehensive guidance to help you craft a standout application with
                passion projects and strategic summer planning.
              </p>
              <ul className="program-highlights">
                <li>
                  <span className="check-icon">✓</span>
                  15 hours of 1-on-1 mentoring
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  1-2 high-impact passion projects
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  Summer program guidance
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  48-hour async support response
                </li>
              </ul>
              <Button to="/apply" variant="primary">Apply for Counseling</Button>
            </div>

            {/* Research Program */}
            <div className={`program-card ${activeTab === 'research' ? 'active' : ''}`} id="research">
              <div className="program-price-tag">$3,000</div>
              <h3>Research Program <span className="program-duration">(3 months)</span></h3>
              <p className="program-description">
                Work 1-on-1 with a mentor from a top university to conduct original research
                and publish a paper in your field of interest.
              </p>
              <ul className="program-highlights">
                <li>
                  <span className="check-icon">✓</span>
                  12 weekly 1-on-1 mentoring sessions
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  Publishable research paper
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  Training in AI tools and research methods
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  Mentor from Stanford, MIT, Harvard, or similar
                </li>
              </ul>
              <Button to="/apply" variant="primary">Apply for Research</Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section how-it-works">
        <div className="container">
          <h2 className="section-title fade-in">How It Works</h2>
          <p className="section-subtitle fade-in">
            Getting started is easy. Here's what to expect every step of the way.
          </p>

          <div className="steps-grid fade-in">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Submit Your Application</h3>
              <p>Tell us about your interests, goals, and aspirations. It only takes a few minutes to get started.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Free Strategy Session</h3>
              <p>Receive a complimentary 20-minute strategy session with your best-fit mentor—no commitment required.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>View Your Blueprint</h3>
              <p>Get a personalized admissions blueprint outlining your path to success and recommended next steps.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Book Your Mentor</h3>
              <p>Ready to go? Lock in your mentor and begin your journey toward standout applications and real accomplishments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Archetypes */}
      <section className="section project-archetypes">
        <div className="container">
          <h2 className="section-title fade-in">Project Archetypes</h2>
          <p className="section-subtitle fade-in">
            Discover the types of impactful projects you can build with your mentor.
          </p>

          <div className="archetypes-grid fade-in">
            <div className="archetype-item">
              <div className="archetype-icon">🔬</div>
              <h4>Research Projects</h4>
              <p>Conduct original research and publish papers in academic journals or present at conferences.</p>
            </div>
            <div className="archetype-item">
              <div className="archetype-icon">📱</div>
              <h4>Apps & Software</h4>
              <p>Build and launch your own mobile app or web application that solves a real-world problem.</p>
            </div>
            <div className="archetype-item">
              <div className="archetype-icon">🎬</div>
              <h4>Content Creation</h4>
              <p>Create educational content, start a podcast, YouTube channel, or build a following around your expertise.</p>
            </div>
            <div className="archetype-item">
              <div className="archetype-icon">🤝</div>
              <h4>Start a Nonprofit</h4>
              <p>Launch a nonprofit organization to make a meaningful impact in your community or beyond.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials">
        <div className="container">
          <h2 className="section-title fade-in">What Students & Parents Say</h2>
          <p className="section-subtitle fade-in">
            Real stories from families who've experienced the Launchpad Prep difference.
          </p>

          <div className="testimonials-grid fade-in">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section final-cta">
        <div className="container">
          <div className="cta-content fade-in">
            <h2>Ready to Launch Your Future?</h2>
            <p>
              Join hundreds of students who've discovered their passions and achieved their dreams
              with Launchpad Prep mentorship.
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

export default Home
