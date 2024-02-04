let googleMapsApiKey = 'AIzaSyDMPvp62rcoIitOkkSlfIAxZzDUgL6dR84';
let map;
let geometryLibrary;
let mapsLibrary;
let placesLibrary;
let geoLocation;
let place;
let buildingInsights; // Declare buildingInsights variable
let expandedSection = '';
let showPanels = true;
let monthlyAverageEnergyBillInput = 300;
let panelCapacityWattsInput = 250;
let energyCostPerKwhInput = 0.31;
let dcToAcDerateInput = 0.85;
let configId; // Declare configId variable
let solarPanelConfigs;
let panelConfig;
let defaultPanelCapacityWatts;
let installationSizeKw;
let installationCostTotal;
let installationCostPerWatt = 4.0;
let solarIncentives = 7000;
let yearlyKwhEnergyConsumption;
let solarPotential;
let palette;
let minEnergy;
let maxEnergy;
let defaultPanelCapacity;
let panelCapacityRatio;
let energyCovered;
let yearlyProductionAcKwh;
let isShowDataLayer = true;

let interval;
// $('#box2').show();
const spinnerHtml = `<div class="d-flex justify-content-center"><div class="spinner-border text-primary" role="status">
  <span class="sr-only"></span>
</div></div>`;

let accordionsID = '#accordions';
let isBuildingAccordionOpen = false;
let isSolarAccordionOpen = false;

