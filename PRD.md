# Product Requirements Document: Passion Project Mentorship Firm Website

## Overview

Create a 3-page website for a passion project mentorship firm targeting high school students and their parents. The website should be deployable, professional, and parent-friendly with a traditional education feel—not overly techy or startup-y.

---

## Design Requirements

### Color Palette
- **Primary:** Navy blue (#1e3a5f or similar)
- **Secondary:** White/cream
- **Accent:** Gold (#c9a227 or similar)
- Clean, readable typography (serif for headers is fine)

### Feel
- Trustworthy and credible (parents are the buyers)
- Warm and approachable (not corporate)
- Traditional education aesthetic (think prep school, not Silicon Valley)
- Friendly, exciting, and energetic copy
- Similar visual feel to https://admitmate.org/

### Graphics
- Include placeholder boxes for images throughout
- Each placeholder should have a description of what the image should be
- Style placeholders as gray boxes with the description text centered inside

---

## Page 1: Home

### Hero Section
- **Headline:** "Your Ivy+ Twin is Waiting"
- **Subheadline:** "Get matched with a mentor who's already done what you dream of doing—and build something extraordinary together."
- **CTA Button:** "Start Your Journey"
- **[GRAPHIC PLACEHOLDER]:** Smiling mentor and high school student collaborating at a laptop, warm lighting, casual but professional setting

### Section 2: The Program
- **Header:** "This Isn't Tutoring. This is Your Launchpad."
- **Body copy:**
  - "In just 3 months, you'll work 1:1 with a mentor from Stanford, Harvard, MIT, and other top schools."
  - "Together, you'll build something real—a research paper, an app, a nonprofit, a publication. Something that makes admissions officers stop scrolling."
  - "Plus, you'll learn how to use AI like a superpower—so you can work smarter, move faster, and stand out from the crowd."
- **[GRAPHIC PLACEHOLDER]:** Collage of student project examples—research poster, mobile app mockup, nonprofit logo, published article

### Section 3: How It Works
- **Header:** "Four Steps to Something Amazing"

**Step 1: "Apply in 2 Minutes"**
- "Tell us about your student and what excites them."
- [GRAPHIC PLACEHOLDER]: Icon of a clipboard or application form

**Step 2: "Get Your Perfect Match"**
- "We'll pair you with a mentor who shares your passions—plus a personalized project blueprint."
- [GRAPHIC PLACEHOLDER]: Icon of two people connecting or puzzle pieces fitting together

**Step 3: "Meet Your Mentor (Free!)"**
- "Hop on a 20-minute strategy call to make sure it's the right fit. No pressure, no commitment."
- [GRAPHIC PLACEHOLDER]: Icon of a video call or two people talking

**Step 4: "Build Something Incredible"**
- "Enroll and kick off your 12-week journey to a standout project."
- [GRAPHIC PLACEHOLDER]: Icon of a rocket launching or lightbulb

### Section 4: What's Included
- **Header:** "Everything You Need to Succeed"
- **Bullet points with icons:**
  - "12 weekly 1:1 sessions with your mentor"
  - "A community of ambitious students (and parents who get it)"
  - "WhatsApp access—so families always know what's happening"
  - "48-hour response guarantee—no ghosting, ever"
- **[GRAPHIC PLACEHOLDER]:** Happy student holding up a completed project, parents smiling in background

### Section 5: Final CTA
- **Header:** "Ready to Build Something That Matters?"
- **Subtext:** "Applications take 2 minutes. Your future self will thank you."
- **Button:** "Apply Now"
- **[GRAPHIC PLACEHOLDER]:** Diverse group of students celebrating, graduation caps or high-fives

### Footer
- **Links:** Home | About Us | Apply
- Contact email
- © 2025 [Company Name]

---

## Page 2: About Us

### Hero Section
- **Header:** "We Believe Every Student Has a Spark"
- **Subtext:** "We're here to help them turn it into a fire."
- **[GRAPHIC PLACEHOLDER]:** Warm photo of founders—two young people, approachable and smiling, casual professional attire

### Section 1: Our Story
- **Header:** "Why We Started This"
- **Body copy:**
  - "We've been in your shoes. The pressure to stand out. The endless list of activities that don't mean anything. The stress of figuring out what makes you *you*."
  - "We started [Company Name] because we believe the best way to stand out isn't to do more—it's to do something real. Something you actually care about. Something that shows colleges who you really are."
  - "And we knew students needed more than advice. They needed a partner. Someone who's been there, done that, and can show them the way."
- **[GRAPHIC PLACEHOLDER]:** Candid photo of a mentor and student working together, maybe at a coffee shop or library

### Section 2: Our Mentors
- **Header:** "Your Mentor Gets It—Because They've Done It"
- **Body copy:**
  - "Every mentor is a student or recent grad from Stanford, Harvard, MIT, Yale, Princeton, and other top schools."
  - "They're not just smart—they've built the exact kind of projects your student wants to build. Research papers. Apps. Nonprofits. Startups."
  - "We hand-match every student with a mentor who shares their interests, their energy, and their ambition."
- **[GRAPHIC PLACEHOLDER]:** Grid of 4-6 mentor headshots with school logos subtly visible—diverse, friendly, approachable faces

### Section 3: Our Promise
- **Header:** "What We Stand For"
- **Three columns or cards:**

**Card 1: "Real Outcomes, Not Busywork"**
- "Your student will walk away with something tangible—not just another line on a resume."
- [GRAPHIC PLACEHOLDER]: Icon of a trophy or finished project

**Card 2: "Families Stay in the Loop"**
- "No black box. You'll always know what's happening and how your student is progressing."
- [GRAPHIC PLACEHOLDER]: Icon of a family or chat bubbles

**Card 3: "Mentorship, Not Hand-Holding"**
- "We guide, challenge, and support—but your student does the work. That's how growth happens."
- [GRAPHIC PLACEHOLDER]: Icon of a ladder or person climbing

### Final CTA
- **Header:** "Ready to Meet Your Mentor?"
- **Button:** "Apply Now"

---

## Page 3: Apply

### Header Section
- **Header:** "Let's Get Started!"
- **Subtext:** "Tell us a little about your student. This takes about 2 minutes—and we'll be in touch within 48 hours."
- **[GRAPHIC PLACEHOLDER]:** Friendly illustration of a student waving or a welcome mat

### Form (UI only, no backend logic)

**Fields:**
| Field | Type |
|-------|------|
| Student First Name | Text input |
| Student Last Name | Text input |
| Student Email | Text input |
| Parent/Guardian Name | Text input |
| Parent/Guardian Email | Text input |
| Student's Current Grade | Dropdown: 8th, 9th, 10th, 11th, 12th |
| What's your student excited about? What would they love to build? | Text area |
| How did you hear about us? | Dropdown: Friend/Family, Social Media, School, Google, Other |

**Submit Button:** "Submit Application"

### Below Form
- Small text: "Questions? Email us at [email@example.com]—we'd love to hear from you."

### After Submit (static confirmation, no actual logic)
- Show a simple confirmation message on the same page or a styled alert:
- "🎉 Application Received! We'll be in touch within 48 hours. Keep an eye on your inbox!"

---

## Technical Requirements

- [ ] Fully responsive (mobile-friendly)
- [ ] Fast loading
- [ ] Deployable (Vercel, Netlify, or similar)
- [ ] Clean, semantic HTML/CSS (React or plain HTML both fine)
- [ ] Form is UI only—no submission logic, no data storage
- [ ] Placeholder graphics should be styled gray boxes with centered description text

---

## Reference

**Visual inspiration:** https://admitmate.org/
- Clean layout
- Education-focused color palette
- Parent-friendly language
- Clear CTAs
