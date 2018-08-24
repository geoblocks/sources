import OLMap from 'ol/Map.js';

import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import SwisstopoSource from './Swisstopo.js';
import EPSG_2056 from './EPSG2056.js';

const RESOLUTIONS = [650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1];

const swisstopoPixelkarteFarbe = new SwisstopoSource({
  layer: 'ch.swisstopo.pixelkarte-farbe',
  format: 'image/jpeg',
  timestamp: 'current',
  projection: EPSG_2056,
  crossOrigin: 'anonymous'
});

const layers = [
  new TileLayer({source: swisstopoPixelkarteFarbe}),
];

const extent = swisstopoPixelkarteFarbe.getProjectionExtent();
const view = new View({
  projection: EPSG_2056,
  resolutions: RESOLUTIONS,
  extent,
});

window['map'] = new OLMap({
  controls: [],
  target: 'mymap',
  layers,
  view
});

view.fit(extent);

