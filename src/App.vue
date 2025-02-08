<template>
  <div id="app"><router-view /></div>
  
</template>
<script>
export default {
  name : "App",
  created() {
    const usuarioLogeado = localStorage.getItem('usuarioLogeado');
    if (usuarioLogeado) {
      this.$store.dispatch('login', { id: usuarioLogeado });
    }
  }
}
</script>


<style>
@import './assets/styles.css';

</style>
