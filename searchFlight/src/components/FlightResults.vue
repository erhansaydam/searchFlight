<template>
  <v-container fluid>
    <v-toolbar dense flat class="transparent">
      <v-toolbar-title>turkishairlines.com</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title><small>search</small>Flight Challenge</v-toolbar-title>
    </v-toolbar>
    <v-divider class="grey"></v-divider>
    <v-fade-transition mode="out-in">
      <div
        class="mx-auto mt-5"
        style="width: 1080px"
        v-if="selectedPackage === null"
      >
        <v-card-text class="pa-0">
          <v-row class="mb-2">
            <v-col>
              <v-btn
                width="150"
                color="red"
                dark
                depressed
                @click="resetSelection()"
                tile
                style="background-color: #e81932"
                class="text-capitalize text-subtitle-1 font-weight-medium"
                >Uçuş
              </v-btn>
            </v-col>
          </v-row>
          <p class="text-h4">
            {{ summary.origin }} - {{ summary.destination }},
            {{ summary.personCount }} Yolcu
          </p>
          <h3>
            Promosyon Kodu
            <v-switch
              inset
              class="ml-3 d-inline-block"
              v-model="hasCode"
            ></v-switch>
          </h3>
          <template v-if="hasCode && selectedType">
            <p>
              Promosyon Kodu seçeneği ile tüm
              <span class="text-capitalize">{{ selectedType }}</span>
              kabini Eco Fly paketlerini %50 indirimle satın alabilirsiniz!
            </p>
            <p>
              Promosyon kodu seçeneği aktifken Eco Fly paketi haricinde seçim
              yapılamamaktadır.
            </p>
          </template>
        </v-card-text>

        <v-card outlined style="background-color: #f9f9f9">
          <v-toolbar
            flat
            dense
            class="white--text"
            style="background-color: #242a38"
          >
            <v-spacer></v-spacer>
            <small>Sıralama Kriteri:</small>
            <v-btn
              :disabled="ordering === 'price'"
              @click="ordering = 'price'"
              class="mx-2 text-capitalize"
              small
              dark
              outlined
              >Ekonomi Ücreti</v-btn
            >
            <v-btn
              :disabled="ordering === 'time'"
              @click="ordering = 'time'"
              class="text-capitalize"
              small
              dark
              outlined
              >Kalkış Saati</v-btn
            >
          </v-toolbar>
          <v-card-text v-if="orderedResults.length === 0" class="pa-10">
            <h3 class="text-center">Belirtilen kriterlerde uçuş bulunamadı</h3>
            <v-divider class="my-8"></v-divider>
            <v-row>
              <v-spacer></v-spacer>
              <v-col cols="auto">
                <v-btn
                  color="red"
                  dark
                  @click="resetSelection()"
                  tile
                  style="background-color: #e81932"
                  class="text-capitalize text-subtitle-1 font-weight-medium"
                  >Başa Dön</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text v-else>
            <v-row v-for="(r, index) in orderedResults" dense :key="index">
              <v-col cols="6" class="d-flex flex-column">
                <v-card tile elevation="3" class="flex d-flex flex-column">
                  <v-card-text>
                    <v-row class="d-flex" no-gutters>
                      <v-col cols="auto">
                        <div>
                          <strong>{{ r.arrivalDateTimeDisplay }}</strong>
                        </div>
                        <div>{{ r.originAirport.code }}</div>
                        <div>
                          <small>{{ r.originAirport.city.name }}</small>
                        </div>
                      </v-col>
                      <v-col cols="6" class="align-self-center"
                        ><v-divider class="black"></v-divider
                      ></v-col>
                      <v-col cols="2">
                        <div class="text-right">
                          <strong>{{ r.departureDateTimeDisplay }}</strong>
                        </div>
                        <div class="text-right">
                          {{ r.destinationAirport.code }}
                        </div>
                        <div class="text-right">
                          <small>{{ r.destinationAirport.city.name }}</small>
                        </div>
                      </v-col>
                      <v-col class="align-self-center">
                        <div class="text-center">
                          <small>Uçuş Süresi</small>
                        </div>
                        <div class="text-center">
                          <strong>{{ r.flightDuration }}</strong>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="3" class="d-flex flex-column">
                <v-card
                  tile
                  :elevation="getElevation(index, 'ECONOMY')"
                  @click="selectFlight(index, 'ECONOMY')"
                  class="flex d-flex"
                >
                  <v-card-text class="align-self-center pa-2">
                    <v-row class="d-flex" no-gutters>
                      <v-col cols="auto" class="align-self-center">
                        <span>
                          <v-icon
                            small
                            v-if="connectorVisible(index, 'ECONOMY')"
                            >mdi-radiobox-marked</v-icon
                          >
                          <v-icon small v-else>mdi-radiobox-blank</v-icon>
                          ECONOMY</span
                        >
                      </v-col>
                      <v-col cols="5" class="align-self-center">
                        <div class="text-center">
                          <small>Yolcu Başına</small>
                        </div>
                        <div class="text-center">
                          <strong
                            >{{
                              r.fareCategories.ECONOMY.subcategories[0].price
                                .currency
                            }}
                            {{
                              r.fareCategories.ECONOMY.subcategories[0].price
                                .amount
                            }}</strong
                          >
                        </div>
                      </v-col>
                      <v-spacer></v-spacer>
                      <v-col cols="auto" class="align-self-center text-center">
                        <v-icon v-if="connectorVisible(index, 'ECONOMY')"
                          >mdi-chevron-up</v-icon
                        >
                        <v-icon v-else>mdi-chevron-down</v-icon>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
                <v-card
                  v-if="connectorVisible(index, 'ECONOMY')"
                  tile
                  flat
                  height="50"
                  style="margin-bottom: -50px"
                ></v-card>
              </v-col>
              <v-col cols="3" class="d-flex flex-column">
                <v-card
                  tile
                  :elevation="getElevation(index, 'BUSINESS')"
                  @click="selectFlight(index, 'BUSINESS')"
                  class="flex d-flex"
                >
                  <v-card-text class="align-self-center pa-2">
                    <v-row class="d-flex" no-gutters>
                      <v-col cols="auto" class="align-self-center">
                        <span>
                          <v-icon
                            small
                            v-if="connectorVisible(index, 'BUSINESS')"
                            >mdi-radiobox-marked</v-icon
                          >
                          <v-icon small v-else>mdi-radiobox-blank</v-icon>
                          BUSINESS</span
                        >
                      </v-col>
                      <v-col cols="5" class="align-self-center">
                        <div class="text-center">
                          <small>Yolcu Başına</small>
                        </div>
                        <div class="text-center">
                          <strong
                            >{{
                              r.fareCategories.BUSINESS.subcategories[0].price
                                .currency
                            }}
                            {{
                              r.fareCategories.BUSINESS.subcategories[0].price
                                .amount
                            }}</strong
                          >
                        </div>
                      </v-col>
                      <v-spacer></v-spacer>

                      <v-col cols="auto" class="align-self-center text-center">
                        <v-icon v-if="connectorVisible(index, 'BUSINESS')"
                          >mdi-chevron-up</v-icon
                        >
                        <v-icon v-else>mdi-chevron-down</v-icon>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
                <v-card
                  v-if="connectorVisible(index, 'BUSINESS')"
                  tile
                  flat
                  height="50"
                  style="margin-bottom: -50px"
                ></v-card>
              </v-col>
              <v-col cols="12" v-if="selectedIndex === index">
                <v-card flat class="pa-3">
                  <v-row dense>
                    <v-col
                      class="d-flex flex-column"
                      v-for="(p, j) in orderedResults[index].fareCategories[
                        selectedType
                      ].subcategories"
                      :key="j"
                    >
                      <v-card
                        :disabled="getDisabled(p.brandCode)"
                        outlined
                        flat
                        class="flex flex-column"
                        style="min-height: 250px"
                      >
                        <v-toolbar flat style="background-color: #f4f5f9">
                          <v-toolbar-title class="text-h6">{{
                            p.brandCode
                          }}</v-toolbar-title>
                          <v-spacer></v-spacer>
                          <sup
                            ><strong>{{ p.price.currency }}</strong></sup
                          >
                          <span class="text-h6 ml-1">{{
                            getPrice(p.brandCode, p.price.amount)
                          }}</span>
                        </v-toolbar>
                        <v-list dense class="pa-0">
                          <template v-for="(r, k) in p.rights">
                            <v-list-item :key="k">
                              {{ r }}
                            </v-list-item>
                            <v-divider :key="k + 100"></v-divider>
                          </template>
                        </v-list>
                      </v-card>
                      <v-card flat :disabled="getDisabled(p.brandCode)">
                        <v-btn
                          @click="selectPackage(j)"
                          class="text-capitalize text-subtitle-1 font-weight-medium"
                          style="background-color: #e81932"
                          block
                          depressed
                          tile
                          dark
                          >Uçuşu Seç</v-btn
                        >
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>
      <div class="mx-auto mt-15" style="width: 800px" v-else>
        <div v-if="selectedPackage.status === 'AVAILABLE'">
          <div>
            <v-icon color="success" large class="mr-4"
              >mdi-check-circle
            </v-icon>
            <span class="text-h6">Kabin seçiminiz tamamlandı.</span>
          </div>
          <v-divider class="my-8"></v-divider>
          <v-row>
            <v-col cols="auto"><span class="text-h5">Toplam Tutar</span></v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto"
              ><span class="text-h5 blue--text"
                >{{ selectedPackage.price.currency }}
                {{ selectedPackage.price.amount }}</span
              ></v-col
            >
          </v-row>
          <v-divider class="my-8"></v-divider>
          <v-row>
            <v-spacer></v-spacer>
            <v-col cols="auto">
              <v-btn
                color="red"
                dark
                @click="subIndex = null"
                tile
                style="background-color: #e81932"
                class="text-capitalize text-subtitle-1 font-weight-medium"
                ><v-icon left>mdi-chevron-left</v-icon>Geri Dön</v-btn
              >
            </v-col>
          </v-row>
        </div>
        <div v-else>
          <div>
            <v-icon color="error" large class="mr-4">mdi-close-circle </v-icon>
            <span class="text-h6">Kabin seçiminiz tamamlanamadı.</span>
          </div>
          <v-divider class="my-8"></v-divider>
          <v-row>
            <v-spacer></v-spacer>
            <v-col cols="auto">
              <v-btn
                color="red"
                dark
                @click="subIndex = null"
                tile
                style="background-color: #e81932"
                class="text-capitalize text-subtitle-1 font-weight-medium"
                >Başa Dön</v-btn
              >
            </v-col>
          </v-row>
        </div>
      </div>
    </v-fade-transition>
  </v-container>
