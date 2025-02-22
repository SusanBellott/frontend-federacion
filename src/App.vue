<template>
  <Nav></Nav>
  <div class="container-fluid mt-3">
    <router-view></router-view>
  </div>
</template>
<script setup>
import { RouterView } from 'vue-router'
import Nav from './components/navbar/Navbar.vue'


</script>