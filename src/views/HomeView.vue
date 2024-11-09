<template>
  <Navbar />
  <v-layout class="d-flex justify-center h-100">
    <router-view />
  </v-layout>
</template>
<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
</script>