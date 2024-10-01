### Detailed README

This document provides an overview of the source code for the MareAlb Project

## Table of Contents

- App.js
- map.js

## App.js

The `App.js` file is the main entry point of the React application. It sets up the basic structure and includes the `MapComponent`.

## Code Explanation

- **Imports**: The necessary React components and CSS files are imported.
- **App Component**: The main component that renders the header and the `MapComponent`.

## map.js

The map.js file contains the MapComponent which integrates Mapbox GL to display the map and handle various map-related functionalities.

### Code Explanation

- **Imports**: The necessary React hooks, Mapbox GL, and CSS files are imported.
- **Map Initialization**: Initializes the Mapbox map with specific settings like container, style, center, zoom, and access token.
- **Layer Addition**: Adds a raster layer and a GeoJSON layer to the map once it loads.
- **Slider and Map Update**: Functions to update the map based on the date selected from a slider.
- **Legend Interaction**: Makes the legend interactive, allowing users to toggle the visibility of layers.
- **Event Listeners**: Adds event listeners for user interactions like changing the slider value and toggling layer visibility.
- **Map Cleanup**: Ensures the map is properly removed when the component unmounts.
