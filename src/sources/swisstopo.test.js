import SwisstopoSource from './Swisstopo.js';
import EPSG21781 from './EPSG21781.js'
import EPSG2056 from './EPSG2056.js';
import SourceWMTS from 'ol/source/WMTS.js';


describe('Swisstopo layer', () => {
  it('should create a EPSG21781 source', () => {
    const layer = 'toto';
    const source = new SwisstopoSource({
      format: 'image/jpeg',
      projection: EPSG21781,
      layer
    });

    expect(source).to.be.a(SourceWMTS);
    expect(source.getLayer()).to.be(layer);
  });

  it('should create a EPSG2056 source', () => {
    const layer = 'toto';
    const source = new SwisstopoSource({
      format: 'image/png',
      projection: EPSG2056,
      layer
    });

    expect(source).to.be.a(SourceWMTS);
    expect(source.getLayer()).to.be(layer);
  });

  it('should fail when creating a source for unhandled projection', () => {
    expect(() => {
      new SwisstopoSource({
        format: 'image/png',
        projection: 'EPSG:4269', // NAD83, North America
        layer: 'toto'
      });
    }).to.throwException(); // Beware that console.assert does not throw (the exception comes from OpenLayers)!
  });

  // We could check the extent, ...
});
