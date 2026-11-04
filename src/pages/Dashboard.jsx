
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BriefcaseBusiness,
  FileText,
  Bookmark,
  Target,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  GraduationCap,
  Clock,
  ChevronRight,
} from 'lucide-react';

import {
  getOpportunities,
  getMyApplications,
  submitApplication,
  getSavedJobs,
  saveJob,
  unsaveJob,
} from '../services/api';

import EligibilityChecker from './EligibilityChecker';
import './Dashboard.css';

const tasks = [
  {
    title: 'Complete your career profile',
    detail: 'Add your education and skills',
    done: true,
  },
  {
    title: 'Update your resume',
    detail: 'Keep your latest resume ready',
    done: false,
  },
  {
    title: 'Practice coding questions',
    detail: 'Work on your problem-solving skills',
    done: false,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState('Overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Opportunities from MongoDB
  const [opportunities, setOpportunities] = useState([]);
  const [loadingOpportunities, setLoadingOpportunities] =
    useState(true);
  const [opportunityError, setOpportunityError] = useState('');

  // Applications from MongoDB
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] =
    useState(true);
  const [applicationError, setApplicationError] = useState('');
  const [applyingId, setApplyingId] = useState('');

  // Saved jobs are stored in MongoDB for the logged-in student
  const [savedJobs, setSavedJobs] = useState([]);
  const [loadingSavedJobs, setLoadingSavedJobs] = useState(true);
  const [savedJobsError, setSavedJobsError] = useState('');
  const [savingJobId, setSavingJobId] = useState('');

  // IDs of opportunities already applied to in MongoDB
  const appliedJobs = applications
    .map((application) => {
      const opportunity = application.opportunity;

      return typeof opportunity === 'string'
        ? opportunity
        : opportunity?._id;
    })
    .filter(Boolean);

  // Fetch opportunities
  useEffect(() => {
    let active = true;

    async function loadOpportunities() {
      try {
        setLoadingOpportunities(true);
        setOpportunityError('');

        const data = await getOpportunities();

        if (active) {
          setOpportunities(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (active) {
          setOpportunityError(
            error.message || 'Unable to load opportunities.'
          );
        }
      } finally {
        if (active) {
          setLoadingOpportunities(false);
        }
      }
    }

    loadOpportunities();

    return () => {
      active = false;
    };
  }, []);

  // Fetch applications belonging to the logged-in student
  useEffect(() => {
    let active = true;

    async function loadApplications() {
      try {
        setLoadingApplications(true);
        setApplicationError('');

        const data = await getMyApplications();

        if (active) {
          setApplications(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (active) {
          setApplicationError(
            error.message || 'Unable to load your applications.'
          );
        }
      } finally {
        if (active) {
          setLoadingApplications(false);
        }
      }
    }

    loadApplications();

    return () => {
      active = false;
    };
  }, []);

  // Fetch saved jobs belonging to the logged-in student from MongoDB
  useEffect(() => {
    let active = true;

    async function loadSavedJobs() {
      try {
        setLoadingSavedJobs(true);
        setSavedJobsError('');

        const data = await getSavedJobs();
        const ids = Array.isArray(data)
          ? data
              .map((item) => {
                const opportunity = item.opportunity;
                return typeof opportunity === 'string'
                  ? opportunity
                  : opportunity?._id;
              })
              .filter(Boolean)
          : [];

        if (active) setSavedJobs(ids);
      } catch (error) {
        if (active) {
          setSavedJobsError(error.message || 'Unable to load saved jobs.');
        }
      } finally {
        if (active) setLoadingSavedJobs(false);
      }
    }

    loadSavedJobs();
    return () => {
      active = false;
    };
  }, []);

  // Search companies, job titles, branches and locations
  const filteredOpportunities = opportunities.filter((job) => {
    const searchableText = [
      job.companyName,
      job.jobTitle,
      job.description,
      job.location,
      job.jobType,
      ...(job.eligibleBranches || []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchableText.includes(search.toLowerCase());
  });

  const navigation = [
    { label: 'Overview', icon: LayoutDashboard },
    { label: 'Opportunities', icon: BriefcaseBusiness },
    { label: 'Eligibility Checker', icon: Target },
    { label: 'Applications', icon: FileText },
    { label: 'Saved jobs', icon: Bookmark },
    { label: 'Skill readiness', icon: Code2 },
    { label: 'Settings', icon: Settings },
  ];

  function handleNavigation(label) {
    setActivePage(label);
    setMenuOpen(false);

    if (label === 'Settings') {
      navigate('/profile');
      return;
    }

    const sectionIds = {
      Overview: 'dashboard-overview',
      Opportunities: 'opportunities',
      'Eligibility Checker': 'eligibility-checker',
      Applications: 'applications',
      'Saved jobs': 'opportunities',
      'Skill readiness': 'skill-readiness',
    };

    const sectionId = sectionIds[label];

    if (sectionId) {
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 0);
    }
  }

  // Save or remove a job through the authenticated backend API
  async function toggleSaved(opportunityId) {
    if (savingJobId) return;

    const isSaved = savedJobs.includes(opportunityId);
    setSavingJobId(opportunityId);
    setSavedJobsError('');

    try {
      if (isSaved) {
        await unsaveJob(opportunityId);
        setSavedJobs((current) =>
          current.filter((id) => id !== opportunityId)
        );
      } else {
        await saveJob(opportunityId);
        setSavedJobs((current) =>
          current.includes(opportunityId)
            ? current
            : [...current, opportunityId]
        );
      }
    } catch (error) {
      setSavedJobsError(error.message || 'Unable to update saved jobs.');
    } finally {
      setSavingJobId('');
    }
  }

  // Submit a real application and refresh the student's applications from the API.
  async function applyToJob(opportunityId) {
    if (applyingId) return;

    if (appliedJobs.includes(opportunityId)) {
      setApplicationError('You have already applied to this opportunity.');
      return;
    }

    setApplyingId(opportunityId);
    setApplicationError('');

    try {
      await submitApplication(opportunityId);
      const data = await getMyApplications();
      setApplications(Array.isArray(data) ? data : []);
      setApplicationError('');
    } catch (error) {
      setApplicationError(
        error.message || 'Unable to submit your application.'
      );

      // Refresh in case the application was created before an error was returned.
      try {
        const data = await getMyApplications();
        setApplications(Array.isArray(data) ? data : []);
      } catch {
        // Keep the original error visible.
      }
    } finally {
      setApplyingId('');
    }
  }

  const displayedJobs =
    activePage === 'Saved jobs'
      ? filteredOpportunities.filter((job) =>
          savedJobs.includes(job._id)
        )
      : activePage === 'Applications'
        ? filteredOpportunities.filter((job) =>
            appliedJobs.includes(job._id)
          )
        : filteredOpportunities;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside
        className={
          menuOpen
            ? 'dashboard-sidebar sidebar-open'
            : 'dashboard-sidebar'
        }
      >
        <button
          className="dashboard-brand"
          onClick={() => navigate('/')}
        >
          <span className="dashboard-brand-icon">CF</span>
          Career<span>Forge</span>
        </button>

        <p className="sidebar-caption">WORKSPACE</p>

        <nav className="dashboard-nav">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={
                activePage === label
                  ? 'dashboard-nav-item active'
                  : 'dashboard-nav-item'
              }
              onClick={() => handleNavigation(label)}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <GraduationCap size={22} />
            <strong>Your career, your pace.</strong>
            <p>Small steps build strong careers.</p>
          </div>

          <button
            className="dashboard-nav-item logout-button"
            onClick={() => {
              sessionStorage.removeItem('careerforge_token');
              sessionStorage.removeItem('careerforge_student');
              navigate('/login');
            }}
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>

      {menuOpen && (
        <button
          className="dashboard-overlay"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        />
      )}

      {/* Main dashboard */}
      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <button
            className="dashboard-mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

          <div className="dashboard-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search companies, roles, skills..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <button
            className="notification-button"
            aria-label="Notifications"
          >
            <Bell size={19} />
            <span />
          </button>

          <div className="dashboard-user">
            <div className="user-avatar">S</div>
            <div>
              <strong>Student</strong>
              <small>Career Explorer</small>
            </div>
          </div>
        </header>

        <div
          className="dashboard-content"
          id="dashboard-overview"
        >
          {/* Welcome */}
          <div className="dashboard-heading">
            <div>
              <p className="dashboard-date">
                YOUR CAREER WORKSPACE
              </p>
              <h1>Welcome back, Student! ✦</h1>
              <p>
                Take another step toward your career goals today.
              </p>
            </div>

            <button
              className="dashboard-primary-button"
              onClick={() => navigate('/profile')}
            >
              Complete profile <ArrowUpRight size={17} />
            </button>
          </div>

          {/* Career banner */}
          <section className="readiness-banner">
            <div className="readiness-copy">
              <span className="banner-label">
                YOUR CAREER JOURNEY
              </span>

              <h2>
                Your next opportunity starts with preparation.
              </h2>

              <p>
                Complete your profile and explore opportunities
                that fit your goals.
              </p>

              <button
                onClick={() => handleNavigation('Opportunities')}
              >
                Explore opportunities <ArrowRight size={17} />
              </button>
            </div>

            <div className="readiness-graphic">
              <div className="readiness-circle">
                <Target size={39} />
              </div>
              <span>Plan · Prepare · Progress</span>
            </div>
          </section>

          {/* Statistics */}
          <section className="dashboard-stats">
            <article className="dashboard-stat-card">
              <span className="dashboard-stat-icon purple-bg">
                <BriefcaseBusiness size={20} />
              </span>
              <p>Opportunities</p>
              <h3>{opportunities.length}</h3>
              <small>Available listings</small>
            </article>

            <article className="dashboard-stat-card">
              <span className="dashboard-stat-icon blue-bg">
                <FileText size={20} />
              </span>
              <p>Applications</p>
              <h3>{applications.length}</h3>
              <small>Saved in MongoDB</small>
            </article>

            <article className="dashboard-stat-card">
              <span className="dashboard-stat-icon green-bg">
                <Bookmark size={20} />
              </span>
              <p>Saved jobs</p>
              <h3>{savedJobs.length}</h3>
              <small>Saved in MongoDB</small>
            </article>

            <article className="dashboard-stat-card">
              <span className="dashboard-stat-icon orange-bg">
                <Target size={20} />
              </span>
              <p>Preparation tasks</p>
              <h3>{tasks.filter((task) => !task.done).length}</h3>
              <small>Tasks to work on</small>
            </article>
          </section>

          {/* Opportunities */}
          <section
            className="dashboard-section"
            id="opportunities"
          >
            <div className="dashboard-section-heading">
              <div>
                <h2>
                  {activePage === 'Saved jobs'
                    ? 'Saved opportunities'
                    : activePage === 'Applications'
                      ? 'Your applied opportunities'
                      : 'Explore opportunities'}
                </h2>
                <p>
                  Placement listings loaded from CareerForge.
                </p>
              </div>

              <button
                className="dashboard-text-button"
                onClick={() => handleNavigation('Opportunities')}
              >
                View all <ArrowRight size={16} />
              </button>
            </div>

            {savedJobsError && (
              <div className="dashboard-empty" role="alert">
                {savedJobsError}
              </div>
            )}

            {activePage === 'Saved jobs' && loadingSavedJobs ? (
              <div className="dashboard-empty">Loading saved jobs...</div>
            ) : loadingOpportunities ? (
              <div className="dashboard-empty">
                Loading opportunities...
              </div>
            ) : opportunityError ? (
              <div className="dashboard-empty">
                <p>{opportunityError}</p>
                <button
                  className="dashboard-text-button"
                  onClick={() => window.location.reload()}
                >
                  Try again
                </button>
              </div>
            ) : displayedJobs.length === 0 ? (
              <div className="dashboard-empty">
                {activePage === 'Saved jobs'
                  ? 'You have not saved any matching opportunities.'
                  : activePage === 'Applications'
                    ? 'You have not applied to any matching opportunities.'
                    : search
                      ? 'No matching opportunities. Try another search.'
                      : 'No opportunities found. Add one through your backend API.'}
              </div>
            ) : (
              <div className="opportunity-grid">
                {displayedJobs.map((job) => {
                  const isSaved = savedJobs.includes(job._id);
                  const isApplied = appliedJobs.includes(job._id);
                  const isApplying = applyingId === job._id;

                  return (
                    <article
                      className="opportunity-card"
                      key={job._id}
                    >
                      <div className="company-top">
                        <div className="company-logo">
                          {(job.companyName || 'C')
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <button
                          className={
                            isSaved
                              ? 'save-job saved'
                              : 'save-job'
                          }
                          onClick={() => toggleSaved(job._id)}
                          disabled={Boolean(savingJobId)}
                          aria-label={
                            isSaved
                              ? `Unsave ${job.jobTitle}`
                              : `Save ${job.jobTitle}`
                          }
                        >
                          <Bookmark
                            size={18}
                            fill={isSaved ? 'currentColor' : 'none'}
                          />
                        </button>
                      </div>

                      <span className="job-type">
                        {job.jobType || 'Full-time'}
                      </span>

                      <h3>{job.jobTitle}</h3>

                      <p className="company-name">
                        {job.companyName} ·{' '}
                        {job.location || 'Location not specified'}
                      </p>

                      {job.description && <p>{job.description}</p>}

                      <div className="job-skills">
                        {(job.eligibleBranches || []).map(
                          (branch) => (
                            <span key={branch}>{branch}</span>
                          )
                        )}
                      </div>

                      <p className="job-disclaimer">
                        Minimum CGPA: {job.minimumCGPA ?? 0}
                        {' · '}
                        Allowed backlogs: {job.allowedBacklogs ?? 0}
                      </p>

                      {job.graduationYear && (
                        <p className="job-disclaimer">
                          Graduation year: {job.graduationYear}
                        </p>
                      )}

                      <button
                        className="job-apply-button"
                        disabled={isApplied || Boolean(applyingId)}
                        onClick={() => applyToJob(job._id)}
                      >
                        {isApplying
                          ? 'Submitting...'
                          : isApplied
                            ? 'Applied'
                            : 'Apply Now'}

                        {!isApplied && !isApplying && (
                          <ArrowUpRight size={16} />
                        )}
                      </button>

                      {job.applicationLink && (
                        <a
                          href={job.applicationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open application website
                        </a>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* Eligibility Checker */}
          <EligibilityChecker />

          {/* Skill readiness and preparation tasks */}
          <section className="dashboard-bottom-grid">
            <article
              className="dashboard-panel"
              id="skill-readiness"
            >
              <div className="dashboard-section-heading">
                <div>
                  <h2>Skill readiness</h2>
                  <p>Example preparation checklist</p>
                </div>
                <Code2 size={21} />
              </div>

              <div className="skill-row">
                <div>
                  <span>JavaScript</span>
                  <strong>Getting started</strong>
                </div>
                <div className="skill-track">
                  <span style={{ width: '55%' }} />
                </div>
              </div>

              <div className="skill-row">
                <div>
                  <span>Problem solving</span>
                  <strong>Getting started</strong>
                </div>
                <div className="skill-track blue-track">
                  <span style={{ width: '40%' }} />
                </div>
              </div>

              <div className="skill-row">
                <div>
                  <span>Communication</span>
                  <strong>Getting started</strong>
                </div>
                <div className="skill-track green-track">
                  <span style={{ width: '65%' }} />
                </div>
              </div>

              <p className="sample-note">
                These are illustrative values, not an assessed
                readiness score.
              </p>
            </article>

            <article className="dashboard-panel">
              <div className="dashboard-section-heading">
                <div>
                  <h2>Preparation checklist</h2>
                  <p>Useful next steps for your career</p>
                </div>
                <Clock size={21} />
              </div>

              {tasks.map((task) => (
                <div
                  className="preparation-task"
                  key={task.title}
                >
                  <CheckCircle2
                    size={19}
                    className={task.done ? 'task-done' : ''}
                  />
                  <div>
                    <strong>{task.title}</strong>
                    <p>{task.detail}</p>
                  </div>
                  <ChevronRight size={17} />
                </div>
              ))}
            </article>
          </section>

          {/* Applications saved in MongoDB */}
          <section
            className="applications-anchor"
            id="applications"
          >
            <div id="saved-jobs" />

            <div className="dashboard-section-heading">
              <div>
                <h2>Your applications</h2>
                <p>
                  Applications belonging to your logged-in account.
                </p>
              </div>
              <FileText size={22} />
            </div>

            {applicationError && (
              <div className="dashboard-empty" role="alert">
                {applicationError}
              </div>
            )}

            {loadingApplications ? (
              <div className="dashboard-empty">
                Loading your applications...
              </div>
            ) : applications.length === 0 ? (
              <div className="dashboard-empty">
                You haven't submitted any applications yet.
              </div>
            ) : (
              <div className="my-applications-list">
                {applications.map((application) => {
                  const job =
                    typeof application.opportunity === 'object'
                      ? application.opportunity
                      : null;

                  return (
                    <article
                      className="preparation-task"
                      key={application._id}
                    >
                      <FileText size={20} />

                      <div>
                        <strong>
                          {job?.jobTitle || 'Opportunity unavailable'}
                        </strong>

                        <p>
                          {job?.companyName || 'Unknown company'}
                          {job?.location ? ` · ${job.location}` : ''}
                        </p>

                        <p>
                          Status: {application.status}
                        </p>

                        <p>
                          Applied on:{' '}
                          {application.appliedAt
                            ? new Date(
                                application.appliedAt
                              ).toLocaleDateString()
                            : 'Date unavailable'}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            <p>
              Saved jobs: {savedJobs.length} · Applications in MongoDB:{' '}
              {applications.length}
            </p>
          </section>

          <footer className="dashboard-footer">
            <span>
              © {new Date().getFullYear()} CareerForge
            </span>
            <span>Build Your Skills. Shape Your Future.</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
