<template>
  <v-app>
    <v-main>
      <flight-results
        v-if="showResults"
        :results="availableFlights"
        :summary="summary"
        @reset="reset()"
      ></flight-results>
      <search-flight
        v-else
        :flights="flights"
        @flightsSearched="flightsSearched"
      ></search-flight>
    </v-main>
  </v-app>
</template>

<script>
import flights from "@/assets/json/flights.json";

import SearchFlight from "@/components/SearchFlight.vue";
import FlightResults from "@/components/FlightResults.vue";

export default {
  name: "App",
  components: { FlightResults, SearchFlight },

  data: () => ({
    flights: [],
    credentials: {},
    loading: false,
    show: false,
    availableFlights: null,
    showResults: false,
    summary: null,
  }),
  methods: {
    reset() {
      this.showResults = false;
    },
    flightsSearched(list, summary) {
      this.availableFlights = list;
      this.summary = summary;
      this.showResults = true;
    },
  },
  created() {
    this.flights = flights.flights;
  },
};
</script>
