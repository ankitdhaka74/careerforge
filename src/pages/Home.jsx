
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  GraduationCap,
  Menu,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react'
import '../App.css'

const features = [
  {
    icon: Target,
    title: 'Know your eligibility',
    description:
      'Understand which placement opportunities match your academic criteria and why.',
    color: 'purple',
  },
  {
    icon: TrendingUp,
    title: 'Close your skill gaps',
    description:
      'Discover missing skills and plan what to learn next.',
    color: 'blue',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Track every application',
    description:
      'Manage internships, placement applications, and progress in one place.',
    color: 'green',
  },
]

const steps = [
  ['01', 'Build your profile', 'Add your education, skills, interests, and goals.'],
  ['02', 'Discover opportunities', 'Explore placements and internships matching your profile.'],
  ['03', 'Prepare with purpose', 'Identify skill gaps and improve your career readiness.'],
]

export default function Home() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const goToLogin = () => {
    setMenuOpen(false)
    navigate('/login')
  }

  const goToSignup = () => {
    setMenuOpen(false)
    navigate('/signup')
  }

  return (
    <div className="site-shell">
      <header className="navbar">
        <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="brand-icon"><Zap size={21} /></span>
          <span>Career<span className="brand-accent">Forge</span></span>
        </button>

        <button
          className="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={menuOpen ? 'nav-links nav-open' : 'nav-links'}>
          <button onClick={() => goTo('features')}>Features</button>
          <button onClick={() => goTo('how-it-works')}>How it works</button>
          <button onClick={() => goTo('about')}>About</button>
          <button className="nav-login" onClick={goToLogin}>Log in</button>
          <button className="button button-small" onClick={goToSignup}>
            Get started <ArrowRight size={16} />
          </button>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <div className="eyebrow">
              <Sparkles size={15} /> YOUR CAREER JOURNEY, REIMAGINED
            </div>

            <h1>
              Your future<br />
              doesn’t happen.<br />
              <span>You build it.</span>
            </h1>

            <p className="hero-description">
              Discover opportunities, understand your placement readiness,
              and build the skills that move your career forward—all in one place.
            </p>

            <div className="hero-actions">
              <button className="button" onClick={goToSignup}>
                Start your journey <ArrowRight size={18} />
              </button>
              <button className="button button-outline" onClick={() => goTo('features')}>
                Explore features <ArrowUpRight size={17} />
              </button>
            </div>

            <div className="hero-note">
              <ShieldCheck size={17} />
              <span>Build a clearer, more structured career journey.</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-orb orb-one" />
            <div className="visual-orb orb-two" />

            <div className="dashboard-preview">
              <div className="preview-top">
                <div>
                  <span className="preview-label">CAREER OVERVIEW</span>
                  <h3>Your next chapter starts here.</h3>
                </div>
                <span className="preview-avatar">S</span>
              </div>

              <div className="preview-score">
                <div>
                  <span className="preview-label">READINESS SNAPSHOT</span>
                  <h2>Build your potential</h2>
                  <p>Track the steps you take toward your goals.</p>
                </div>
                <div className="score-circle"><Target size={25} /></div>
              </div>

              <div className="preview-stats">
                <div className="stat-card">
                  <span className="stat-icon stat-purple">
                    <BriefcaseBusiness size={18} />
                  </span>
                  <strong>Explore</strong>
                  <small>Career opportunities</small>
                </div>
                <div className="stat-card">
                  <span className="stat-icon stat-blue"><Code2 size={18} /></span>
                  <strong>Improve</strong>
                  <small>Skills and knowledge</small>
                </div>
              </div>

              <div className="preview-task">
                <div className="task-check"><CheckCircle2 size={19} /></div>
                <div>
                  <strong>Your next step</strong>
                  <p>Complete your student profile</p>
                </div>
                <ArrowUpRight size={19} />
              </div>

              <div className="preview-footer">
                <GraduationCap size={17} />
                Your journey. Your progress. Your future.
              </div>
            </div>

            <div className="floating-chip chip-top">
              <span className="chip-dot" />
              Your next opportunity awaits
            </div>

            <div className="floating-chip chip-bottom">
              <TrendingUp size={18} />
              <span>
                <strong>Progress with purpose</strong>
                <small>One step at a time</small>
              </span>
            </div>
          </div>
        </section>

        <section className="trust-strip">
          <span>ONE PLATFORM</span>
          <span><CheckCircle2 size={17} /> Career clarity</span>
          <span><CheckCircle2 size={17} /> Skill development</span>
          <span><CheckCircle2 size={17} /> Placement tracking</span>
        </section>

        <section className="section features-section" id="features">
          <div className="section-heading">
            <span className="eyebrow">WHY CAREERFORGE?</span>
            <h2>Everything you need to move <span>forward.</span></h2>
            <p>Less confusion about your next step. More clarity about what to do next.</p>
          </div>

          <div className="feature-grid">
            {features.map(({ icon: Icon, title, description, color }) => (
              <article className="feature-card" key={title}>
                <div className={`feature-icon ${color}`}><Icon size={23} /></div>
                <h3>{title}</h3>
                <p>{description}</p>
                <button className="text-link" onClick={() => goTo('how-it-works')}>
                  Learn more <ArrowRight size={16} />
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="section process-section" id="how-it-works">
          <div className="section-heading">
            <span className="eyebrow">A CLEARER PATH</span>
            <h2>From student to <span>career-ready.</span></h2>
            <p>A simple process that helps you take your next step with confidence.</p>
          </div>

          <div className="steps-grid">
            {steps.map(([number, title, description]) => (
              <article className="step-card" key={number}>
                <span className="step-number">{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="cta-section" id="get-started">
          <div className="cta-decoration"><Sparkles size={30} /></div>
          <span className="eyebrow">YOUR NEXT CHAPTER</span>
          <h2>Make your next move <span>count.</span></h2>
          <p>Start by building your profile. Your career journey begins with one step.</p>
          <button className="button cta-button" onClick={goToSignup}>
            Build your future <ArrowRight size={18} />
          </button>
        </section>

        <section className="about-strip" id="about">
          <div className="brand">
            <span className="brand-icon"><Zap size={20} /></span>
            <span>Career<span className="brand-accent">Forge</span></span>
          </div>
          <p>Build Your Skills. Shape Your Future.</p>
        </section>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} CareerForge</span>
        <span>Designed for your next opportunity.</span>
      </footer>
    </div>
  )
}
