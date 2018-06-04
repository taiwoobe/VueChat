<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style>
.headerBackground {
  height: 70px;
  background: Green;
  color: white;
  text-align: center;
  margin-top: -20px;
  margin-bottom: 20px;
}
.img-responsive {
    border-radius: 10%;
    margin: 0 auto;
    width: 400px;
}
.signUpLink {
    font-size: 13px;
    text-align: center;
    padding-top: 10px;
}
.btn-primary {
    padding: 8px 40px;
    margin: 0 auto;
    display: flex;
}
</style>
