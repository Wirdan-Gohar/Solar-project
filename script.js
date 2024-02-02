// $(document).ready(function () {
//     $('#panel-capacity').on('input change', function () {
//         $('#panel-capacity-value').text($(this).val() + ' Watts');
//     });

//     // Add more interactivity as needed
// });
let googleMapsApiKey = 'AIzaSyDMPvp62rcoIitOkkSlfIAxZzDUgL6dR84';
let map;
let geometryLibrary;
let mapsLibrary;
let placesLibrary;
let geoLocation;

document.addEventListener('DOMContentLoaded', async function () {
  const defaultPlace = {
    name: 'Rinconada Library',
    address: '1213 Newell Rd, Palo Alto, CA 94303'
  };
  const zoom = 19;
  const loader = new google.maps.plugins.loader.Loader({
    apiKey: googleMapsApiKey
  });
  const libraries = {
    geometry: loader.importLibrary('geometry'),
    maps: loader.importLibrary('maps'),
    places: loader.importLibrary('places')
  };
  geometryLibrary = await libraries.geometry;
  mapsLibrary = await libraries.maps;
  placesLibrary = await libraries.places;

  // Get the address information for the default location.
  const geocoder = new google.maps.Geocoder();
  const geocoderResponse = await geocoder.geocode({
    address: defaultPlace.address
  });
  const geocoderResult = geocoderResponse.results[0];
  // Initialize the map at the desired location.
  geoLocation = geocoderResult.geometry.location;
  map = new mapsLibrary.Map(document.getElementById('map'), {
    center: geoLocation,
    zoom: zoom,
    tilt: 0,
    mapTypeId: 'satellite',
    mapTypeControl: false,
    fullscreenControl: false,
    rotateControl: false,
    streetViewControl: false,
    zoomControl: false
  });
  onSearchChange();
});

function onSearchChange() {
  let initialValue = geoLocation;

  const searchBarElement = document.querySelector('#search-input');

  // Await for the component's update completion
  // Find the input element inside the text field component
  const inputElement = document.querySelector('#search-input');

  // Initialize the autocomplete instance
  const autocomplete = new placesLibrary.Autocomplete(inputElement, {
    fields: ['formatted_address', 'geometry', 'name']
  });

  // Add listener for place_changed event
  autocomplete.addListener('place_changed', async () => {
    const place = autocomplete.getPlace();

    // Check if place geometry or location is not available
    if (!place.geometry || !place.geometry.location) {
      searchBarElement.value = '';
      return;
    }

    // Adjust map center and zoom level based on place geometry
    if (place.geometry.viewport) {
      map.setCenter(place.geometry.location);
      map.setZoom(19);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(19);
    }

    // Update location value
    geoLocation = place.geometry.location;

    // Update text field value with place name or formatted address
    if (place.name) {
      searchBarElement.value = place.name;
    } else if (place.formatted_address) {
      searchBarElement.value = place.formatted_address;
    }
  });
}

// colors.js
const binaryPalette = ['212121', 'B3E5FC'];
const rainbowPalette = ['3949AB', '81D4FA', '66BB6A', 'FFE082', 'E53935'];
const ironPalette = ['00000A', '91009C', 'E64616', 'FEB400', 'FFFFF6'];
const sunlightPalette = ['212121', 'FFCA28'];
const panelsPalette = ['E8EAF6', '1A237E'];

