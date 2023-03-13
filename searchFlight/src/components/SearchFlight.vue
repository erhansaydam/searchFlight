<template>
  <v-container fluid style="background-color: #063048">
    <v-toolbar dense flat class="transparent">
      <v-toolbar-title class="white--text">turkishairlines.com</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title class="white--text"
        ><small>search</small>Flight Challenge</v-toolbar-title
      >
    </v-toolbar>
    <v-divider class="blue lighten-4"></v-divider>
    <v-fade-transition mode="out-in">
      <v-row justify="center" class="h-100 mt-15">
        <div style="width: 1000px">
          <v-toolbar flat class="text-center transparent mb-8">
            <v-row justify="center" align="center">
              <v-col>
                <h1 class="text-h4 white--text font-weight-light">Merhaba</h1>
                <h1 class="text-h5 white--text font-weight-light">
                  Nereyi keşfetmek istersiniz?
                </h1>
              </v-col>
            </v-row>
          </v-toolbar>
          <v-card flat tile style="background-color: rgb(96 105 119 / 60%)">
            <v-card-text>
              <v-row dense>
                <v-col cols="3">
                  <v-select
                    filled
                    label="Nereden"
                    background-color="white"
                    :items="airports"
                    item-text="name"
                    item-value="code"
                    v-model="origin"
                    hide-details
                    prepend-inner-icon="mdi-airplane-takeoff"
                    single-line
                  >
                  </v-select>
                </v-col>
                <v-col cols="3">
                  <v-select
                    filled
                    label="Nereye"
                    background-color="white"
                    :items="airports"
                    item-text="name"
                    item-value="code"
                    v-model="destination"
                    hide-details
                    prepend-inner-icon="mdi-airplane-landing"
                    single-line
                  >
                  </v-select>
                </v-col>
                <v-col cols="3">
                  <v-menu
                    v-model="showDatePicker"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        filled
                        background-color="white"
                        v-model="date"
                        label="Tarih"
                        prepend-inner-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        hide-details
                        single-line
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date"
                      @input="showDatePicker = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="2">
                  <v-menu
                    v-model="showCountMenu"
                    :close-on-content-click="false"
                    :nudge-width="200"
                    offset-y
                    tile
                    nudge-bottom="10"
                    bottom
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="px-0"
                        style="background-color: rgba(13, 24, 44, 0.6)"
                        dark
                        depressed
                        block
                        height="56"
                        v-bind="attrs"
                        v-on="on"
                        ><v-badge
                          tile
                          color="#0D182C00"
                          :content="personCount"
                          dark
                          overlap
                          offset-x="-20"
                        >
                          <template v-if="personCount < 4">
                            <v-icon
                              v-for="i in personCount"
                              :key="i"
                              large
                              color="blue-grey lighten-2"
                              :style="{ opacity: 0.5 / i + 0.5 }"
                              style="margin: 0 -12px"
                              >mdi-human-male</v-icon
                            >
                          </template>
                          <template v-else>
                            <v-icon
                              v-for="i in 3"
                              :key="i"
                              large
                              color="blue-grey lighten-2"
                              style="margin: 0 -12px"
                              :style="{ opacity: 0.5 / i + 0.5 }"
                              >mdi-human-male</v-icon
                            ><v-icon
                              small
                              color="blue-grey lighten-2"
                              style="opacity: 0.7"
                              >mdi-plus</v-icon
                            >
                          </template>
                        </v-badge>
                      </v-btn>
                    </template>

                    <v-card tile>
                      <v-card-title>Kabin ve Yolcu Seçimi</v-card-title>

                      <v-card-text>
                        <v-radio-group row dense v-model="selectedClass">
                          <v-radio
                            value="ECONOMY"
                            label="Economy Class"
                          ></v-radio>
                          <v-radio
                            value="BUSINESS"
                            label="Business Class"
                          ></v-radio>
                        </v-radio-group>
                        <v-row>
                          <v-col cols="auto">Yolcu</v-col>
                          <v-spacer></v-spacer>
                          <v-col cols="auto">
                            <v-btn
                              small
                              class="px-0"
                              depressed
                              color="grey lighten-2"
                              @click="decreasePersonCount()"
                              tile
                            >
                              <v-icon>mdi-minus</v-icon>
                            </v-btn>
                            <span class="mx-4">{{ personCount }}</span>
                            <v-btn
                              small
                              depressed
                              color="grey lighten-3"
                              @click="personCount++"
                              tile
                            >
                              <v-icon>mdi-plus</v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-menu>
                </v-col>
                <v-col cols="1">
                  <v-btn
                    :disabled="!showSearchButton"
                    @click="search()"
                    class="px-0"
                    style="background-color: #e81933"
                    dark
                    depressed
                    block
                    height="56"
                  >
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row class="mt-10" v-if="savedFlights !== null">
                <v-col>
                  <v-expansion-panels flat>
                    <v-expansion-panel>
                      <v-expansion-panel-header color="blue-grey lighten-5">
                        <span
                          ><v-icon class="mr-3">mdi-airplane-clock</v-icon>Daha
                          önce satın aldığım uçuşlar</span
                        ></v-expansion-panel-header
                      >
                      <v-expansion-panel-content>
                        <v-simple-table>
                          <template v-slot:default>
                            <thead>
                              <tr>
                                <th class="text-left">Uçuş Bilgileri</th>
                                <th class="text-center">Kalkış Saati</th>
                                <th class="text-center">Varış Saati</th>
                                <th class="text-right">Ücret (Yolcu Başına)</th>
                                <th class="text-center">Promosyon</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="item in savedFlights" :key="item.name">
                                <td>{{ item.summary }}</td>
                                <td class="text-center">
                                  {{ item.arrivalDateTimeDisplay }}
                                </td>
                                <td class="text-center">
                                  {{ item.departureDateTimeDisplay }}
                                </td>
                                <td class="text-right font-weight-bold">
                                  {{ item.price }}
                                </td>
                                <td class="text-center">
                                  <v-icon color="success" v-if="item.hasCode"
                                    >mdi-check</v-icon
                                  >
                                </td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>
      </v-row>
    </v-fade-transition>
  </v-container>
