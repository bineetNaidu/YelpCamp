mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: campGeocode,
  zoom: 9,
});

new mapboxgl.Marker().setLngLat(campGeocode).addTo(map);
