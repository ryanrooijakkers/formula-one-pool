<template>
  <v-card min-width="600">
    <v-card-title>
      <p>
        {{ race.Circuit.circuitName }} ({{ race.Circuit.Location.country }})
      </p>
    </v-card-title>
    <v-card-text>
      <div class="d-flex justify-space-between">
        <div v-if="topThree.length > 0">
          <div v-for="(top, index) in topThree">
            <v-card-item
              class="d-flex align-center pa-1"
              :class="getIconForIndex(index).class"
              :prepend-icon="getIconForIndex(index).icon">
              {{ top }}
            </v-card-item>
          </div>
          <v-card-item
            class="d-flex align-center mt-4 pa-1"
            prepend-icon="mdi-flag-checkered">
            Fastest lap by: {{ fastestDriver }}
          </v-card-item>
        </div>
        <div v-else>
          <v-form>
            <p>First place guess</p>
            <v-autocomplete
              v-model="firstPlaceGuess"
              @update:model-value="updateDocument"
              class="mb-2"
              :items="drivers"
              :item-title="
                (item: Driver) => `${item.givenName} ${item.familyName}`
              "
              :item-value="(item: Driver) => item"
              min-width="300"
              density="compact"
              hide-details>
              <template #prepend-inner>
                <v-icon icon="mdi-podium-gold" color="amber" />
              </template>
            </v-autocomplete>
            <p>Second place guess</p>
            <v-autocomplete
              v-model="secondPlaceGuess"
              @update:model-value="updateDocument"
              class="mb-2"
              :items="drivers"
              :item-title="
                (item: Driver) => `${item.givenName} ${item.familyName}`
              "
              :item-value="(item: Driver) => item"
              min-width="300"
              density="compact"
              hide-details>
              <template #prepend-inner>
                <v-icon icon="mdi-podium-silver" color="teal-lighten-5" />
              </template>
            </v-autocomplete>
            <p>Third place guess</p>
            <v-autocomplete
              v-model="thirdPlaceGuess"
              @update:model-value="updateDocument"
              class="mb-2"
              :items="drivers"
              :item-title="
                (item: Driver) => `${item.givenName} ${item.familyName}`
              "
              :item-value="(item: Driver) => item"
              min-width="300"
              density="compact"
              hide-details>
              <template #prepend-inner>
                <v-icon icon="mdi-podium-bronze" class="text-brown-custom" />
              </template>
            </v-autocomplete>
            <p>Fastest lap guess</p>
            <v-autocomplete
              v-model="fastestLapGuess"
              @update:model-value="updateDocument"
              class="mb-2"
              :items="drivers"
              :item-title="
                (item: Driver) => `${item.givenName} ${item.familyName}`
              "
              :item-value="(item: Driver) => item"
              min-width="300"
              density="compact"
              hide-details>
              <template #prepend-inner>
                <v-icon icon="mdi-flag-checkered" />
              </template>
            </v-autocomplete>
          </v-form>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import { Driver, RaceModel, Result } from '@/model/JolpicaData.model.ts';
import { onMounted, ref } from 'vue';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/plugins/vuefire.ts';
import { useCurrentUser } from 'vuefire';

const user = useCurrentUser();
const props = defineProps({
  race: { default: null, type: RaceModel },
  drivers: { default: [], type: Array<Driver> }
});

const raceResults = ref<Result[]>([]);
const topThree = ref<string[]>([]);
const fastestDriver = ref<string>('');

const firstPlaceGuess = ref<Driver>();
const secondPlaceGuess = ref<Driver>();
const thirdPlaceGuess = ref<Driver>();
const fastestLapGuess = ref<Driver>();

const getIconForIndex = (index: number) => {
  switch (index) {
    case 0:
      return { icon: 'mdi-podium-gold', class: 'text-amber' };
    case 1:
      return { icon: 'mdi-podium-silver', class: 'text-teal-lighten-5' };
    default:
      return { icon: 'mdi-podium-bronze', class: 'text-brown-custom' };
  }
};

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
    const fastestResult = raceResults.value
      .sort((a, b) => Number(a.FastestLap?.rank) - Number(b.FastestLap?.rank))
      .slice(0, 1)[0];
    if (fastestResult) {
      fastestDriver.value = `${fastestResult.Driver.givenName} ${fastestResult.Driver.familyName}`;
    }
  }
};

const updateDocument = async () => {
  await setDoc(
    doc(
      db,
      'predictions',
      `${props.race.raceName}-${props.race.season}-${user.value?.uid}`
    ),
    {
      race: props.race,
      userId: user.value?.uid,
      firstPlaceGuess: firstPlaceGuess.value || null,
      secondPlaceGuess: secondPlaceGuess.value || null,
      thirdPlaceGuess: thirdPlaceGuess.value || null,
      fastestLapGuess: fastestLapGuess.value || null
    }
  );
};

const getStoredPredictionForRace = async () => {
  const storedPrediction = await getDoc(
    doc(
      db,
      'predictions',
      `${props.race.raceName}-${props.race.season}-${user.value?.uid}`
    )
  );
  if (storedPrediction) {
    firstPlaceGuess.value = storedPrediction.data()?.firstPlaceGuess as Driver;
    secondPlaceGuess.value = storedPrediction.data()
      ?.secondPlaceGuess as Driver;
    thirdPlaceGuess.value = storedPrediction.data()?.thirdPlaceGuess as Driver;
    fastestLapGuess.value = storedPrediction.data()?.fastestLapGuess as Driver;
  }
};

onMounted(async () => {
  await getResultForRace();
  await getStoredPredictionForRace();
});
</script>
<style>
.text-brown-custom {
  color: #a13e3e;
}
</style>