document.addEventListener('DOMContentLoaded', async function () {
  // const defaultPlace = {
  //   name: 'New Orleans Museum',
  //   address: 'New Orleans Museum of Art'
  // };
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

  // Get the address information for the default geoLocation.
  const geocoder = new google.maps.Geocoder();
  const geocoderResponse = await geocoder.geocode({
    address: defaultPlace.address
  });
  const geocoderResult = geocoderResponse.results[0];
  // Initialize the map at the desired geoLocation.
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

// Right Sections Code

function generateSolarPotentialHtml() {
  return `
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                  data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                  <svg width="25px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="me-1">
                    <title>cash-multiple</title>
                    <path
                      d="M5,6H23V18H5V6M14,9A3,3 0 0,1 17,12A3,3 0 0,1 14,15A3,3 0 0,1 11,12A3,3 0 0,1 14,9M9,8A2,2 0 0,1 7,10V14A2,2 0 0,1 9,16H19A2,2 0 0,1 21,14V10A2,2 0 0,1 19,8H9M1,10H3V20H19V22H1V10Z" />
                  </svg>
                  Solar Potential Analysis
                </button>
                <div style="position: relative; top: -7px">
                  <p class="accordion-sub-heading">
                    Values are only placeholders. <br />
                    Update with your own values.
                  </p>
                </div>
              </h2>
              <div id="flush-collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordions">
                <div class="accordion-body">
                  <!-- text box  -->
                  <div class="distinct mt-2 p-3">
                    <p class="mb-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25">
                        <title>information-outline</title>
                        <path fill="#79747E"
                          d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />
                      </svg>
                      Projections use a
                      <a class="two-dis-link" target="_blank"
                        href="https://developers.google.com/maps/documentation/solar/calculate-costs-us">USA financial
                        model
                        <svg width="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <title>open-in-new</title>
                          <path
                            d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                        </svg>
                      </a>
                    </p>
                  </div>
                  <form class="mt-4">
                  <!-- Bill input  -->
                  <div class="omrs-input-group">
                      <label class="omrs-input-filled">
                        <input type="number" id="bill-input" value="300" required />
                        <span class="omrs-input-label">Monthly average energy bill</span>
                        <p style="margin-top: -42px; margin-left: 2px">
                          <i class="bi bi-currency-dollar" style="font-size: 25px"></i>
                          <span style="position: absolute; top: 12px">
                            <i class="bi bi-currency-dollar" style="font-size: 15px"></i>
                          </span>
                        </p>
                      </label>
                    </div>

                   <!--Panel Count Range input  -->
                    <div class="row mt-2">
                    <div class="col-lg-2">
                      <svg width="25px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <title>solar-power-variant-outline</title>
                        <path
                          d="M20 12H4L2 22H22L20 12M18.36 14L18.76 16H13V14H18.36M11 14V16H5.24L5.64 14H11M4.84 18H11V20H4.44L4.84 18M13 20V18H19.16L19.56 20H13M11 8H13V11H11V8M15.76 7.21L17.18 5.79L19.3 7.91L17.89 9.33L15.76 7.21M4.71 7.91L6.83 5.79L8.24 7.21L6.12 9.33L4.71 7.91M3 2H6V4H3V2M18 2H21V4H18V2M12 7C14.76 7 17 4.76 17 2H15C15 3.65 13.65 5 12 5S9 3.65 9 2H7C7 4.76 9.24 7 12 7Z" />
                      </svg>
                    </div>
                    <div class="col-lg-4 fw-bold" style="color: #6260a3">
                      Panels Count
                    </div>
                    <div class="col-lg-5 text-end" id="panel-count-2">0 Panels</div>
                    <!-- Range input  -->
                    <div class="ms-2">
                      <input type="range" min="1" max="100" value="0" class="slider" id="panels-count-slider-2" />
                    </div>
                    </div>
                  <!-- energy cost input  -->
                    <div class="omrs-input-group mt-3">
                      <label class="omrs-input-filled">
                        <input type="number" id="energy-cost-input" value="0.31" required />
                        <span class="omrs-input-label">Energy Cost Per kWh</span>
                        <p style="margin-top: -42px; margin-left: 2px">
                          <i class="bi bi-currency-dollar" style="font-size: 25px"></i>
                          <span style="position: absolute; top: 12px">
                            <i class="bi bi-currency-dollar" style="font-size: 15px"></i>
                          </span>
                        </p>
                      </label>
                    </div>
                    <!-- solar incentive  -->
                    <div class="omrs-input-group mt-3">
                      <label class="omrs-input-filled">
                        <input type="number"  id="solar-incentive-input" value="7000" required />
                        <span class="omrs-input-label">Solar incentives</span>
                        <p style="margin-top: -42px; margin-left: 7px">
                          <i class="bi bi-gift" style="font-size: 20px"></i>
                          <span style="position: absolute; top: 12px">
                            <i class="bi bi-currency-dollar" style="font-size: 15px"></i>
                          </span>
                        </p>
                      </label>
                    </div>
                    <!-- installation cost per watt -->
                    <div class="omrs-input-group mt-3">
                      <label class="omrs-input-filled">
                        <input type="number" id="installation-cost-input" value="4.00" required />
                        <span class="omrs-input-label">Installation cost per Watt</span>
                        <p style="margin-top: -42px; margin-left: 7px">
                          <i class="bi bi-textarea" style="font-size: 20px"></i>
                          <span style="position: absolute; top: 12px">
                            <i class="bi bi-currency-dollar" style="font-size: 15px"></i>
                          </span>
                        </p>
                      </label>
                    </div>
                    <!-- Panel capacity per watt -->
                    <div class="omrs-input-group mt-3">
                      <label class="omrs-input-filled">
                        <input type="number" id="panel-capacity-watt" value="250" required />
                        <span class="omrs-input-label">Panel Capacity per Watt</span>
                        <p style="margin-top: -42px; margin-left: 3px">
                          <i class="bi bi-lightning" style="font-size: 25px"></i>
                          <span style="position: absolute; top: 12px">
                            <i class="bi bi-currency-dollar" style="font-size: 15px"></i>
                          </span>
                        </p>
                      </label>
                    </div>
                  </form>
                </div>
              </div>
            </div>`;
}

function generateBuildingInsightsHtml() {
  return `<div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                  data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                  <svg width="25px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="me-1">
                    <title>home-outline</title>
                    <path d="M12 5.69L17 10.19V18H15V12H9V18H7V10.19L12 5.69M12 3L2 12H5V20H11V14H13V20H19V12H22" />
                  </svg>
                  Building Insights Endpoint <br />
                </button>
                <p class="accordion-sub-heading" style="position: relative; top: -7px">
                  Yearly energy: <span id="yearly-energy-accordion">0 MWh</span>
                </p>
              </h2>
              <div id="flush-collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordions">
                <div class="accordion-body">
                  <p class="building-para">
                    <b class="fw-bold"> Building Insights endpoint</b>
                    provides data on the location, dimensions & solar
                    potential of a building.
                  </p>
                  <div class="row">
                    <div class="col-lg-2">
                      <svg width="25px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <title>solar-power-variant-outline</title>
                        <path
                          d="M20 12H4L2 22H22L20 12M18.36 14L18.76 16H13V14H18.36M11 14V16H5.24L5.64 14H11M4.84 18H11V20H4.44L4.84 18M13 20V18H19.16L19.56 20H13M11 8H13V11H11V8M15.76 7.21L17.18 5.79L19.3 7.91L17.89 9.33L15.76 7.21M4.71 7.91L6.83 5.79L8.24 7.21L6.12 9.33L4.71 7.91M3 2H6V4H3V2M18 2H21V4H18V2M12 7C14.76 7 17 4.76 17 2H15C15 3.65 13.65 5 12 5S9 3.65 9 2H7C7 4.76 9.24 7 12 7Z" />
                      </svg>
                    </div>
                    <div class="col-lg-4 fw-bold" style="color: #6260a3">
                      Panels Count
                    </div>
                    <div class="col-lg-5 text-end" id="panel-count">0 Panels</div>
                    <!-- Range input  -->
                    <div class="ms-2">
                      <input type="range" min="1" max="100" value="0" class="slider" id="panels-count-slider" />
                    </div>
                    <!-- Number Input -->
                    <form>
                      <div class="omrs-input-group mt-3">
                        <label class="omrs-input-filled">
                          <input type="number" id="panel-capacity" value="250" required />
                          <span class="omrs-input-label">Panel Capacity</span>
                          <p style="margin-top: -42px; margin-left: 3px">
                            <i class="bi bi-lightning" style="font-size: 25px"></i>
                          </p>
                        </label>
                      </div>
                    </form>
                    <!-- switch  input-->
                    <div class="form-check form-switch ms-3">
                      <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked"
                        checked />
                      <label class="form-check-label ms-2" for="flexSwitchCheckChecked">Solar Panels</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>`;
}

calculateYearlyKwhEnergyConsumption();

function calculateYearlyKwhEnergyConsumption() {
  yearlyKwhEnergyConsumption =
    (monthlyAverageEnergyBillInput / energyCostPerKwhInput) * 12;
}

solarPanels = [];
let requestSent = false;
let requestError;
let apiResponseDialog;

function BuildingInsightsSection() {
  function initializeSolarPanels() {
    solarPanels.map(panel => panel.setMap(null));
    solarPanels = [];
  }

  function updateSolarPanels() {
    solarPanels.map((panel, i) =>
      panel.setMap(
        showPanels && panelConfig && i < panelConfig.panelsCount ? map : null
      )
    );
  }

  async function showSolarPotential() {
    if (requestSent) {
      return;
    }

    buildingInsights = undefined;
    requestError = undefined;

    initializeSolarPanels();
    function updateFromBuildingSection() {
      if (configId === undefined && buildingInsights) {
        defaultPanelCapacity =
          buildingInsights.solarPotential.panelCapacityWatts;
        defaultPanelCapacityWatts = defaultPanelCapacity;
        solarPanelConfigs = buildingInsights.solarPotential.solarPanelConfigs;
        panelCapacityRatio = panelCapacityWattsInput / defaultPanelCapacity;
        configId = findSolarConfig(
          buildingInsights.solarPotential.solarPanelConfigs,
          yearlyKwhEnergyConsumption,
          panelCapacityRatio,
          dcToAcDerateInput
        );
      }

      panelConfig = buildingInsights.solarPotential.solarPanelConfigs[configId];
      solarPotential = buildingInsights.solarPotential;
      palette = createPalette(panelsPalette).map(rgbToColor);
      minEnergy = solarPotential.solarPanels.slice(-1)[0].yearlyEnergyDcKwh;
      maxEnergy = solarPotential.solarPanels[0].yearlyEnergyDcKwh;
      solarPanels = solarPotential.solarPanels.map(panel => {
        const [w, h] = [
          solarPotential.panelWidthMeters / 2,
          solarPotential.panelHeightMeters / 2
        ];
        const points = [
          { x: +w, y: +h }, // top right
          { x: +w, y: -h }, // bottom right
          { x: -w, y: -h }, // bottom left
          { x: -w, y: +h }, // top left
          { x: +w, y: +h } // top right (closing the polygon)
        ];
        const orientation = panel.orientation == 'PORTRAIT' ? 90 : 0;
        const azimuth =
          solarPotential.roofSegmentStats[panel.segmentIndex].azimuthDegrees;
        const colorIndex = Math.round(
          normalize(panel.yearlyEnergyDcKwh, maxEnergy, minEnergy) * 255
        );

        // Compute the coordinates of each point based on the panel's center, width, height, orientation, and azimuth
        const polygonCoordinates = points.map(({ x, y }) =>
          geometryLibrary.spherical.computeOffset(
            {
              lat: panel.center.latitude,
              lng: panel.center.longitude
            },
            Math.sqrt(x * x + y * y),
            Math.atan2(y, x) * (180 / Math.PI) + orientation + azimuth
          )
        );

        // Create a new google.maps.Polygon instance with computed coordinates and other properties
        return new google.maps.Polygon({
          paths: polygonCoordinates,
          strokeColor: '#B0BEC5',
          strokeOpacity: 0.9,
          strokeWeight: 1,
          fillColor: palette[colorIndex],
          fillOpacity: 0.9
        });
      });
    }
    requestSent = true;
    try {
      clearInterval(interval);
      $('.footer').hide();
      $('#isShowOverlays').prop('checked', true);
      isShowDataLayer = true;
      buildingInsights = await findClosestBuilding(geoLocation);

      updateFromBuildingSection(buildingInsights);
      updateSolarPanels();
      DataLayerSection(buildingInsights);
      $('#yearly-energy-accordion').html(
        `${(
          (panelConfig?.yearlyEnergyDcKwh || 0 * panelCapacityRatio || 0) / 1000
        ).toFixed(2)} MWh`
      );

      $('#panel-count-box').html(
        showNumber(
          buildingInsights.solarPotential.solarPanelConfigs[configId]
            .panelsCount
        ) + '/ '
      );

      $('#total-panels').html(showNumber(solarPanels.length));

      $('#yearly-energy,.energy_savings_leaf').html(
        showNumber((panelConfig?.yearlyEnergyDcKwh ?? 0) * panelCapacityRatio)
      );

      $('.co2').html(
        showNumber(buildingInsights.solarPotential.carbonOffsetFactorKgPerMwh) +
          ' hr'
      );

      $('.solar_power').html(
        showNumber(buildingInsights.solarPotential.solarPanels.length) + ' hr'
      );

      $('.square_foot').html(
        showNumber(buildingInsights.solarPotential.wholeRoofStats.areaMeters2) +
          ' hr'
      );

      $('.wb_sunny').html(
        showNumber(buildingInsights.solarPotential.maxSunshineHoursPerYear) +
          ' hr'
      );

      $('#panels-count-slider,#panels-count-slider-2').attr({
        max: buildingInsights.solarPotential.solarPanelConfigs.length - 1,
        min: 0,
        value: configId
      });

      $('#panel-count, #panel-count-2').html(
        `${buildingInsights.solarPotential.solarPanelConfigs[configId].panelsCount} panels`
      );
    } catch (e) {
      toastr.error('No data found for this address');
      console.log('error: ', e);
      requestError = e;
      return;
    } finally {
      requestSent = false;
    }
  }

  showSolarPotential();
  $('#panels-count-slider,#panels-count-slider-2').on('input', function (e) {
    configId = e.target.value ?? 0;
    showSolarPotential();
  });

  $('#panel-capacity').on('input', function (e) {
    const value = e.target.value ?? 0;
    panelCapacityWattsInput = value;
    showSolarPotential();
  });
  $('#flexSwitchCheckChecked').on('input', function (e) {
    const value = e.target.checked ?? false;
    showPanels = value;
    showSolarPotential();
  });
}

function DataLayerSection(_buildingInsights) {
  let expandedSection = '';

  const dataLayerOptions = {
    none: 'No layer',
    mask: 'Roof mask',
    dsm: 'Digital Surface Model',
    rgb: 'Aerial image',
    annualFlux: 'Annual sunshine',
    monthlyFlux: 'Monthly sunshine',
    hourlyShade: 'Hourly shade'
  };

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  let dataLayersResponse;
  let requestError;
  let apiResponseDialog;
  let layerId = 'monthlyFlux';
  let layer;

  let playAnimation = true;
  let tick = 0;
  let month = 0;
  let day = 14;
  let hour = 0;

  let overlays = [];
  let showRoofOnly = false;

  async function setDataLayer(reset = false) {
    if (reset) {
      layerId = 'monthlyFlux';
      dataLayersResponse = undefined;
      requestError = undefined;
      layer = undefined;

      showRoofOnly = ['annualFlux', 'monthlyFlux', 'hourlyShade'].includes(
        layerId
      );
      month = layerId == 'hourlyShade' ? 3 : 0;
      day = 14;
      hour = 5;
      playAnimation = ['monthlyFlux', 'hourlyShade'].includes(layerId);
    } else {
      layerId = 'none';
    }
    map.setMapTypeId(layerId == 'rgb' ? 'roadmap' : 'satellite');
    overlays.map(overlay => overlay.setMap(null));
    if (layerId == 'none') {
      return;
    }

    if (!layer) {
      // console.log('___building insights: ', _buildingInsights.center);
      const center = _buildingInsights.center;
      const ne = _buildingInsights.boundingBox.ne;
      const sw = _buildingInsights.boundingBox.sw;
      const diameter = geometryLibrary.spherical.computeDistanceBetween(
        new google.maps.LatLng(ne.latitude, ne.longitude),
        new google.maps.LatLng(sw.latitude, sw.longitude)
      );
      const radius = Math.ceil(diameter / 2);
      // console.log('----', center, _buildingInsights.boundingBox);
      try {
        dataLayersResponse = await getDataLayerUrls(
          center,
          radius,
          googleMapsApiKey
        );
        // console.log('dataLayersResponse', dataLayersResponse);
      } catch (e) {
        toastr.error('No data found for this address');

        console.log('error', e);
        requestError = e;
        return;
      }

      try {
        layer = await getLayer(layerId, dataLayersResponse, googleMapsApiKey);
      } catch (e) {
        toastr.error('No data found for this address');

        console.log('error getting: ', e);
        requestError = e;
        return;
      }
    }

    const bounds = layer.bounds;
    // console.log('Render layer:', {
    //   layerId: layer.id,
    //   showRoofOnly: showRoofOnly,
    //   month: month,
    //   day: day
    // });
    overlays.map(overlay => overlay.setMap(null));
    overlays = layer.render(showRoofOnly, month, day).map(canvas => {
      return new google.maps.GroundOverlay(canvas.toDataURL(), bounds);
    });

    if (!['monthlyFlux', 'hourlyShade'].includes(layer.id)) {
      overlays[0].setMap(map);
    }
  }

  function setOverlayOnMap(show = true) {
    if (show) {
      if (layer?.id == 'monthlyFlux') {
        overlays.map((overlay, i) => overlay.setMap(i == month ? map : null));
      } else if (layer?.id == 'hourlyShade') {
        overlays.map((overlay, i) => overlay.setMap(i == hour ? map : null));
      }

      if (layer?.id == 'monthlyFlux') {
        if (playAnimation) {
          month = tick % 12;
        } else {
          tick = month;
        }
      } else if (layer?.id == 'hourlyShade') {
        if (playAnimation) {
          hour = tick % 24;
        } else {
          tick = hour;
        }
      }

      $('#month-range').val(month);
      $('#month-name').html(monthNames[month]);
    }
  }

  function onSliderChange(event) {
    const target = event.target;
    if (layer?.id == 'monthlyFlux') {
      if (target.valueStart != month) {
        month = target.valueStart ?? 0;
      } else if (target.valueEnd != month) {
        month = target.valueEnd ?? 0;
      }
      tick = month;
    } else if (layer?.id == 'hourlyShade') {
      if (target.valueStart != hour) {
        hour = target.valueStart ?? 0;
      } else if (target.valueEnd != hour) {
        hour = target.valueEnd ?? 0;
      }
      tick = hour;
    }
  }
  if (isShowDataLayer) setDataLayer(true);

  interval = setInterval(() => {
    if (checkIsShowDataLayer()) {
      tick++;
      setOverlayOnMap();
      $('.footer').show();
    } else {
      $('.footer').hide();
      setDataLayer(false);
    }
  }, 1000);

  // setInterval(() => {
  //   isShowDataLayer = !isShowDataLayer;
  // }, 8000);
}

$('#isShowOverlays').on('input', function (e) {
  isShowDataLayer = e.target.checked;
});

function checkIsShowDataLayer() {
  return isShowDataLayer;
}

function createAccordionSections() {
  const html = generateBuildingInsightsHtml() + generateSolarPotentialHtml();
  $(accordionsID).append(html);

  let monthlyKwhEnergyConsumption;
  function CalculateSolarPotential() {
    let costChart = document.getElementById('line-chart');
    let showAdvancedSettings = false;

    // [START solar_potential_calculations]
    // Solar configuration, from buildingInsights.solarPotential.solarPanelConfigs
    let panelsCount =
      buildingInsights.solarPotential.solarPanelConfigs[configId].panelsCount;
    let yearlyEnergyDcKwh = 12000;

    // Basic settings
    let panelCapacityWatts = 400;
    let installationLifeSpan = 20;

    // Advanced settings
    let dcToAcDerate = 0.85;
    let efficiencyDepreciationFactor = 0.995;
    let costIncreaseFactor = 1.022;
    let discountRate = 1.04;

    // Solar installation
    installationSizeKw = (panelsCount * panelCapacityWatts) / 1000;
    if (solarPanelConfigs[configId]) {
      installationSizeKw =
        (solarPanelConfigs[configId].panelsCount * panelCapacityWattsInput) /
        1000;
    }
    installationCostTotal = installationCostPerWatt * installationSizeKw * 1000;

    // Energy consumption
    monthlyKwhEnergyConsumption =
      monthlyAverageEnergyBillInput / energyCostPerKwhInput;
    yearlyKwhEnergyConsumption = monthlyKwhEnergyConsumption * 12;

    // Energy produced for installation life span
    let initialAcKwhPerYear = yearlyEnergyDcKwh * dcToAcDerate;
    yearlyProductionAcKwh = Array.from(Array(installationLifeSpan).keys()).map(
      year => initialAcKwhPerYear * efficiencyDepreciationFactor ** year
    );

    // Cost with solar for installation life span
    let yearlyUtilityBillEstimates = yearlyProductionAcKwh.map(
      (yearlyKwhEnergyProduced, year) => {
        const billEnergyKwh =
          yearlyKwhEnergyConsumption - yearlyKwhEnergyProduced;
        const billEstimate =
          (billEnergyKwh * energyCostPerKwhInput * costIncreaseFactor ** year) /
          discountRate ** year;
        return Math.max(billEstimate, 0); // bill cannot be negative
      }
    );
    let remainingLifetimeUtilityBill = yearlyUtilityBillEstimates.reduce(
      (x, y) => x + y,
      0
    );
    let totalCostWithSolar =
      installationCostTotal + remainingLifetimeUtilityBill - solarIncentives;

    // Cost without solar for installation life span
    let yearlyCostWithoutSolar = Array.from(
      Array(installationLifeSpan).keys()
    ).map(
      year =>
        (monthlyAverageEnergyBillInput * 12 * costIncreaseFactor ** year) /
        discountRate ** year
    );
    let totalCostWithoutSolar = yearlyCostWithoutSolar.reduce(
      (x, y) => x + y,
      0
    );

    // Savings with solar for installation life span
    let savings = totalCostWithoutSolar - totalCostWithSolar;

    let breakEvenYear = -1;
    // googleCharts.GoogleCharts.load(
    //   () => {
    //     // if (!document.getElementById('line-chart')) {
    //     //   return;
    //     // }
    //     const year = new Date().getFullYear();

    //     let costWithSolar = 0;
    //     const cumulativeCostsWithSolar = yearlyUtilityBillEstimates.map(
    //       (billEstimate, i) =>
    //         (costWithSolar +=
    //           i == 0
    //             ? billEstimate + installationCostTotal - solarIncentives
    //             : billEstimate)
    //     );
    //     let costWithoutSolar = 0;
    //     const cumulativeCostsWithoutSolar = yearlyCostWithoutSolar.map(
    //       cost => (costWithoutSolar += cost)
    //     );
    //     breakEvenYear = cumulativeCostsWithSolar.findIndex(
    //       (costWithSolar, i) => costWithSolar <= cumulativeCostsWithoutSolar[i]
    //     );

    //     const data = google.visualization.arrayToDataTable([
    //       ['Year', 'Solar', 'No solar'],
    //       [year.toString(), 0, 0],
    //       ...cumulativeCostsWithSolar.map((_, i) => [
    //         String(year + i + 1),
    //         cumulativeCostsWithSolar[i],
    //         cumulativeCostsWithoutSolar[i]
    //       ])
    //     ]);

    //     const googleCharts = google.charts;
    //     const chart = new googleCharts.Line(costChart);
    //     const options = googleCharts.Line.convertOptions({
    //       title: `Cost analysis for ${installationLifeSpan} years`,
    //       width: 350,
    //       height: 200
    //     });
    //     chart.draw(data, options);
    //   },
    //   { packages: ['line'] }
    // );
    $('#cwts').html('$' + showNumber(totalCostWithoutSolar));
    $('#cws').html('$' + showNumber(totalCostWithSolar));
    $('#savings').html('$' + showNumber(savings));
  }

  if (geometryLibrary && map) {
    BuildingInsightsSection();
  }
  function updateConfig() {
    monthlyKwhEnergyConsumption =
      monthlyAverageEnergyBillInput / energyCostPerKwhInput;
    yearlyKwhEnergyConsumption = monthlyKwhEnergyConsumption * 12;
    panelCapacityRatio = panelCapacityWattsInput / defaultPanelCapacityWatts;
    configId = findSolarConfig(
      solarPanelConfigs,
      yearlyKwhEnergyConsumption,
      panelCapacityRatio,
      dcToAcDerateInput
    );
    energyCovered = yearlyProductionAcKwh[0] / yearlyKwhEnergyConsumption;

    // $('.energy_savings_leaf').html(
    //   showNumber(
    //     (solarPanelConfigs[configId]?.yearlyEnergyDcKwh ?? 0) *
    //       panelCapacityRatio
    //   ) + ' kWh'
    // );

    $('.installation_size').html(showNumber(installationSizeKw) + ' kW');

    $('.request_quote').html(showMoney(installationCostTotal));

    $('.energy-covered').html(
      Math.round(energyCovered * 100).toString() + ' %'
    );
  }

  function getData() {
    return [
      [
        'Address',
        'Panels Count',
        'Panel Capacity in watts',
        'Monthly average energy bill',
        'Energy Cost per kWh',
        'Solar Incentives',
        'Installation Cost Per Watt',
        'Yearly Energy kWh',
        'Annual Shine',
        'Roof Area',
        'Max Panel Count',
        'CO2 Savings',
        'Installation size',
        'Energy Covered'
      ],
      [
        place?.formatted_address,
        showNumber(
          buildingInsights.solarPotential.solarPanelConfigs[configId]
            .panelsCount
        ),
        panelCapacityWattsInput,
        monthlyAverageEnergyBillInput,
        energyCostPerKwhInput,
        solarIncentives,
        installationCostPerWatt,
        showNumber((panelConfig?.yearlyEnergyDcKwh ?? 0) * panelCapacityRatio),
        showNumber(buildingInsights.solarPotential.maxSunshineHoursPerYear),
        showNumber(buildingInsights.solarPotential.wholeRoofStats.areaMeters2),
        showNumber(buildingInsights.solarPotential.solarPanels.length) + ' hr',
        showNumber(buildingInsights.solarPotential.carbonOffsetFactorKgPerMwh),
        showNumber(installationSizeKw),
        Math.round(energyCovered * 100).toString()
      ]
    ];
  }
  setTimeout(() => {
    // DataLayerSection();
    CalculateSolarPotential();
    updateConfig();
  }, 3000);

  document
    .getElementById('download-btn')
    .addEventListener('click', function () {
      // Create a workbook
      var wb = XLSX.utils.book_new();

      // Create worksheet
      const downloadAbleData = getData();
      var ws = XLSX.utils.aoa_to_sheet(downloadAbleData);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      // Convert workbook to binary XLSX
      var wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });

      function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
      }

      // Trigger download
      var blob = new Blob([s2ab(wbout)], {
        type: 'application/octet-stream'
      });
      var link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'data.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

  $('#bill-input').on('input', function (e) {
    const value = e.target.value ?? 0;
    monthlyAverageEnergyBillInput = value;
    CalculateSolarPotential();
    updateConfig();
  });

  $('#panels-count-slider-2').on('input', function (e) {
    CalculateSolarPotential();
    updateConfig();
  });
  $('#energy-cost-input').on('input', function (e) {
    const value = e.target.value ?? 0;
    energyCostPerKwhInput = value;
    CalculateSolarPotential();
    updateConfig();
  });
  $('#solar-incentive-input').on('input', function (e) {
    const value = e.target.value ?? 0;
    solarIncentives = value;
    CalculateSolarPotential();
    updateConfig();
  });
  $('#installation-cost-input').on('input', function (e) {
    const value = e.target.value ?? 0;
    installationCostPerWatt = value;
    CalculateSolarPotential();
    updateConfig();
  });
  $('#panel-capacity-watt').on('input', function (e) {
    const value = e.target.value ?? 0;
    panelCapacityWattsInput = value;
    CalculateSolarPotential();
    updateConfig();
  });
}

function onSearchChange() {
  $(accordionsID).html(spinnerHtml);
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
    // $(accordionsID).html(spinnerHtml);
    place = autocomplete.getPlace();
    // Check if place geometry or geoLocation is not available
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
    if (geoLocation) {
      $(accordionsID).html('');
      createAccordionSections();
    }
    if (geometryLibrary && map) {
      BuildingInsightsSection();
    }
    // Update text field value with place name or formatted address
    if (place.name) {
      searchBarElement.value = place.name;
    } else if (place.formatted_address) {
      searchBarElement.value = place.formatted_address;
    }
  });
  if (geoLocation) {
    $(accordionsID).html('');
    createAccordionSections();
  }
}

