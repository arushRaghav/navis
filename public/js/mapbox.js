/* eslint-disable */
export const displayMap = (locations) => {
    mapboxgl.accessToken =
        'pk.eyJ1IjoiYXJ1c2hyYWdoYXYiLCJhIjoiY20zNTVpaGdhMDFqdjJrcXBlbmR5Z2cwbSJ9.MSF107w3Of2YFKwI5bWZNA';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
    });

    locations.forEach((loc) => {
        const el = document.createElement('div');
        el.className = 'marker';

        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom',
        })
            .setLngLat(loc.coordinates)
            .addTo(map);
    });
};
