import olSourceWMTS from 'ol/source/WMTS.js';
import olTilegridWMTS from 'ol/tilegrid/WMTS.js';

/**
 * Available resolutions as defined in
 * https://api3.geo.admin.ch/services/sdiservices.html#wmts.
 * @const {!Array<number>}
 */
export const RESOLUTIONS = [
  4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000,
  750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5, 0.25, 0.1,
];

/**
 * @type {string}
 */
const DEFAULT_BASE_URL = 'https://wmts{0-9}.geo.admin.ch';

/**
 * @type {string}
 */
const DEFAULT_ATTRIBUTIONS =
  '&copy; <a href="https://www.swisstopo.admin.ch">swisstopo</a>';

/**
 * The matrix set is constructed by passing the matrix set defined in the
 * table at https://api3.geo.admin.ch/services/sdiservices.html#wmts.
 * @param {number} level The zoomlevel
 * @return {!Array<string>} matrix set.
 */
export const createSwisstopoMatrixSet = function (level) {
  console.assert(level < RESOLUTIONS.length);
  const matrixSet = new Array(level);
  for (let i = 0; i <= level; ++i) {
    matrixSet[i] = String(i);
  }
  return matrixSet;
};

/**
 * Extents of Swiss projections.
 */
const extents = {
  ['EPSG:2056']: [2420000, 1030000, 2900000, 1350000],
  ['EPSG:21781']: [420000, 30000, 900000, 350000],
};

/**
 * Create a Configure tilematrix set 26 (maximum zoomlevel without interpolation).
 * See ch.swisstopo.pixelkarte-farbe from
 * https://wmts10.geo.admin.ch/EPSG/2056/1.0.0/WMTSCapabilities.xml
 * and notes in https://api3.geo.admin.ch/services/sdiservices.html#wmts.
 * @param {string} projection projection
 * @param {number} level The zoomlevel
 * @return {!import('ol/tilegrid/WMTS.js').default} tilegrid
 */
export function createTileGrid(projection, level) {
  return new olTilegridWMTS({
    extent: extents[projection],
    resolutions: RESOLUTIONS.slice(0, level + 1),
    matrixIds: createSwisstopoMatrixSet(level),
  });
}

/**
 * @param {string} baseUrl The base url
 * @param {string} projection The projection.
 * @param {string} format The format.
 * @return {string} the url.
 */
function createUrl(baseUrl, projection, format) {
  if (baseUrl.includes('{Layer}')) {
    return baseUrl;
  }
  let url = `${baseUrl}/1.0.0/{Layer}/default/{Time}`;
  if (projection === 'EPSG:2056') {
    url += `/2056/{TileMatrix}/{TileCol}/{TileRow}.${format}`;
  } else if (projection === 'EPSG:21781') {
    url += `/21781/{TileMatrix}/{TileRow}/{TileCol}.${format}`;
  } else {
    throw new Error(`Unsupported projection ${projection}`);
  }
  return url;
}

/**
 * @typedef {Object} Options
 * @property {string} [baseUrl='https://wmts{0-9}.geo.admin.ch'] WMTS server base url.
 * @property {string} [attributions='...'] Source attributions.
 * @property {string} layer Layer name.
 * @property {string} [format='image/png'] Image format.
 * @property {string} [timestamp='current'] Timestamp.
 * @property {string} projection Projection.
 * @property {number} [level] Max zoom level.
 * @property {string} [crossOrigin='anonymous'] Cross origin.
 */

/**
 * Layer source for the Swisstopo tile server.
 * WARNING: This tile server is not publicly available: you have to be
 *          registered by Swisstopo to use the service.
 * @see https://api3.geo.admin.ch/services/sdiservices.html#wmts
 */
export default class SwisstopoSource extends olSourceWMTS {
  /**
   * @param {Options} options WMTS options.
   */
  constructor(options) {
    const format = options.format || 'image/png';
    const projection = options.projection;
    console.assert(projection === 'EPSG:21781' || projection === 'EPSG:2056');
    const tilegrid = createTileGrid(projection, options.level || 27);
    const projectionCode = projection.split(':')[1];
    const extension = format.split('/')[1];
    console.assert(!!projectionCode);
    console.assert(!!extension);

    super({
      attributions: options.attributions || DEFAULT_ATTRIBUTIONS,
      url: createUrl(
        options.baseUrl || DEFAULT_BASE_URL,
        projection,
        extension
      ),
      dimensions: {
        'Time': options.timestamp || 'current',
      },
      projection: projection,
      requestEncoding: 'REST',
      layer: options.layer,
      style: 'default',
      matrixSet: projectionCode,
      format: format,
      tileGrid: tilegrid,
      crossOrigin: options.crossOrigin || 'anonymous',
    });

    /**
     * @const {string}
     * @private
     */
    this.projectionCode_ = projection;
  }

  getProjectionExtent() {
    return extents[this.projectionCode_];
  }
}
