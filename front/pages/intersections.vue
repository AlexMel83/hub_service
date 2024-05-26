<template>
  <div>
    <section
      :class="{ blurred: isMenuOpen }"
      class="mapsection"
      name="image-map"
    >
      <l-map
        ref="map"
        @ready="onMapReady"
        :zoom="zoom"
        :center="center"
        style="width: 100%; height: 100%"
      >
        <l-tile-layer :url="osmUrl" :attribution="osmAttrib"></l-tile-layer>
        <!-- --- Маркери координат цілей --- -->
        <template v-for="target in targetMarkers" :key="target.id">
          <l-marker
            v-if="isIconLoaded && target.latLng && defaultIcon && shahedIcon"
            :key="target.id"
            :lat-lng="target.latLng"
            :icon="target.type === 'shahed' ? shahedIcon : defaultIcon"
            @click="selectFirstTarget()"
          >
            <l-popup id="intersection_popup">
              <div>ID: {{ target.id }}</div>
              <div>Частота: {{ target.frequency }}</div>
              <div>Тип: {{ target.type }}</div>
              <div>Чутливість: {{ target.distance }}</div>
              <div>Перший коворкінг: {{ target.firstcow_id }}</div>
              <div>Другий коворкінг: {{ target.secondcow_id }}</div>
              <div v-if="target.description">
                Опис: {{ target.description }}
              </div>
              <div>Збережено: {{ formatDate(target.updated_at) }}</div>
              <button type="button" @click="removeTargetMarker(target.id)">
                Видалити ціль
              </button>
              <div v-if="formData.error" class="form_data_error">
                {{ formData.error }}
              </div>
            </l-popup>
          </l-marker>
        </template>
        <!-- --- Маркери коворкінгів --- -->
        <l-marker
          v-for="coworking in markerData"
          :key="coworking.coworkingId"
          :lat-lng="[coworking.latitude, coworking.longitude]"
          @click="selectFirstCoworking(coworking)"
        >
          <l-popup>
            <div class="popup-content">
              <a
                :href="'/coworking/' + coworking.id"
                target="_blank"
                class="coworking-link"
              >
                <b class="coworking-name">{{ coworking.name }}</b>
              </a>
              <a
                :href="
                  'https://www.google.com/maps?q=' +
                  encodeURIComponent(coworking.address)
                "
                target="_blank"
                >{{ coworking.address }}</a
              >
              <form @submit.prevent="submitForm">
                <div class="form-group" id="azimuth">
                  <label>азимут:</label>
                  <input
                    type="number"
                    v-model="coworking.azimuth"
                    :disabled="formData.coworkingId !== coworking.coworkingId"
                    @change="
                      debouncedUpdateFormData(
                        coworking.coworkingId,
                        'azimuth',
                        coworking.azimuth,
                      )
                    "
                    class="form-input"
                    min="0"
                    max="360"
                  />
                </div>
                <div v-if="coworkingsWithAzimuth.length > 0" class="form-group">
                  <label>інший коворкінг:</label>
                  <select
                    v-model="coworking.anotherCoworkingId"
                    @change="
                      debouncedUpdateFormData(
                        coworking.coworkingId,
                        'anotherCoworkingId',
                        coworking.anotherCoworkingId,
                      )
                    "
                    class="form-input"
                  >
                    <option
                      v-for="otherCoworking in coworkingsWithAzimuth.filter(
                        (c) => c.coworking_id !== coworking.coworkingId,
                      )"
                      :key="otherCoworking.coworking_id"
                      :value="otherCoworking.coworking_id"
                    >
                      {{ otherCoworking.coworking_name }} аз:
                      {{ otherCoworking?.azimuth_degrees }} час:
                      {{ formatDate(otherCoworking.updated_at) }}
                    </option>
                  </select>
                </div>
                <div
                  v-if="selectedAnotherCoworking"
                  class="group_another_coworking"
                >
                  <div>{{ selectedAnotherCoworking.distance }}</div>
                  <div>{{ selectedAnotherCoworking.type }}</div>
                  <div>{{ selectedAnotherCoworking.frequency }}</div>
                </div>
                <div class="group_input">
                  <div class="form-group">
                    <label>чутливість:</label>
                    <input
                      type="number"
                      v-model="coworking.distance"
                      @change="
                        debouncedUpdateFormData(
                          coworking.coworkingId,
                          'distance',
                          coworking.distance,
                        )
                      "
                      class="form-input"
                    />
                  </div>
                  <div class="form-group">
                    <label>тип цілі:</label>
                    <select
                      v-model="coworking.type"
                      @change="
                        debouncedUpdateFormData(
                          coworking.coworkingId,
                          'type',
                          coworking.type,
                        )
                      "
                      class="form-input"
                    >
                      <option value="unknown">unknown</option>
                      <option value="shahed">shahed</option>
                      <option value="mavic">mavic</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>частота:</label>
                    <input
                      type="number"
                      v-model="coworking.frequency"
                      @change="
                        debouncedUpdateFormData(
                          coworking.coworkingId,
                          'frequency',
                          coworking.frequency,
                        )
                      "
                      class="form-input"
                    />
                  </div>
                </div>
                <div class="form-group" id="description">
                  <label>опис:</label>
                  <input
                    type="text"
                    v-model="coworking.description"
                    @change="
                      debouncedUpdateFormData(
                        coworking.coworkingId,
                        'description',
                        coworking.description,
                      )
                    "
                    class="form-input"
                  />
                </div>
                <div v-if="formData.updatedAt" class="form-group">
                  <label>дані були збережені: </label>
                  <span>{{ formatDate(formData.updatedAt) }}</span>
                </div>
                <div class="button-group">
                  <button type="button" @click="saveData">Записати</button>
                  <button type="button" @click="clearData">Очистити</button>
                  <button
                    type="button"
                    @click="createIntersection"
                    v-show="isFormValid"
                  >
                    Надіслати ціль
                  </button>
                </div>
                <p v-if="formData.error" class="form_data_error">
                  {{ formData.error }}
                </p>
              </form>
            </div>
          </l-popup>
        </l-marker>
        <!-- Маркеры для GeoJSON точек -->
        <l-marker
          id="target-marker"
          v-for="(feature, index) in geoJsonPoints"
          :key="'geojson-point-' + index"
          :lat-lng="[
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0],
          ]"
        >
          <l-popup id="target-popup"
            >{{ feature.properties.description }}
            Target location
            <p>
              {{ feature.geometry.coordinates[1] }},
              {{ feature.geometry.coordinates[0] }}
            </p>
          </l-popup>
        </l-marker>
        <!-- Лінії для GeoJSON LineString -->
        <l-polyline
          v-for="(feature, index) in geoJsonLineStrings"
          :key="'geojson-linestring-' + index"
          :lat-lngs="
            feature.geometry.coordinates.map((coord) => [coord[1], coord[0]])
          "
          :color="
            feature.properties.description === 'First Vector' ? 'blue' : 'red'
          "
        >
          <l-popup>{{ feature.properties.description }}</l-popup>
        </l-polyline>
        <l-marker
          v-if="intersectionMarker.latLng && intersectionMarker.icon"
          :key="'user'"
          :lat-lng="intersectionMarker.latLng"
          :icon="intersectionIcon"
        >
          <l-popup v-if="intersectionMarker.latLng">
            Your location
            <p>
              {{ intersectionMarker.latLng[0] }},
              {{ intersectionMarker.latLng[1] }}
            </p>
          </l-popup>
        </l-marker>
        <l-control-layers position="topright"></l-control-layers>
        <l-tile-layer
          v-for="tileProvider in tileProviders"
          :key="tileProvider.name"
          :name="tileProvider.name"
          :visible="tileProvider.visible"
          :url="tileProvider.url"
          :attribution="tileProvider.attribution"
          layer-type="base"
        />
      </l-map>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import {
  LMap,
  LTileLayer,
  LControlLayers,
  LMarker,
  LPopup,
  LPolyline,
} from "@vue-leaflet/vue-leaflet";
import { debounce } from "../middleware/utils";
import { useStore } from "vuex";
import { useNuxtApp } from "#app";
import dayjs from "dayjs";