// utils.js (Partial, as some functions require external dependencies or are complex to include directly, e.g., `fetch`)
function showNumber(x) {
  return x.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

function showMoney(amount) {
  return `$${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

function findSolarConfig(
  solarPanelConfigs,
  yearlyKwhEnergyConsumption,
  panelCapacityRatio,
  dcToAcDerate
) {
  return solarPanelConfigs.findIndex(
    config =>
      config.yearlyEnergyDcKwh * panelCapacityRatio * dcToAcDerate >=
      yearlyKwhEnergyConsumption
  );
}

// visualize.js
function colorToRGB(color) {
  const hex = color.startsWith('#') ? color.slice(1) : color;
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16)
  };
}

function createPalette(hexColors) {
  const rgb = hexColors.map(colorToRGB);
  const size = 256;
  const step = (rgb.length - 1) / (size - 1);
  return Array(size)
    .fill(0)
    .map((_, i) => {
      const index = i * step;
      const lower = Math.floor(index);
      const upper = Math.ceil(index);
      return {
        r: lerp(rgb[lower].r, rgb[upper].r, index - lower),
        g: lerp(rgb[lower].g, rgb[upper].g, index - lower),
        b: lerp(rgb[lower].b, rgb[upper].b, index - lower)
      };
    });
}

function lerp(x, y, t) {
  return x + t * (y - x);
}

function clamp(x, min, max) {
  return Math.min(Math.max(x, min), max);
}

function normalize(x, max = 1, min = 0) {
  const y = (x - min) / (max - min);
  return clamp(y, 0, 1);
}

function renderPalette({ data, mask, colors, min, max, index }) {
  const palette = createPalette(colors ?? ['000000', 'ffffff']);
  const indices = data.rasters[index ?? 0]
    .map(x => normalize(x, max ?? 1, min ?? 0))
    .map(x => Math.round(x * (palette.length - 1)));
  return renderRGB(
    {
      ...data,
      rasters: [
        indices.map(i => palette[i].r),
        indices.map(i => palette[i].g),
        indices.map(i => palette[i].b)
      ]
    },
    mask
  );
}

function renderRGB(rgb, mask) {
  const canvas = document.createElement('canvas');
  canvas.width = mask ? mask.width : rgb.width;
  canvas.height = mask ? mask.height : rgb.height;
  const dw = rgb.width / canvas.width;
  const dh = rgb.height / canvas.height;
  const ctx = canvas.getContext('2d');
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const rgbIdx = Math.floor(y * dh) * rgb.width + Math.floor(x * dw);
      const maskIdx = y * canvas.width + x;
      const imgIdx = y * canvas.width * 4 + x * 4;
      img.data[imgIdx + 0] = rgb.rasters[0][rgbIdx];
      img.data[imgIdx + 1] = rgb.rasters[1][rgbIdx];
      img.data[imgIdx + 2] = rgb.rasters[2][rgbIdx];
      img.data[imgIdx + 3] = mask ? mask.rasters[0][maskIdx] * 255 : 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

// Solar API

async function findClosestBuilding(location) {
  const args = {
    'location.latitude': location.lat().toFixed(5),
    'location.longitude': location.lng().toFixed(5)
  };
  console.log('GET buildingInsights\n', args);
  const params = new URLSearchParams({ ...args, key: googleMapsApiKey });
  return fetch(
    `https://solar.googleapis.com/v1/buildingInsights:findClosest?${params}`
  ).then(async response => {
    const content = await response.json();
    if (response.status != 200) {
      console.error('findClosestBuilding\n', content);
      throw content;
    }
    console.log('buildingInsightsResponse', content);
    return content;
  });
}

async function getDataLayerUrls(location, radiusMeters) {
  const args = {
    'location.latitude': location.latitude.toFixed(5),
    'location.longitude': location.longitude.toFixed(5),
    radius_meters: radiusMeters.toString()
  };
  console.log('GET dataLayers\n', args);
  const params = new URLSearchParams({ ...args, key: googleMapsApiKey });
  return fetch(`https://solar.googleapis.com/v1/dataLayers:get?${params}`).then(
    async response => {
      const content = await response.json();
      if (response.status != 200) {
        console.error('getDataLayerUrls\n', content);
        throw content;
      }
      console.log('dataLayersResponse', content);
      return content;
    }
  );
}

async function downloadGeoTIFF(url) {
  console.log(`Downloading data layer: ${url}`);
  const solarUrl = url.includes('solar.googleapis.com')
    ? url + `&key=${googleMapsApiKey}`
    : url;
  const response = await fetch(solarUrl);
  if (response.status != 200) {
    const error = await response.json();
    console.error(`downloadGeoTIFF failed: ${url}\n`, error);
    throw error;
  }
  const arrayBuffer = await response.arrayBuffer();
  const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
  const image = await tiff.getImage();
  const rasters = await image.readRasters();
  const geoKeys = image.getGeoKeys();
  const projObj = geokeysToProj4.toProj4(geoKeys);
  const projection = proj4(projObj.proj4, 'WGS84');
  const box = image.getBoundingBox();
  const sw = projection.forward({
    x: box[0] * projObj.coordinatesConversionParameters.x,
    y: box[1] * projObj.coordinatesConversionParameters.y
  });
  const ne = projection.forward({
    x: box[2] * projObj.coordinatesConversionParameters.x,
    y: box[3] * projObj.coordinatesConversionParameters.y
  });
  return {
    width: rasters.width,
    height: rasters.height,
    rasters: [...Array(rasters.length).keys()].map(i => Array.from(rasters[i])),
    bounds: {
      north: ne.y,
      south: sw.y,
      east: ne.x,
      west: sw.x
    }
  };
}

