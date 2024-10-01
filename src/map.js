// src/map.js
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Style.css'; // Make sure this path is correct

mapboxgl.accessToken = 'pk.eyJ1IjoiZGV4dGVyamV4ZXIiLCJhIjoiY20wM3RoZG5qMDFtbTJrczQzMWFhcm1lYiJ9.vNgB0RiYLN948NHdFAqibA';

const MapComponent = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [10.966254085330025, 33.386117712477734],
      zoom: 10,
      minZoom: 1,
      maxZoom: 20
    });

    map.on("load", function() {
      map.addLayer({
        id: "wmts-test-layer",
        type: "raster",
        source: {
          type: "raster",
          tiles: [
            "https://services.sentinel-hub.com/ogc/wmts/b67077bf-6712-4e18-a8e0-a413cdc14576?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=NATURAL-COLOR&STYLE=default&FORMAT=image/jpeg&TILEMATRIXSET=PopularWebMercator256&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}"
          ],
          tileSize: 256,
          attribution: 'Map tiles by <a target="_top" rel="noopener" href="https://www.swisstopo.admin.ch">swisstopo</a>'
        },
        paint: {}
      });
      map.setPaintProperty("wmts-test-layer", 'raster-opacity', 0.9);
    });

    map.on('load', () => {
      map.addSource('mask', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/nextav/mapbox/main/mask.geojson' // Ensure this URL points to the raw GeoJSON file
      });

      map.addLayer({
        id: 'mask',
        type: 'fill',
        source: 'mask',
        paint: {
          'fill-color': '#3bb3c3',
          'fill-opacity': 0.8
        }
      });

      // Function to update the slider max value and map data
      function updateSliderAndMap(data) {
        const dates = [...new Set(data.features.map(feature => feature.properties.date))].sort();

        // Set slider max value based on number of unique dates
        document.getElementById('slider').max = dates.length - 1;

        // Function to filter features by date
        function filterByDate(date) {
          return data.features.filter(feature => feature.properties.date === date);
        }

        // Function to update the map with filtered data
        function updateMap(date) {
          const filteredData = {
            type: 'FeatureCollection',
            features: filterByDate(date)
          };
          map.getSource('mask').setData(filteredData);
        }

        // Initial map update
        updateMap(dates[0]);

        // Slider event listener
        document.getElementById('slider').addEventListener('input', function(e) {
          const index = parseInt(e.target.value);
          const date = dates[index];
          document.getElementById('active-date').textContent = date;
          updateMap(date);
        });
      }

      // Fetch the GeoJSON data and update the slider and map
      fetch('https://raw.githubusercontent.com/nextav/mapbox/main/mask.geojson')
        .then(response => response.json())
        .then(data => updateSliderAndMap(data));

      // Example function to update data periodically
      function fetchDataAndUpdate() {
        fetch('https://raw.githubusercontent.com/nextav/mapbox/main/mask.geojson')
          .then(response => response.json())
          .then(data => updateSliderAndMap(data));
      }

      // Set interval to fetch and update data every period (e.g., every hour)
      setInterval(fetchDataAndUpdate, 3600000); // 3600000 ms = 1 hour

      // Make legend interactive to hide or show layers
      const layers = {
        'mask': map.getLayer('mask'),
      };

      document.getElementById('mask-checkbox').addEventListener('change', function() {
        toggleLayer('mask', this.checked);
      });

      function toggleLayer(layerId, isVisible) {
        const layer = layers[layerId];
        if (layer) {
          map.setLayoutProperty(layerId, 'visibility', isVisible ? 'visible' : 'none');
        }
      }

      // Initialize the layers visibility based on the checkbox state
      document.querySelectorAll('.legend input[type="checkbox"]').forEach(checkbox => {
        toggleLayer(checkbox.id, checkbox.checked);
      });
    });

    map.scrollZoom.enable();
    map.boxZoom.enable();
    map.doubleClickZoom.enable();
    map.touchZoomRotate.enable();

    return () => map.remove();
  }, []);

  return (
    <div>
      <div id="map" ref={mapContainer} style={{ width: '100%', height: '100%' }}></div>
      <div id="console">
        <img src="https://raw.githubusercontent.com/nextav/mapbox/main/logo%20v.png" alt="MareAlb Logo" width="50" height="50" />
        <h1>Project : MareAlb</h1>
        <div className="legend">
          <h2>Legend</h2>
          <div><input type="checkbox" id="mask-checkbox" defaultChecked /><span className="salt-lake"></span> Salt Lake</div>
        </div>
        <div className="session" id="sliderbar">
          <h2>Date: <label id="active-date">2022-01-01</label></h2>
          <input
            id="slider"
            className="row"
            type="range"
            min="0"
            step="1"
            defaultValue="0"
          />
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
