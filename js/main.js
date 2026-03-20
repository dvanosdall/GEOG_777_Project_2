/**
 * Name: dvanosdall
 * Date: 2026-03-20
 * Class: GEOG777
 *
 * Description: Provides UI logic for index.html, including navigation,
 * fetching and displaying feature/trail/facility lists, search/filter,
 * submission form handling, and interactive user feedback.
 */

// Load features and display in a list
async function loadFeatures() {
  const res = await fetch('/api/features');
  const features = await res.json();
  const list = document.getElementById('featuresList');
  list.innerHTML = '';
  features.forEach(f => {
    const li = document.createElement('li');
    li.textContent = f.name ? f.name : JSON.stringify(f);
    list.appendChild(li);
  });
}

// Sample: Form submission handler
document.getElementById('feedbackForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const content = document.getElementById('content').value;
  const location = document.getElementById('location').value;

  const res = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, content, location })
  });
  const result = await res.json();
  alert(result.message || 'Submission sent!');
});

// Sample: Navigation handler (to mapbox.html)
document.getElementById('mapLink')?.addEventListener('click', () => {
  window.location.href = 'mapbox.html';
});

// Call your functions on page load
window.onload = () => {
  loadFeatures();
  // loadTrails(), loadFacilities(), etc.
};