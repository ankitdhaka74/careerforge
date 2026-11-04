
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  UserRound,
  GraduationCap,
  Code2,
  BriefcaseBusiness,
  CheckCircle2,
  Save,
} from 'lucide-react'
import './Profile.css'

const availableSkills = [
  'C++',
  'Java',
  'Python',
  'JavaScript',
  'React',
  'Node.js',
  'HTML',
  'CSS',
  'SQL',
  'MongoDB',
  'Data Structures',
  'Git',
]

const initialProfile = {
  fullName: '',
  email: '',
  phone: '',
  university: '',
  degree: 'B.Tech',
  branch: 'Computer Science Engineering',
  graduationYear: '',
  cgpa: '',
  careerGoal: 'Software Developer',
  skills: [],
  resumeName: '',
  about: '',
}

export default function Profile() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('careerforge-profile')
      return saved
        ? { ...initialProfile, ...JSON.parse(saved) }
        : initialProfile
    } catch {
      return initialProfile
    }
  })

  const [message, setMessage] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setProfile((current) => ({
      ...current,
      [name]: value,
    }))

    setMessage('')
  }

  function toggleSkill(skill) {
    setProfile((current) => ({
      ...current,
      skills: current.skills.includes(skill)
        ? current.skills.filter((item) => item !== skill)
        : [...current.skills, skill],
    }))

    setMessage('')
  }

  function handleResume(event) {
    const file = event.target.files?.[0]

    if (!file) return

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]

    if (!allowedTypes.includes(file.type)) {
      setMessage('Please select a PDF or Word resume.')
      event.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('Your resume must be smaller than 5 MB.')
      event.target.value = ''
      return
    }

    setProfile((current) => ({
      ...current,
      resumeName: file.name,
    }))

    setMessage(
      'Resume selected. The file itself is not uploaded or stored yet.'
    )
  }

  function handleSubmit(event) {
    event.preventDefault()

    try {
      localStorage.setItem(
        'careerforge-profile',
        JSON.stringify(profile)
      )

      setMessage('Profile saved successfully on this browser!')
    } catch {
      setMessage('Could not save your profile. Please check browser storage.')
    }
  }

  return (
    <main className="profile-page">
      <header className="profile-topbar">
        <button
          type="button"
          className="profile-back"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft size={18} /> Back to dashboard
        </button>

        <button
          type="button"
          className="profile-brand"
          onClick={() => navigate('/')}
        >
          <span>CF</span> CareerForge
        </button>
      </header>

      <div className="profile-container">
        <div className="profile-heading">
          <div className="profile-heading-icon">
            <UserRound size={26} />
          </div>

          <div>
            <span className="profile-eyebrow">YOUR CAREER JOURNEY</span>
            <h1>Build your student profile</h1>
            <p>
              Tell us about your education, skills, and career goals.
            </p>
          </div>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <section className="profile-card">
            <div className="profile-section-title">
              <span className="profile-section-icon">
                <UserRound size={20} />
              </span>
              <div>
                <h2>Personal information</h2>
                <p>Basic information about you.</p>
              </div>
            </div>

            <div className="profile-fields">
              <div className="profile-field">
                <label htmlFor="fullName">Full name *</label>
                <input
                  id="fullName"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="profile-field">
                <label htmlFor="email">Email address *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="profile-field">
                <label htmlFor="phone">Phone number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="profile-field">
                <label htmlFor="careerGoal">Career goal *</label>
                <select
                  id="careerGoal"
                  name="careerGoal"
                  value={profile.careerGoal}
                  onChange={handleChange}
                  required
                >
                  <option>Software Developer</option>
                  <option>Web Developer</option>
                  <option>Data Analyst</option>
                  <option>Data Scientist</option>
                  <option>Cybersecurity Analyst</option>
                  <option>Cloud Engineer</option>
                  <option>UI/UX Designer</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="profile-field full-width">
                <label htmlFor="about">About me</label>
                <textarea
                  id="about"
                  name="about"
                  value={profile.about}
                  onChange={handleChange}
                  placeholder="Describe your interests, strengths, and career goals..."
                  rows={4}
                  maxLength={500}
                />
                <small>{profile.about.length}/500 characters</small>
              </div>
            </div>
          </section>

          <section className="profile-card">
            <div className="profile-section-title">
              <span className="profile-section-icon blue">
                <GraduationCap size={21} />
              </span>
              <div>
                <h2>Academic details</h2>
                <p>These details will help determine placement eligibility.</p>
              </div>
            </div>

            <div className="profile-fields">
              <div className="profile-field full-width">
                <label htmlFor="university">University / College *</label>
                <input
                  id="university"
                  name="university"
                  value={profile.university}
                  onChange={handleChange}
                  placeholder="Enter your college or university"
                  required
                />
              </div>

              <div className="profile-field">
                <label htmlFor="degree">Degree</label>
                <select
                  id="degree"
                  name="degree"
                  value={profile.degree}
                  onChange={handleChange}
                >
                  <option>B.Tech</option>
                  <option>B.E.</option>
                  <option>BCA</option>
                  <option>MCA</option>
                  <option>M.Tech</option>
                  <option>B.Sc.</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="profile-field">
                <label htmlFor="branch">Branch / Specialization *</label>
                <input
                  id="branch"
                  name="branch"
                  value={profile.branch}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                  required
                />
              </div>

              <div className="profile-field">
                <label htmlFor="graduationYear">Graduation year *</label>
                <select
                  id="graduationYear"
                  name="graduationYear"
                  value={profile.graduationYear}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select graduation year</option>
                  {Array.from({ length: 8 }, (_, i) => 2026 + i).map(
                    (year) => (
                      <option key={year} value={String(year)}>
                        {year}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="profile-field">
                <label htmlFor="cgpa">CGPA (out of 10) *</label>
                <input
                  id="cgpa"
                  name="cgpa"
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  value={profile.cgpa}
                  onChange={handleChange}
                  placeholder="e.g. 8.25"
                  required
                />
              </div>
            </div>
          </section>

          <section className="profile-card">
            <div className="profile-section-title">
              <span className="profile-section-icon green">
                <Code2 size={21} />
              </span>
              <div>
                <h2>Technical skills</h2>
                <p>Select the skills you currently have.</p>
              </div>
            </div>

            <div className="profile-skills">
              {availableSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  className={
                    profile.skills.includes(skill)
                      ? 'profile-skill selected'
                      : 'profile-skill'
                  }
                  onClick={() => toggleSkill(skill)}
                  aria-pressed={profile.skills.includes(skill)}
                >
                  {profile.skills.includes(skill) && (
                    <CheckCircle2 size={15} />
                  )}
                  {skill}
                </button>
              ))}
            </div>

            <p className="profile-selected-count">
              {profile.skills.length} skill
              {profile.skills.length === 1 ? '' : 's'} selected
            </p>
          </section>

          <section className="profile-card">
            <div className="profile-section-title">
              <span className="profile-section-icon orange">
                <BriefcaseBusiness size={21} />
              </span>
              <div>
                <h2>Resume</h2>
                <p>Select your latest resume to prepare it for future upload.</p>
              </div>
            </div>

            <label className="resume-upload" htmlFor="resume">
              <span className="resume-upload-icon">
                <ArrowRight size={20} />
              </span>
              <span>
                <strong>
                  {profile.resumeName || 'Choose your resume'}
                </strong>
                <small>PDF or Word document · Maximum 5 MB</small>
              </span>
              <span className="resume-browse">Browse</span>
            </label>

            <input
              id="resume"
              className="resume-input"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResume}
            />

            <p className="resume-note">
              Demo only: the selected file is not uploaded. Only its filename
              is saved with your profile.
            </p>
          </section>

          {message && (
            <div className="profile-message" role="status">
              {message}
            </div>
          )}

          <div className="profile-actions">
            <button
              type="button"
              className="profile-cancel"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>

            <button type="submit" className="profile-save">
              <Save size={17} /> Save profile
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
