<template>
  <div class="page d-flex flex-column-reverse align-center justify-center">
    <v-card class="mx-auto pa-12 pb-8 login-card" elevation="8" rounded="lg" :min-width="mdAndUp ? '16%' : '80%'">

      <p v-if="!loginIsValid" class="mb-4 text-red">Invalid username/password combination</p>

      <div class="text-subtitle-1 text-medium-emphasis">Account</div>
      <v-text-field
          v-model="email"
          density="compact"
          placeholder="Email"
          prepend-inner-icon="mdi-account-circle-outline"
          variant="outlined" />

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">Password</div>
      <v-text-field
          v-model="password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Enter your password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible" />

      <v-btn class="mb-8" color="blue" size="large" variant="tonal" @click="signIn" block>
        Log In
      </v-btn>
    </v-card>
  </div>
</template>
<script setup lang="ts">
import {ref} from "vue";
import {useFirebaseAuth} from "vuefire";
import {signInWithEmailAndPassword} from "@firebase/auth";
import {useRouter} from "vue-router";
import {useDisplay} from "vuetify";

const { mdAndUp } = useDisplay();

const auth = useFirebaseAuth();
const router = useRouter();

const email = ref<string>('')
const password = ref<string>('')
const visible = ref<boolean>(false);
const loginIsValid = ref<boolean>(true);

const signIn = () => {
  loginIsValid.value = true;
  signInWithEmailAndPassword(auth!, email.value, password.value).then(res => {
    console.log(res);
    router.push('home');
  }).catch((reason) => {
    loginIsValid.value = false;
    console.error('Failed sign in', reason);
  });
}

</script>
<style>
.page {
  height: 100%;
  background-color: #1a1a1a;
  background-image: url("login.png");
  background-size: cover;
  background-position: center;
}

.login-card {
  min-width: 16%;
}
</style>