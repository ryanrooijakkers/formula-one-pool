<template>
  <div class="w-66 d-flex align-center flex-column">
    <div v-for="race in fetchedRaces" class="mb-6">
      <Race :race="race" :drivers="fetchedDrivers" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useApi } from '@/composables/useApi.ts';
import {
  Driver,
  JolpicaDataModel,
  RaceModel
} from '@/model/JolpicaData.model.ts';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where
} from 'firebase/firestore';
import { db } from '@/plugins/vuefire.ts';
import moment from 'moment';
import { useCollection } from 'vuefire';
import Race from '@/components/Race.vue';

const { f1DbApi } = useApi();

const fetchedRaces = ref<RaceModel[]>([]);
const fetchedDrivers = ref<Driver[]>([]);
const resultsToFetch = ref<string[]>([]);
const currentRoundIndex = ref<number>(0);

const getRaces = async () => {
  const currentYear = moment().year() + '';
  const documentQuery = query(
    collection(db, 'races'),
    where('season', '==', currentYear)
  );
  const docs = await getDocs(documentQuery);
  fetchedRaces.value = docs.docs
    .map((doc) => doc.data() as RaceModel)
    .sort((a, b) => Number(a.round) - Number(b.round));
  if (
    fetchedRaces.value.filter((race) => race.season === currentYear).length ===
    0
  ) {
    console.log('Fetching races from api');
    const response = await f1DbApi.get(`${currentYear}/races`);
    const data = response.data as JolpicaDataModel;
    fetchedRaces.value = data.MRData.RaceTable.Races;
    for (const race of fetchedRaces.value) {
      await setDoc(doc(db, 'races', `${race.raceName}-${race.season}`), race);
    }
  }
  const roundOfCompletedRaces = fetchedRaces.value
    .filter((race) => {
      return moment(race.date).isSameOrBefore(new Date());
    })
    .map((race) => race.round);
  resultsToFetch.value = useCollection(collection(db, 'results'))
    .value.map((document) => document.round)
    .filter((round) => !roundOfCompletedRaces.includes(round));
  console.log(`Fetching results for rounds ${resultsToFetch.value}`);
  getNextResult();
};

const getNextResult = () => {
  setTimeout(async () => {
    if (currentRoundIndex.value === resultsToFetch.value.length) {
      console.log('Done fetching results');
      return;
    }
    const response = await f1DbApi.get(
      `${moment().year()}/${resultsToFetch.value[currentRoundIndex.value]}/results`
    );
    const data = response.data as JolpicaDataModel;
    const race = data.MRData.RaceTable.Races[0];
    if (race) {
      await setDoc(doc(db, 'results', `${race.raceName}-${race.season}`), race);
    }
    currentRoundIndex.value += 1;
    getNextResult();
  }, 300);
};

const getDriversForSeason = async () => {
  const currentYear = moment().year();
  const documentQuery = query(
    collection(db, 'drivers'),
    where('season', '==', currentYear)
  );
  fetchedDrivers.value = (await getDocs(documentQuery)).docs.map(
    (d) => d.data() as Driver
  );
  if (
    fetchedDrivers.value.filter((driver) => driver.season === currentYear)
      .length === 0
  ) {
    console.log('Fetching drivers from api');
    const response = await f1DbApi.get(`${currentYear}/drivers`);
    const data = response.data as JolpicaDataModel;
    const drivers = data.MRData.DriverTable.Drivers;
    for (const driver of drivers) {
      await setDoc(doc(db, 'drivers', `${driver.driverId}-${currentYear}`), {
        ...driver,
        season: currentYear
      });
    }
    await getDriversForSeason();
  }
};

onMounted(async () => {
  await getRaces();
  await getDriversForSeason();
});
</script>
