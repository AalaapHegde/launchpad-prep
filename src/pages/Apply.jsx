import { useState, useEffect } from 'react'
import Button from '../components/Button'
import ImagePlaceholder from '../components/ImagePlaceholder'
import '../styles/Apply.css'

function Apply() {
  const [formData, setFormData] = useState({
    studentFirstName: '',
    studentLastName: '',
    studentEmail: '',
    parentName: '',
    parentEmail: '',
    grade: '',
    interests: '',
    referralSource: ''
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.studentFirstName.trim()) {
      newErrors.studentFirstName = 'First name is required'
    }
    if (!formData.studentLastName.trim()) {
      newErrors.studentLastName = 'Last name is required'
    }
    if (!formData.studentEmail.trim()) {
      newErrors.studentEmail = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.studentEmail)) {
      newErrors.studentEmail = 'Please enter a valid email'
    }
    if (!formData.parentName.trim()) {
      newErrors.parentName = 'Parent/guardian name is required'
    }
    if (!formData.parentEmail.trim()) {
      newErrors.parentEmail = 'Parent/guardian email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.parentEmail)) {
      newErrors.parentEmail = 'Please enter a valid email'
    }
    if (!formData.grade) {
      newErrors.grade = 'Please select a grade'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (isSubmitted) {
    return (
      <div className="apply">
        <section className="apply-hero">
          <div className="container">
            <div className="confirmation fade-in visible">
              <div className="confirmation-icon">✓</div>
              <h1>Application Received!</h1>
              <p>
                Thank you for your interest in Launchpad Prep, {formData.studentFirstName}!
                We've received your application and will be in touch within 2-3 business days.
              </p>
              <p>
                We'll send a confirmation email to <strong>{formData.studentEmail}</strong> and
                <strong> {formData.parentEmail}</strong> with next steps.
              </p>
              <div className="confirmation-actions">
                <Button to="/" variant="primary" size="large">
                  Return Home
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="apply">
      {/* Hero Section */}
      <section className="apply-hero">
        <div className="container">
          <div className="apply-hero-grid">
            <div className="apply-hero-content fade-in">
              <h1>Start Your <span className="text-gold">Journey</span></h1>
              <p>
                Tell us a bit about yourself and your goals. Our team will review your
                application and reach out to discuss how Launchpad Prep can help you
                achieve your potential.
              </p>
              <div className="apply-highlights">
                <div className="highlight">
                  <span className="highlight-icon">📞</span>
                  <span>Free consultation call</span>
                </div>
                <div className="highlight">
                  <span className="highlight-icon">⚡</span>
                  <span>Response within 2-3 days</span>
                </div>
                <div className="highlight">
                  <span className="highlight-icon">🎯</span>
                  <span>Personalized mentor matching</span>
                </div>
              </div>
            </div>
            <div className="apply-hero-image fade-in">
              <ImagePlaceholder text="Student working with mentor illustration" aspectRatio="4/3" />
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="section apply-form-section">
        <div className="container">
          <div className="form-container fade-in">
            <h2>Application Form</h2>
            <p className="form-description">
              All fields marked with * are required. We'll use this information to
              match you with the perfect mentor.
            </p>

            <form onSubmit={handleSubmit} className="apply-form">
              {/* Student Information */}
              <div className="form-section">
                <h3>Student Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="studentFirstName">First Name *</label>
                    <input
                      type="text"
                      id="studentFirstName"
                      name="studentFirstName"
                      value={formData.studentFirstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      className={errors.studentFirstName ? 'error' : ''}
                    />
                    {errors.studentFirstName && (
                      <span className="error-message">{errors.studentFirstName}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="studentLastName">Last Name *</label>
                    <input
                      type="text"
                      id="studentLastName"
                      name="studentLastName"
                      value={formData.studentLastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      className={errors.studentLastName ? 'error' : ''}
                    />
                    {errors.studentLastName && (
                      <span className="error-message">{errors.studentLastName}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="studentEmail">Student Email *</label>
                    <input
                      type="email"
                      id="studentEmail"
                      name="studentEmail"
                      value={formData.studentEmail}
                      onChange={handleChange}
                      placeholder="student@email.com"
                      className={errors.studentEmail ? 'error' : ''}
                    />
                    {errors.studentEmail && (
                      <span className="error-message">{errors.studentEmail}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="grade">Current Grade *</label>
                    <select
                      id="grade"
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      className={errors.grade ? 'error' : ''}
                    >
                      <option value="">Select grade</option>
                      <option value="8th">8th Grade</option>
                      <option value="9th">9th Grade (Freshman)</option>
                      <option value="10th">10th Grade (Sophomore)</option>
                      <option value="11th">11th Grade (Junior)</option>
                      <option value="12th">12th Grade (Senior)</option>
                    </select>
                    {errors.grade && (
                      <span className="error-message">{errors.grade}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Parent Information */}
              <div className="form-section">
                <h3>Parent/Guardian Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="parentName">Parent/Guardian Name *</label>
                    <input
                      type="text"
                      id="parentName"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className={errors.parentName ? 'error' : ''}
                    />
                    {errors.parentName && (
                      <span className="error-message">{errors.parentName}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="parentEmail">Parent/Guardian Email *</label>
                    <input
                      type="email"
                      id="parentEmail"
                      name="parentEmail"
                      value={formData.parentEmail}
                      onChange={handleChange}
                      placeholder="parent@email.com"
                      className={errors.parentEmail ? 'error' : ''}
                    />
                    {errors.parentEmail && (
                      <span className="error-message">{errors.parentEmail}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="form-section">
                <h3>Tell Us More</h3>
                <div className="form-group full-width">
                  <label htmlFor="interests">
                    What are your interests or project ideas? (Optional)
                  </label>
                  <textarea
                    id="interests"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    placeholder="Share any subjects you're passionate about, research topics you'd like to explore, or project ideas you have in mind..."
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="referralSource">How did you hear about us?</label>
                  <select
                    id="referralSource"
                    name="referralSource"
                    value={formData.referralSource}
                    onChange={handleChange}
                  >
                    <option value="">Select an option</option>
                    <option value="google">Google Search</option>
                    <option value="social">Social Media</option>
                    <option value="friend">Friend or Family Referral</option>
                    <option value="school">School Counselor</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-submit">
                <Button type="submit" variant="primary" size="large">
                  Submit Application
                </Button>
                <p className="form-note">
                  By submitting this form, you agree to be contacted by Launchpad Prep
                  regarding our programs.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Alternative */}
      <section className="section contact-alternative">
        <div className="container">
          <div className="contact-content fade-in">
            <h2>Have Questions First?</h2>
            <p>
              We're happy to chat before you apply. Reach out to learn more about
              our programs and how we can help.
            </p>
            <div className="contact-options">
              <a href="mailto:hello@launchpadprep.com" className="contact-option">
                <span className="contact-icon">✉️</span>
                <span>hello@launchpadprep.com</span>
              </a>
              <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="contact-option">
                <span className="contact-icon">💬</span>
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Apply
