export const displayMap = (locations) => {
    mapboxgl.accessToken =
        "pk.eyJ1IjoibmF5ZWVtbmlzaGFhdCIsImEiOiJjbDFwYm10OGUwY21uM2ZtbTJxZDB1MmthIn0.DD9h17aGmeThhJCcmhicUA";

    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/nayeemnishaat/cl1qk9a5a00m915qs51gprjg9",
        scrollZoom: false
        // center: [-118.113491, 34.111745],
        // zoom: 5
        // interactive: false
        // Note: Learn more from mapbox gl-js api reference
    });

    // Remark: bounds is an object that defines the area that will be displayed on the map!
    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach((loc) => {
        // Key: Create Marker
        const el = document.createElement("div");
        el.className = "marker"; // Point: Will contain a background-image (pin).

        // Key: Add Marker
        new mapboxgl.Marker({
            element: el,
            anchor: "bottom" // Note: Bottom of the element (pin) will be located at the exact gps location.
        })
            .setLngLat(loc.coordinates)
            .addTo(map);

        // Key: App Popup
        new mapboxgl.Popup({
            offset: 30
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);

        // Key: Extend the map bounds to include  current location (cover/include the current location in the map bound area.)
        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
};