const { $config, $api } = useNuxtApp();
const store = useStore();
const center = ref([49.230173, 28.447339]);
const coworkings = ref([]);
const geoJsonFeatures = ref([]);
const intersections = ref([]);
const intersectionMarker = reactive({ latLng: null, icon: null });
const isIconLoaded = ref(false);
const isMenuOpen = computed(() => store.state.isMenuOpen);
const map = ref(null);
const mapboxApiKey = $config.public.apiKeyMapbox;
const targets = ref([]);
const targetMarkers = ref([]);
const targetLocationMarker = reactive({ latLng: null, icon: null });
const osmAttrib = ref(
  '&copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> contributors',
);
const osmUrl = ref("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
let userIcon = null;
const zoom = ref(14);
let defaultIcon, shahedIcon;
const formatDate = (dateString) => {
  return dayjs(dateString).format("HH:mm:ss");
};
const handleGeoJsonResponse = (geoJsonResponse) => {
  geoJsonFeatures.value = geoJsonResponse.features;
};
const onMapReady = (mapObject) => {
  map.value.mapObject = mapObject;
};
const resetForm = () => {
  Object.assign(formData, initialFormData);
};
const selectFirstTarget = () => {
  formData.error = null;
};
const tileProviders = ref([
  {
    name: "OpenStreetMap",
    visible: true,
    attribution:
      '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  },
  {
    name: "Satellite",
    visible: false,
    url: `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=${mapboxApiKey}`,
    attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a>',
  },
  {
    name: "Hybrid",
    visible: false,
    url: `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxApiKey}`,
    attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a>',
  },
  {
    name: "OpenTopoMap",
    visible: false,
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution:
      'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  },
]);
const formData = reactive({
  coworkingId: null,
  azimuth: null,
  anotherCoworkingId: null,
  distance: null,
  type: null,
  description: null,
  frequency: null,
  error: null,
  updatedAt: null,
});
const initialFormData = {
  coworkingId: null,
  azimuth: null,
  anotherCoworkingId: null,
  distance: null,
  type: null,
  description: null,
  frequency: null,
  error: null,
  updatedAt: null,
};
const selectFirstCoworking = (coworking) => {
  formData.coworkingId = coworking.coworkingId;
  formData.azimuth = coworking.azimuth;
  formData.anotherCoworkingId = coworking.anotherCoworkingId;
  formData.distance = coworking.distance;
  formData.type = coworking.type;
  formData.description = coworking.description;
  formData.frequency = coworking.frequency;
  formData.error = null;
  formData.updatedAt = coworking.updatedAt;
};
const updateFormData = (coworkingId, field, value) => {
  const coworking = coworkings.value.find(
    (c) => c.coworking_id === coworkingId,
  );
  if (coworking) {
    formData[field] = value;
  }
};
const debouncedUpdateFormData = debounce(updateFormData, 300);

const handleTargetResponse = (targets) => {
  targetMarkers.value = targets.map((target) => {
    const regex = /POINT\(([^ ]+) ([^ ]+)\)/;
    const match = target.location.match(regex);
    const longitude = match ? parseFloat(match[1]) : 0;
    const latitude = match ? parseFloat(match[2]) : 0;
    return {
      id: target.id,
      latLng: [latitude, longitude],
      frequency: target.frequency,
      type: target.type,
      distance: target.distance,
      firstcow_id: target.firstcow_id,
      secondcow_id: target.secondcow_id,
      description: target.description,
      created_at: target.created_at,
      updated_at: target.updated_at,
    };
  });
};

const initIcons = () => {
  try {
    if (process.client) {
      import("leaflet").then((Leaflet) => {
        defaultIcon = L.icon({
          iconUrl: "/location-icon.ico",
          iconSize: [35, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });
        targetLocationMarker.icon = userIcon;
        shahedIcon = L.icon({
          iconUrl: "/shahed-gray.ico",
          iconSize: [55, 51],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });
        isIconLoaded.value = true; // Установим значение true после успешной загрузки иконок
      });
    }
  } catch (error) {
    console.error("Error initializing icons:", error);
  }
};

// start fetch queries
const fetchCoworkings = async () => {
  if (!isAuthenticated.value) {
    console.warn("Доступ запрещен, необходимо авторизоваться");
    return;
  }
  try {
    let url = "/coworkingtargets";
    const response = await $api.get(url);
    coworkings.value = response.data;
  } catch (error) {
    console.error("Error fetching coworkings data:", error);
  }
};
const fetchTargets = async () => {
  if (!isAuthenticated.value) {
    console.warn("Доступ запрещен, необходимо авторизоваться");
    return;
  }
  try {
    let url = "/intersections";
    const response = await $api.get(url);
    intersections.value = response.data;
    if (response.data) {
      formData.error = null;
      handleTargetResponse(response.data);
      return;
    }
  } catch (error) {
    console.error("Error fetching intersections data:", error);
  }
};
const removeTargetMarker = async (id) => {
  try {
    const response = await $api.delete(`/intersections?id=${id}`);
    console.log(id, response.data);
    if (response.data.message) {
      formData.error = response.data.message;
      return;
    } else {
      formData.error = null;
      await fetchTargets();
    }
  } catch (error) {
    console.error("Error deleting targetMarker:", error);
  }
};
const saveData = async () => {
  try {
    let url = "/targets";
    const response = await $api.post(url, {
      coworkingId: formData.coworkingId,
      anotherCoworkingId: formData.anotherCoworkingId,
      azimuthDegrees: formData.azimuth,
      distance: formData.distance,
      type: formData.type,
      frequency: formData.frequency,
      description: formData.description,
    });
    if (response.data.message) {
      formData.error = response.data.message;
      return;
    } else formData.error = null;
    targets.value = response.data;
    await fetchCoworkings();
    await fetchTargets();
    const filteredCoworkings = coworkings.value.filter(
      (c) => c.coworking_id === formData.coworkingId,
    );
    filteredCoworkings.length > 0
      ? (formData.updatedAt = filteredCoworkings[0].updated_at)
      : null;
  } catch (error) {
    console.error("Error saving targets data:", error);
  }
};
const clearData = async () => {
  try {
    const response = await $api.delete(
      `/targets?coworkingId=${formData.coworkingId}`,
    );
    if (response.data.message) {
      formData.error = response.data.message;
    } else formData.error = null;
    resetForm();
    await fetchCoworkings();
  } catch (error) {
    console.error("Error deleting data:", error);
  }
};
const createIntersection = async () => {
  const selectedAnotherCoworking = coworkingsWithAzimuth.value.find(
    (c) => c.coworking_id === formData.anotherCoworkingId,
  );
  try {
    await saveData();
    const response = await $api.post("/intersections", {
      firstCowId: formData.coworkingId,
      secondCowId: formData.anotherCoworkingId,
      firstAngle: formData.azimuth,
      secondAngle: selectedAnotherCoworking.azimuth_degrees,
      frequency: formData.frequency,
      type: formData.type,
      distance: formData.distance,
    });
    if (response.data.type === "FeatureCollection") {
      formData.error = null;
      handleGeoJsonResponse(response.data);
      if (map.value && map.value.mapObject) {
        const leafletMap = map.value.mapObject;
        leafletMap.closePopup();
      }
      return;
    } else if (response.data.message.includes("Точка перетину не знайдена")) {
      formData.error = "Точка перетину не знайдена";
    }
  } catch (error) {
    console.error("Error sending create-intersection request:", error);
  }
};
// end fetch queries

//start computed properties
const markerData = computed(() => {
  return coworkings.value.map((coworking) => {
    const regex = /POINT\(([^ ]+) ([^ ]+)\)/;
    const match = coworking.location ? coworking.location.match(regex) : null;
    const longitude = match ? parseFloat(match[1]) : 0;
    const latitude = match ? parseFloat(match[2]) : 0;
    return {
      coworkingId: coworking.coworking_id,
      latitude,
      longitude,
      name: coworking.coworking_name,
      address: coworking.address,
      anotherCoworkingId: coworking.another_coworking,
      azimuth: coworking.azimuth_degrees,
      type: coworking.type ? coworking.type : "unknown",
      distance: coworking.distance ? coworking.distance : 10000,
      frequency: coworking.frequency ? coworking.frequency : 2400,
      description: coworking.description
        ? coworking.description
        : "test target",
      updatedAt: coworking.updated_at,
    };
  });
});
const isFormValid = computed(() => {
  return (
    formData.coworkingId &&
    formData.azimuth &&
    formData.anotherCoworkingId &&
    formData.distance &&
    formData.type &&
    formData.description &&
    formData.frequency
  );
});
const coworkingsWithAzimuth = computed(() => {
  return coworkings.value.filter((c) => c.azimuth_degrees !== null);
});
const selectedAnotherCoworking = computed(() => {
  return (
    coworkingsWithAzimuth.value.find(
      (c) => c.coworking_id === formData.anotherCoworkingId,
    ) || null
  );
});
const geoJsonPoints = computed(() => {
  return geoJsonFeatures.value.filter(
    (feature) => feature.geometry.type === "Point",
  );
});
const geoJsonLineStrings = computed(() => {
  return geoJsonFeatures.value.filter(
    (feature) => feature.geometry.type === "LineString",
  );
});
const isAuthenticated = computed(() => {
  return store.state.authUser.email === "admin@test.com";
});
// end computed properties

onMounted(async () => {
  await fetchCoworkings();
  await fetchTargets();
  initIcons();
});
</script>

<style scoped>
.mapsection {
  margin: 0 auto;
  height: 80vh;
  min-height: 70vh;
}
.blurred {
  filter: blur(5px);
  pointer-events: none;
}
.popup-content {
  text-align: left;
}
label {
  font-weight: bold;
}
.coworking-link {
  display: block;
  text-decoration: none;
}
.coworking-name {
  display: block;
  margin: 5px 0;
  font-weight: bold;
  font-size: 130%;
  text-align: center;
}
.form-group {
  margin-bottom: 3px;
}
.form-input {
  width: 100%;
  padding: 2px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
#azimuth,
#description {
  margin-top: 5px;
  display: flex;
  gap: 5px;
  align-items: center;
}
.group_input,
.group_another_coworking {
  display: flex;
  gap: 5px;
}
.group_input > *,
.group_another_coworking > * {
  flex: 1;
}
.button-group {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
}
.button-group > * {
  border-radius: 4px;
  padding: 3px;
  background-color: #ccc;
}
.button-group > *:hover {
  background-color: #0078a8;
}
.form_data_error {
  color: red;
  font-size: 110%;
  font-weight: 700;
  text-align: center;
  margin-top: 10px;
}
.leaflet-popup-content-wrapper .leaflet-popup-content {
  width: unset !important;
}
#target-popup {
  text-align: center;
  display: flex;
  flex-direction: column;
  padding: 5px;
  white-space: nowrap;
  min-width: 200px;
  width: fit-content;
  max-width: none;
}
#intersection_popup {
  text-align: center;
  display: flex;
  flex-direction: column;
  white-space: nowrap;
  width: fit-content;
  max-width: none;
}
#intersection_popup button {
  border-radius: 4px;
  padding: 3px;
  background-color: #ccc;
}
#intersection_popup button:hover {
  background-color: #0078a8;
}
</style>
