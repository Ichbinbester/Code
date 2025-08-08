const map = L.map("map");
map.setView([0, 0], 15);

// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//   attribution: "© OpenStreetMap contributors",
// }).addTo(map);

// *******another tile provider*******
L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
  attribution: "© OpenStreetMap & CartoDB contributors",
}).addTo(map);

const marker = L.marker([0, 0]).addTo(map);
/*
function findLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        marker.setLatLng([userLat, userLng]);
        map.setView([userLat, userLng], 15);
      },
      (error) => {
        console.error(Geolocation error: ${error.message});
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}
*/
//*******call function on page load if supported by the browser*******
findLocation();
