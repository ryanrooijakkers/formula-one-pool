<template>
  <v-responsive class="border rounded app">
    <v-app>
      <v-main>
        <router-view />
      </v-main>
    </v-app>
  </v-responsive>
</template>
<script setup lang="ts">
</script>

<style>
.app {
  max-height: 100vh;
}
</style>