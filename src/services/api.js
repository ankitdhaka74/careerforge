
const API_URL = 'https://careerforge-backend-silk.vercel.app/api';

// Common request for registration and login
async function request(endpoint, data) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Something went wrong');
  }

  return result;
}

// Register student
export function registerStudent(data) {
  return request('/auth/register', data);
}

// Login student
export function loginStudent(data) {
  return request('/auth/login', data);
}

// Fetch opportunities
export async function getOpportunities() {
  const response = await fetch(`${API_URL}/opportunities`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch opportunities');
  }

  return result;
}

// Check eligibility
export async function checkEligibility(opportunityId, student) {
  const response = await fetch(
    `${API_URL}/opportunities/${opportunityId}/check-eligibility`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Eligibility check failed');
  }

  return result;
}

// Common request for authenticated routes
async function authenticatedRequest(endpoint, options = {}) {
  const token = sessionStorage.getItem('careerforge_token');

  if (!token) {
    throw new Error('Please log in first.');
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || 'Request failed. Please try again.'
    );
  }

  return result;
}

// APPLICATION TRACKING

// Get applications for logged-in student
export async function getMyApplications() {
  return authenticatedRequest('/applications');
}

// Apply for an opportunity
export async function submitApplication(opportunityId) {
  return authenticatedRequest('/applications', {
    method: 'POST',
    body: JSON.stringify({ opportunityId }),
  });
}

// SAVED JOBS

// Get saved jobs
export async function getSavedJobs() {
  return authenticatedRequest('/saved-jobs');
}

// Save a job
export async function saveJob(opportunityId) {
  return authenticatedRequest('/saved-jobs', {
    method: 'POST',
    body: JSON.stringify({ opportunityId }),
  });
}

// Remove a saved job
export async function removeSavedJob(opportunityId) {
  return authenticatedRequest(`/saved-jobs/${opportunityId}`, {
    method: 'DELETE',
  });
}

// Alias in case another component uses unsaveJob
export async function unsaveJob(opportunityId) {
  return removeSavedJob(opportunityId);
}
