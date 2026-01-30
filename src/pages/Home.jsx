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
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Launch Your Future with <span className="text-gold">Ivy+ Mentorship</span>
            </h1>
            <p className="hero-subtitle">
              Launchpad Prep matches you with accomplished Ivy+ admits who share your major, interests, and goals. Work with them for college counseling or building a research project.
            </p>
            <div className="hero-cta">
              <Button to="/apply" variant="primary" size="large">
                Start Your Journey
              </Button>
            </div>
            <div className="hero-universities">
              <span>Our mentors come from:</span>
              <div className="university-logos">
                <img src="/stanford-logo.png" alt="Stanford" className="university-logo" />
                <img src="/stanford-logo.png" alt="Harvard" className="university-logo" />
                <img src="/stanford-logo.png" alt="MIT" className="university-logo" />
                <img src="/stanford-logo.png" alt="Yale" className="university-logo" />
                <img src="/stanford-logo.png" alt="Princeton" className="university-logo" />
                <img src="/stanford-logo.png" alt="Columbia" className="university-logo" />
              </div>
            </div>
          </div>
          <div className="hero-image">
            <ImagePlaceholder text="Students collaborating with mentor" aspectRatio="4/3" />
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="section programs-overview">
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
              <div className="program-badge">6 Months</div>
              <h3>College Counseling</h3>
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
              <div className="program-badge">3 Months</div>
              <h3>Research Program</h3>
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
              <h3>Tell Us About Yourself</h3>
              <p>Fill out a quick application so we can learn about your interests, goals, and what excites you most.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Meet Your Mentor</h3>
              <p>We'll match you with a mentor who gets you—someone who shares your interests and can guide your journey.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Start Building</h3>
              <p>Dive into your project or research with your mentor by your side, meeting weekly over Zoom.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Show Off Your Work</h3>
              <p>Finish with something real to be proud of—a published paper, a passion project, or a stronger application.</p>
            </div>
          </div>
        </div>
      </section>

      {/* All Programs Include */}
      <section className="section whats-included">
        <div className="container">
          <h2 className="section-title fade-in">All Programs Include</h2>

          <div className="included-grid fade-in">
            <div className="included-item">
              <div className="included-icon">📹</div>
              <h4>Hourly 1:1 Zoom Sessions</h4>
              <p>Regular video calls with your dedicated mentor to guide you through every step of your journey.</p>
            </div>
            <div className="included-item">
              <div className="included-icon">🎓</div>
              <h4>Top University Mentor</h4>
              <p>Work with a mentor from Stanford, Harvard, MIT, Yale, Princeton, Columbia, UPenn, or Duke.</p>
            </div>
            <div className="included-item">
              <div className="included-icon">🤖</div>
              <h4>AI Training</h4>
              <p>Learn how to use AI tools to maximize your workflow and get more done in less time.</p>
            </div>
            <div className="included-item">
              <div className="included-icon">💬</div>
              <h4>48-Hour Async Responses</h4>
              <p>Get answers to your questions via messaging with guaranteed 48-hour response time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section pricing">
        <div className="container">
          <h2 className="section-title fade-in">Investment in Your Future</h2>
          <p className="section-subtitle fade-in">
            Transparent pricing with no hidden fees. Choose the program that fits your goals.
          </p>

          <div className="pricing-grid fade-in">
            <div className="pricing-card featured">
              <div className="featured-badge">Most Popular</div>
              <h3>College Counseling</h3>
              <p className="pricing-duration">6 months</p>
              <div className="pricing-amount">
                <span className="currency">$</span>
                <span className="price">3,000</span>
              </div>
              <ul className="pricing-features">
                <li>15 hours of mentoring</li>
                <li>1-2 passion projects</li>
                <li>Summer program guidance</li>
                <li>48-hour async support</li>
              </ul>
              <Button to="/apply" variant="primary" size="large">
                Apply Now
              </Button>
            </div>

            <div className="pricing-card">
              <h3>Research Program</h3>
              <p className="pricing-duration">3 months</p>
              <div className="pricing-amount">
                <span className="currency">$</span>
                <span className="price">3,000</span>
              </div>
              <ul className="pricing-features">
                <li>12 weekly 1-on-1 sessions</li>
                <li>Publishable research paper</li>
                <li>Top university mentor</li>
                <li>AI tools training</li>
              </ul>
              <Button to="/apply" variant="primary" size="large">
                Apply Now
              </Button>
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