</template>

<script>
export default {
  name: "SearchFlight",
  props: {
    flights: Array,
  },
  computed: {
    summary() {
      let obj = {};
      obj.origin = this.airports.filter((a) => a.code === this.origin)[0].name;
      obj.destination = this.airports.filter(
        (a) => a.code === this.destination
      )[0].name;
      obj.personCount = this.personCount;
      return obj;
    },
    showSearchButton() {
      return this.origin !== null && this.destination !== null;
    },
  },
  data: () => ({
    airports: [
      { name: "Ankara", code: "ESB" },
      { name: "Antalya", code: "AYT" },
      { name: "Istanbul", code: "IST" },
      { name: "Izmir", code: "ADB" },
    ],
    origin: null,
    destination: null,
    personCount: 1,
    date: null,
    showDatePicker: false,
    showCountMenu: false,
    availableFlights: null,
    selectedClass: null,
    savedFlights: null,
  }),
  methods: {
    decreasePersonCount() {
      if (this.personCount > 1) {
        this.personCount--;
      }
    },
    search() {
      if (this.origin !== null && this.destination !== null) {
        this.availableFlights = this.flights.filter((f) => {
          if (
            this.origin === f.originAirport.code &&
            this.destination === f.destinationAirport.code
          ) {
            return true;
          }
        });
      }
      if (this.availableFlights.length > 0) {
        this.$emit("flightsSearched", this.availableFlights, this.summary);
      }
    },
  },
  created() {
    if (localStorage.getItem("savedFlights") !== null) {
      this.savedFlights = JSON.parse(localStorage.getItem("savedFlights"));
    }
  },
};
</script>
