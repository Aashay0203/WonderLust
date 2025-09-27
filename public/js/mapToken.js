try {
    mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: coordinates,
        zoom: 9
    });

    const marker = new mapboxgl.Marker({ color: "red" })
        .setLngLat(coordinates)
        .setPopup(
            new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<h4>${listing.location}</h4><p>Exact Location will be provided after booking</p>`)
        )
        .addTo(map);
} catch (err) {
    console.error("Error initializing map:", err);
    document.getElementById("map").innerHTML = "Error loading map. Please try again later.";
} Token = mapToken;

const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: coordinates,
    zoom: 9
});

const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`)
    )
    .addTo(map);

