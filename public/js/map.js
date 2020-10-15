mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v10',
  center: campGeocode.geometry.coordinates,
  zoom: 9,
});

new mapboxgl.Marker()
  .setLngLat(campGeocode.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${campGeocode.title}</h3><p>${campGeocode.location}</p>`
    )
  )
  .addTo(map);
