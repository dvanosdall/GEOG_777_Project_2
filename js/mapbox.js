/**
 * Name: dvanosdall
 * Date: 2026-03-20
 * Class: GEOG777
 *
 * Description: Handles Mapbox integration for Eugene T. Mahoney State Park.
 * Initializes the map centered on the park; restricts panning/zooming
 * to park bounds; loads features as markers from API.
 * Also allows user submissions by right-clicking to add a point of interest.
 */

require('dotenv').config();
mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

// Park Center and Bounds (Eugene T. Mahoney State Park)
const parkCenter = [-96.3122, 41.0261]; // [lng, lat]
const parkBounds = [
    [-96.3200, 41.0200], // Southwest corner (approximate)
    [-96.3050, 41.0330]
];

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v12',
    center: parkCenter,
    zoom: 14,
    maxBounds: parkBounds
});

map.setMinZoom(10);
map.setMaxZoom(25);

// Load features from API and add markers
async function loadFeatures() {
    const res = await fetch('/api/features');
    const features = await res.json();
    features.forEach(f => {
        if (f.lat && f.lng) {
            new mapboxgl.Marker()
                .setLngLat([f.lng, f.lat])
                .addTo(map);
        }
    });
}

// On page load, load features
loadFeatures();

// Right-click handler for user submissions
map.on('contextmenu', function (e) {
    const lngLat = e.lngLat;
    const popup = new mapboxgl.Popup()
        .setLngLat([lngLat.lng, lngLat.lat])
        .setHTML(`
      <div>
  <h5 class="text-dark mb-3">Adding Point of Interest</h5>
  <form id="userSubmissionForm" style="min-width:220px">
    <div>
      <label>Feature Type:<br>
        <select name="feature_id" class="form-select form-select-sm" required style="width:95%">
  <option value="" selected disabled>-- No features defined yet --</option>
</select>
      </label>
    </div>
    <div>
      <label>Email:<br>
        <input type="email" name="email" required class="form-control" style="width:95%">
      </label>
    </div>
    <div>
      <label>Description:<br>
        <textarea name="content" rows="3" required class="form-control" style="width:95%"></textarea>
      </label>
    </div>
    <button type="submit" class="btn btn-primary btn-sm mt-2">Submit</button>
  </form>
  <div class="text-muted" style="font-size:11px;margin-top:5px;">
    Right-click anywhere to submit a point of interest.
  </div>
</div>
    `)
        .addTo(map);

    setTimeout(() => {
        const form = document.getElementById('userSubmissionForm');
        if (!form) return;
        form.onsubmit = function (ev) {
            ev.preventDefault();
            fetch('/api/user_submission', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // feature_id: null, // Optionally send null or leave out for now
                    email: form.email.value,
                    content: form.content.value,
                    lng: lngLat.lng,
                    lat: lngLat.lat
                })
            })
                .then(resp => resp.ok ? resp.json() : Promise.reject('Submission failed'))
                .then(data => {
                    popup.setHTML('<b class="text-success">Submission received! Thank you.</b>');
                })
                .catch(() => {
                    popup.setHTML('<b class="text-danger">Submission failed. Try again later.</b>');
                });
        };
    }, 0);
});