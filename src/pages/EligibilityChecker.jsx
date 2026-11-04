
import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, LoaderCircle, Target } from 'lucide-react';
import { getOpportunities, checkEligibility } from '../services/api';
import './EligibilityChecker.css';

export default function EligibilityChecker() {
  const [opportunities, setOpportunities] = useState([]);
  const [opportunityId, setOpportunityId] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [cgpa, setCgpa] = useState('');
  const [backlogs, setBacklogs] = useState('0');
  const [graduationYear, setGraduationYear] = useState('2027');

  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const data = await getOpportunities();

        if (active) {
          setOpportunities(data);

          if (data.length > 0) {
            setOpportunityId(data[0]._id);
          }
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Could not load opportunities.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setResult(null);

    if (!opportunityId) {
      setError('Please select a placement opportunity.');
      return;
    }

    if (
      cgpa.trim() === '' ||
      !Number.isFinite(Number(cgpa)) ||
      Number(cgpa) < 0 ||
      Number(cgpa) > 10
    ) {
      setError('Enter a CGPA between 0 and 10.');
      return;
    }

    if (
      backlogs.trim() === '' ||
      !Number.isInteger(Number(backlogs)) ||
      Number(backlogs) < 0
    ) {
      setError('Backlogs must be a whole number of 0 or more.');
      return;
    }

    if (
      graduationYear.trim() === '' ||
      !Number.isInteger(Number(graduationYear)) ||
      Number(graduationYear) < 1900
    ) {
      setError('Enter a valid graduation year.');
      return;
    }

    try {
      setChecking(true);

      const data = await checkEligibility(opportunityId, {
        branch,
        cgpa: Number(cgpa),
        backlogs: Number(backlogs),
        graduationYear: Number(graduationYear),
      });

      setResult(data);
    } catch (err) {
      setError(err.message || 'Could not check eligibility.');
    } finally {
      setChecking(false);
    }
  }

  return (
    <section className="eligibility-section" id="eligibility-checker">
      <div className="eligibility-heading">
        <span className="eligibility-icon">
          <Target size={23} />
        </span>

        <div>
          <h2>Eligibility Checker</h2>
          <p>
            Check your profile against a placement's actual requirements.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="eligibility-message">
          Loading placement opportunities...
        </p>
      ) : opportunities.length === 0 ? (
        <p className="eligibility-message">
          No opportunities are available yet. Add a placement first.
        </p>
      ) : (
        <form className="eligibility-form" onSubmit={handleSubmit}>
          <div className="eligibility-field full-width">
            <label htmlFor="eligibility-opportunity">
              Placement opportunity
            </label>

            <select
              id="eligibility-opportunity"
              value={opportunityId}
              onChange={(event) => {
                setOpportunityId(event.target.value);
                setResult(null);
              }}
              required
            >
              {opportunities.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.companyName} — {job.jobTitle}
                </option>
              ))}
            </select>

            {opportunities.find((job) => job._id === opportunityId) && (
              <small>
                Requirements:{' '}
                {opportunities.find((job) => job._id === opportunityId)
                  .eligibleBranches?.join(', ') || 'Any branch specified'}{' '}
                · Minimum CGPA:{' '}
                {opportunities.find((job) => job._id === opportunityId)
                  .minimumCGPA ?? 0}
                {' · '}Allowed backlogs:{' '}
                {opportunities.find((job) => job._id === opportunityId)
                  .allowedBacklogs ?? 0}
              </small>
            )}
          </div>

          <div className="eligibility-field">
            <label htmlFor="eligibility-branch">Branch</label>
            <select
              id="eligibility-branch"
              value={branch}
              onChange={(event) => {
                setBranch(event.target.value);
                setResult(null);
              }}
              required
            >
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="eligibility-field">
            <label htmlFor="eligibility-cgpa">CGPA (0–10)</label>
            <input
              id="eligibility-cgpa"
              type="number"
              min="0"
              max="10"
              step="0.01"
              placeholder="e.g. 8.2"
              value={cgpa}
              onChange={(event) => {
                setCgpa(event.target.value);
                setResult(null);
              }}
              required
            />
          </div>

          <div className="eligibility-field">
            <label htmlFor="eligibility-backlogs">Active backlogs</label>
            <input
              id="eligibility-backlogs"
              type="number"
              min="0"
              step="1"
              value={backlogs}
              onChange={(event) => {
                setBacklogs(event.target.value);
                setResult(null);
              }}
              required
            />
          </div>

          <div className="eligibility-field">
            <label htmlFor="eligibility-year">Graduation year</label>
            <input
              id="eligibility-year"
              type="number"
              min="1900"
              step="1"
              value={graduationYear}
              onChange={(event) => {
                setGraduationYear(event.target.value);
                setResult(null);
              }}
              required
            />
          </div>

          {error && (
            <p className="eligibility-error full-width" role="alert">
              {error}
            </p>
          )}

          <button
            className="eligibility-submit full-width"
            type="submit"
            disabled={checking}
          >
            {checking ? (
              <>
                <LoaderCircle size={18} className="eligibility-spinner" />
                Checking...
              </>
            ) : (
              'Check my eligibility'
            )}
          </button>
        </form>
      )}

      {result && (
        <div
          className={
            result.eligible
              ? 'eligibility-result eligible'
              : 'eligibility-result not-eligible'
          }
          role="status"
        >
          <div className="eligibility-result-title">
            {result.eligible ? (
              <CheckCircle2 size={23} />
            ) : (
              <XCircle size={23} />
            )}

            <div>
              <h3>
                {result.eligible
                  ? "You're eligible!"
                  : 'Not eligible yet'}
              </h3>
              <p>
                {result.companyName} — {result.jobTitle}
              </p>
            </div>
          </div>

          {result.eligible ? (
            <p>
              Your entered details meet the eligibility criteria stored
              for this opportunity. Check the employer's official
              requirements before applying.
            </p>
          ) : (
            <>
              <strong>Requirements not met:</strong>
              <ul>
                {result.reasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </section>
  );
}