function showLatLng(point) {
  return `(${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)})`;
}

function showDate(date) {
  return `${date.month}/${date.day}/${date.year}`;
}

// Layer module
// External module dependencies
// Import statements for external modules using CDN
// Include the necessary external module scripts in your HTML file as mentioned in the previous responses

// Layer module
async function getLayer(layerId, urls) {
  const get = {
    mask: async () => {
      const mask = await downloadGeoTIFF(urls.maskUrl);
      const colors = binaryPalette;
      return {
        id: layerId,
        bounds: mask.bounds,
        palette: {
          colors: colors,
          min: 'No roof',
          max: 'Roof'
        },
        render: showRoofOnly => [
          renderPalette({
            data: mask,
            mask: showRoofOnly ? mask : undefined,
            colors: colors
          })
        ]
      };
    },
    dsm: async () => {
      const [mask, data] = await Promise.all([
        downloadGeoTIFF(urls.maskUrl),
        downloadGeoTIFF(urls.dsmUrl)
      ]);
      const sortedValues = Array.from(data.rasters[0]).sort((x, y) => x - y);
      const minValue = sortedValues[0];
      const maxValue = sortedValues.slice(-1)[0];
      const colors = rainbowPalette;
      return {
        id: layerId,
        bounds: mask.bounds,
        palette: {
          colors: colors,
          min: `${minValue.toFixed(1)} m`,
          max: `${maxValue.toFixed(1)} m`
        },
        render: showRoofOnly => [
          renderPalette({
            data: data,
            mask: showRoofOnly ? mask : undefined,
            colors: colors,
            min: sortedValues[0],
            max: sortedValues.slice(-1)[0]
          })
        ]
      };
    },
    rgb: async () => {
      const [mask, data] = await Promise.all([
        downloadGeoTIFF(urls.maskUrl),
        downloadGeoTIFF(urls.rgbUrl)
      ]);
      return {
        id: layerId,
        bounds: mask.bounds,
        render: showRoofOnly => [
          renderRGB(data, showRoofOnly ? mask : undefined)
        ]
      };
    },
    annualFlux: async () => {
      const [mask, data] = await Promise.all([
        downloadGeoTIFF(urls.maskUrl),
        downloadGeoTIFF(urls.annualFluxUrl)
      ]);
      const colors = ironPalette;
      return {
        id: layerId,
        bounds: mask.bounds,
        palette: {
          colors: colors,
          min: 'Shady',
          max: 'Sunny'
        },
        render: showRoofOnly => [
          renderPalette({
            data: data,
            mask: showRoofOnly ? mask : undefined,
            colors: colors,
            min: 0,
            max: 1800
          })
        ]
      };
    },
    monthlyFlux: async () => {
      const [mask, data] = await Promise.all([
        downloadGeoTIFF(urls.maskUrl),
        downloadGeoTIFF(urls.monthlyFluxUrl)
      ]);
      const colors = ironPalette;
      return {
        id: layerId,
        bounds: mask.bounds,
        palette: {
          colors: colors,
          min: 'Shady',
          max: 'Sunny'
        },
        render: showRoofOnly =>
          [...Array(12).keys()].map(month =>
            renderPalette({
              data: data,
              mask: showRoofOnly ? mask : undefined,
              colors: colors,
              min: 0,
              max: 200,
              index: month
            })
          )
      };
    },
    hourlyShade: async () => {
      const [mask, ...months] = await Promise.all([
        downloadGeoTIFF(urls.maskUrl),
        ...urls.hourlyShadeUrls.map(url => downloadGeoTIFF(url))
      ]);
      const colors = sunlightPalette;
      return {
        id: layerId,
        bounds: mask.bounds,
        palette: {
          colors: colors,
          min: 'Shade',
          max: 'Sun'
        },
        render: (showRoofOnly, month, day) =>
          [...Array(24).keys()].map(hour =>
            renderPalette({
              data: {
                ...months[month],
                rasters: months[month].rasters.map(values =>
                  values.map(x => x & (1 << (day - 1)))
                )
              },
              mask: showRoofOnly ? mask : undefined,
              colors: colors,
              min: 0,
              max: 1,
              index: hour
            })
          )
      };
    }
  };

  try {
    return get[layerId]();
  } catch (e) {
    console.error(`Error getting layer: ${layerId}\n`, e);
    throw e;
  }
}