$('.accordion').on('show.bs.collapse', function (e) {
  switch (e.target.id) {
    case 'flush-collapseOne':
      isBuildingAccordionOpen = true;
      $('#box').show();
      break;
    case 'flush-collapseThree':
      isSolarAccordionOpen = true;
      $('#box2').show();
      break;
    default:
      break;
  }
  // Additional actions you want to perform when an accordion item is shown
});

$('.accordion').on('hide.bs.collapse', function (e) {
  switch (e.target.id) {
    case 'flush-collapseOne':
      $('#box').hide();
      break;
    case 'flush-collapseThree':
      isSolarAccordionOpen = false;
      $('#box2').hide();
      break;
    default:
      break;
  }
});

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

function rgbToColor({ r, g, b }) {
  const f = x => {
    const hex = Math.round(x).toString(16);
    return hex.length == 1 ? `0${hex}` : hex;
  };
  return `#${f(r)}${f(g)}${f(b)}`;
}

// Solar API

async function findClosestBuilding(geoLocation) {
  const args = {
    'location.latitude': geoLocation.lat().toFixed(5),
    'location.longitude': geoLocation.lng().toFixed(5)
  };
  // console.log('GET buildingInsights\n', args);
  const params = new URLSearchParams({ ...args, key: googleMapsApiKey });
  return fetch(
    `https://solar.googleapis.com/v1/buildingInsights:findClosest?${params}`
  ).then(async response => {
    const content = await response.json();
    if (response.status != 200) {
      toastr.error('No Data Found for this address');
      console.error('findClosestBuilding\n', content);
      throw content;
    }
    // console.log('buildingInsightsResponse', content);
    return content;
  });
}

async function getDataLayerUrls(geoLocation, radiusMeters) {
  const args = {
    'location.latitude': geoLocation.latitude.toFixed(5),
    'location.longitude': geoLocation.longitude.toFixed(5),
    radius_meters: radiusMeters.toString()
  };
  // console.log('GET dataLayers\n', args);
  const params = new URLSearchParams({ ...args, key: googleMapsApiKey });
  return fetch(`https://solar.googleapis.com/v1/dataLayers:get?${params}`).then(
    async response => {
      const content = await response.json();
      if (response.status != 200) {
        toastr.error('No Data Found for this address');

        console.error('getDataLayerUrls\n', content);
        throw content;
      }
      // console.log('dataLayersResponse', content);
      return content;
    }
  );
}

async function downloadGeoTIFF(url) {
  // console.log(`Downloading data layer: ${url}`);
  const solarUrl = url.includes('solar.googleapis.com')
    ? url + `&key=${googleMapsApiKey}`
    : url;
  const response = await fetch(solarUrl);
  if (response.status != 200) {
    const error = await response.json();
    toastr.error('No Data Found for this address');

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
    toastr.error('No data found for this address');

    console.error(`Error getting layer: ${layerId}\n`, e);
    throw e;
  }
}
