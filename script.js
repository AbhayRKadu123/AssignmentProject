// Initialize the map centered at the starting coordinates
const map = L.map('map').setView([22.1696, 91.4996], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

const startLatLng = [22.1696, 91.4996];
const endLatLng = [22.2637, 91.7159];
const speedKmph = 20;
const refreshRate = 2;

let currentLatLng = [...startLatLng];
let currentSpeed = 0;

// Custom marker icons
const startIcon = L.icon({
  iconUrl: 'start.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const endIcon = L.icon({
  iconUrl: 'end.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const vehicleIcon = L.icon({
  iconUrl: 'vehical.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Place markers on the map
L.marker(startLatLng, { icon: startIcon }).addTo(map);
L.marker(endLatLng, { icon: endIcon }).addTo(map);

const marker = L.marker(currentLatLng, { icon: vehicleIcon }).addTo(map);

// Function to calculate the distance between two coordinates
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Function to calculate the next position of the vehicle
function calculateNextPosition(current, target, step) {
  const [currentLat, currentLng] = current;
  const [targetLat, targetLng] = target;

  const distance = getDistance(currentLat, currentLng, targetLat, targetLng);
  if (distance < step) return target;

  const ratio = step / distance;
  const nextLat = currentLat + (targetLat - currentLat) * ratio;
  const nextLng = currentLng + (targetLng - currentLng) * ratio;

  return [nextLat, nextLng];
}

// Function to update position and speed display
function updateDisplay() {
  const positionText = `Lat: ${currentLatLng[0].toFixed(4)}, Lng: ${currentLatLng[1].toFixed(4)}`;
  document.getElementById('position').textContent = positionText;

  const speedText = `${currentSpeed.toFixed(2)} km/h`;
  document.getElementById('speed').textContent = speedText;
}

// Function to move the vehicle
function moveVehicle() {
  const stepDistance = (speedKmph * 1000) / (3600 / refreshRate);
  currentLatLng = calculateNextPosition(currentLatLng, endLatLng, stepDistance);
  marker.setLatLng(currentLatLng);
  map.panTo(currentLatLng);

  currentSpeed = speedKmph;
  updateDisplay();

  if (currentLatLng[0] === endLatLng[0] && currentLatLng[1] === endLatLng[1]) {
    clearInterval(animationInterval);
  }
}

// Update vehicle's position at the specified refresh rate
const animationInterval = setInterval(moveVehicle, 1000 / refreshRate);
