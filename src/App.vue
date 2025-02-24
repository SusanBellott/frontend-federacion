<template>
  <div class="d-flex vh-100">
    <Nav />
    <div class="container-fluid mt-3 flex-grow-1 d-flex flex-column">
      <router-view class="flex-grow-1 overflow-auto"></router-view>
    </div>
  </div>
</template>


<script setup>
import { RouterView } from 'vue-router'
import Nav from './components/navbar/Navbar.vue'


</script>