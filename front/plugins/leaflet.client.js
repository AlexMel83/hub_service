import Vue from "vue";
import { LMap, LTileLayer, LMarker, LPopup, LPolyline } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
    Vue.component("l-map", LMap);
    Vue.component("l-tile-layer", LTileLayer);
    Vue.component("l-marker", LMarker);
    Vue.component("l-popup", LPopup);
    Vue.component("l-polyline", LPolyline);
})


