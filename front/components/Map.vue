<template>
  <section
    class="mapsection"
    name="image-map"
    v-if="coworkings.length > 0"
    style="height: 400px"
  >
    <v-btn @click="getLocation()" class="location">Get your Location</v-btn>
    <span v-if="userLocationMarker.latLng && userLocationMarker.icon">
      {{ userLocationMarker?.latLng[0] }}, {{ userLocationMarker?.latLng[1] }}
    </span>
    <l-map
      ref="map"
      :zoom="zoom"
      :center="center"
      style="width: 100%; height: 100%"
    >
      <l-tile-layer :url="osmUrl" :attribution="osmAttrib"></l-tile-layer>
      <l-marker
        v-if="userLocationMarker.latLng && userLocationMarker.icon"
        :key="'user'"
        :lat-lng="userLocationMarker.latLng"
        :icon="userIcon"
      >
        <l-popup v-if="userLocationMarker.latLng">
          Your location
          <p>
            {{ userLocationMarker.latLng[0] }},
            {{ userLocationMarker.latLng[1] }}
          </p>
        </l-popup>
      </l-marker>
      <l-marker
        v-for="coworking in markerData"
        :key="coworking.id"
        :lat-lng="[coworking.latitude, coworking.longitude]"
      >
        <l-popup :content="coworking.popupContent"></l-popup>
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
</template>

<script setup>
import {
  LMap,
  LTileLayer,
  LControlLayers,
  LMarker,
  LPopup,
  LIcon,
} from "@vue-leaflet/vue-leaflet";
import { nextTick, reactive, defineProps, ref, computed, onMounted } from "vue";
import { useNuxtApp } from "#app";
const { $config, $api } = useNuxtApp();
const baseURL = $api.defaults.baseURL;
const mapboxApiKey = $config.public.apiKeyMapbox;
const props = defineProps({
  coworkings: Array,
});
const map = ref(null);
const zoom = ref(14);
const center = ref([49.230173, 28.447339]);
const userLocationMarker = reactive({ latLng: null, icon: null });
const osmUrl = ref("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
const osmAttrib = ref(
  '&copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> contributors',
);
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
let userIcon = null;
let isIconLoaded = false;

onMounted(async () => {
  if (process.client) {
    import("leaflet").then((Leaflet) => {
      userIcon = L.icon({
        iconUrl: "location-icon.ico",
        iconSize: [35, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });
      userLocationMarker.icon = userIcon;
    });
  }
  isIconLoaded = true;
});

const markerData = computed(() => {
  return props.coworkings.map((coworking) => {
    const regex = /POINT\(([^ ]+) ([^ ]+)\)/;
    const match = coworking.location.match(regex);
    const longitude = match ? parseFloat(match[1]) : 0;
    const latitude = match ? parseFloat(match[2]) : 0;
    const photoURL = coworking.coworking_photo
      ? `${baseURL}/${coworking.coworking_photo}`
      : "./default-coworking.png";
    const popupContent = `
        <div class="popup-content" style="text-align: center;">
            <a href="/coworking/${coworking.id}" target="_blank" style="word-wrap: break-word; text-decoration: none;">
                <img src="${photoURL}" alt="${coworking.coworking_name}" style="max-width: 100%; height: auto; display: block; margin: auto;" />
                <b style="display: block; margin-top: 5px; font-weight: bold; font-size: 130%;">${coworking.coworking_name}</b>
            </a>
            <p style="word-wrap: break-word;">
                <a href="https://www.google.com/maps?q=${encodeURIComponent(coworking.address)}" target="_blank">${coworking.address}</a>
            </p>
            <a href="mailto:${coworking.email}" style="word-wrap: break-word; display: block;">${coworking.email}</a>
            <a href="tel:${coworking.phone}" style="word-wrap: break-word;">${coworking.phone}</a>
        </div>
        `;

    return {
      id: coworking.id,
      latitude,
      longitude,
      popupContent,
    };
  });
});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        center.value = [position.coords.latitude, position.coords.longitude];
        userLocationMarker.latLng = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        if (map.value && map.value.leafletObject) {
          map.value.leafletObject.setView(center.value, zoom.value);
        }
        if (!userLocationMarker.icon) {
          if (isIconLoaded) {
            userLocationMarker.icon = userIcon;
          }
        }
      },
      (error) => {
        console.error(`Error getting user's location:`, error);
        userLocationMarker.latLng = null;
      },
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
    userLocationMarker.latLng = null;
  }
}
</script>

<style scoped>
.v-btn {
  color: var(--white-color);
  background-color: var(--header-bg);
  cursor: pointer;
  margin-right: 20px;
}

.v-btn:hover {
  background-color: var(--btn-border);
}
</style>