</template>

<script>
export default {
  name: "FlightResults",
  props: {
    results: Array,
    summary: Object,
  },
  computed: {
    orderedResults() {
      let tmp = JSON.parse(JSON.stringify(this.results));
      if (this.ordering === "price") {
        let orderedResults = tmp.sort(function (a, b) {
          return (
            parseFloat(
              a.fareCategories.ECONOMY.subcategories.filter(
                (p) => p.brandCode === "ecoFly"
              )[0].price.amount
            ) -
            parseFloat(
              b.fareCategories.ECONOMY.subcategories.filter(
                (p) => p.brandCode === "ecoFly"
              )[0].price.amount
            )
          );
        });
        return orderedResults;
      }
      return this.results;
    },
    selectedPackage() {
      if (
        this.selectedIndex !== null &&
        this.selectedType !== null &&
        this.subIndex !== null
      ) {
        const packet =
          this.orderedResults[this.selectedIndex].fareCategories[
            this.selectedType
          ].subcategories[this.subIndex];
        return packet;
      }
      return null;
    },
  },
  data: () => ({
    selectedIndex: null,
    selectedType: null,
    subIndex: null,
    hasCode: false,
    ordering: "price",
  }),
  methods: {
    resetSelection() {
      this.selectedIndex = this.selectedType = this.subIndex = null;
      this.hasCode = false;
      this.$emit("reset");
    },
    selectFlight(index, type) {
      if (this.selectedIndex === index && this.selectedType === type) {
        this.selectedIndex = this.selectedType = this.subIndex = null;
      } else {
        this.selectedIndex = index;
        this.selectedType = type;
      }
    },
    getElevation(index, type) {
      return this.selectedIndex === index && this.selectedType === type ? 0 : 2;
    },
    connectorVisible(index, type) {
      return this.selectedIndex === index && this.selectedType === type;
    },
    getDisabled(brandCode) {
      return this.hasCode && brandCode !== "ecoFly";
    },
    getPrice(brandCode, amount) {
      return this.hasCode && brandCode === "ecoFly" ? amount / 2 : amount;
    },
    selectPackage(subindex) {
      this.subIndex = subindex;
      if (this.selectedPackage.status === "AVAILABLE") {
        let savedFlight = {};
        savedFlight.summary = `${this.summary.origin} - ${this.summary.destination}, ${this.summary.personCount} Yolcu`;
        savedFlight.arrivalDateTimeDisplay =
          this.orderedResults[this.selectedIndex].arrivalDateTimeDisplay;
        savedFlight.departureDateTimeDisplay =
          this.orderedResults[this.selectedIndex].departureDateTimeDisplay;
        savedFlight.price = `${this.selectedPackage.price.currency} ${this.selectedPackage.price.amount}`;
        savedFlight.hasCode = this.hasCode;
        let savedFlights = [];
        if (localStorage.getItem("savedFlights") !== null) {
          savedFlights = JSON.parse(localStorage.getItem("savedFlights"));
        }
        savedFlights.push(savedFlight);
        localStorage.setItem("savedFlights", JSON.stringify(savedFlights));
      }
    },
  },
  watch: {
    ordering() {
      this.selectedIndex = null;
    },
  },
};
</script>
