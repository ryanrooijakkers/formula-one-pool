<template>
  <div class="d-flex flex-column align-center">
    <p>{{ race.raceName }}</p>
    <div v-for="(top, index) in topThree">
      <p>Number: {{ index + 1 }} {{ top }}</p>
    </div>
    <p>Fastest driver {{ fastestDriver }}</p>
  </div>
</template>
<script setup lang="ts">
import { RaceModel, Result } from '@/model/JolpicaData.model.ts';
import { onMounted, ref } from 'vue';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/plugins/vuefire.ts';

const props = defineProps({
  race: { default: null, type: RaceModel }
});

const raceResults = ref<Result[]>([]);
const topThree = ref<string[]>([]);
const fastestDriver = ref<string>('');

const getResultForRace = async () => {
  const docId = `${props.race?.raceName}-${props.race?.season}`;
  const resultDoc = await getDoc(doc(db, 'results', docId));
  const results = resultDoc.data()?.Results as Result[];
  if (results) {
    raceResults.value = results.sort(
      (a, b) => Number(a.position) - Number(b.position)
    );
    topThree.value = raceResults.value
      .slice(0, 3)
      .map(
        (result) => `${result.Driver.givenName} ${result.Driver.familyName}`
      );
    console.log(raceResults.value);
    const fastestResult = raceResults.value
      .sort((a, b) => Number(a.FastestLap?.rank) - Number(b.FastestLap?.rank))
      .slice(0, 1)[0];
    if (fastestResult) {
      fastestDriver.value = `${fastestResult.Driver.givenName} ${fastestResult.Driver.familyName}`;
    }
  }
};

onMounted(async () => {
  await getResultForRace();
});
</script>
