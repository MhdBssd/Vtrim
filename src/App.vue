<template>
  <div id="app">
    <DefaultExample></DefaultExample>
    <CustomizedExample></CustomizedExample>
    <VideoExample></VideoExample>
  </div>
</template>

<script>

import DefaultExample         from './components/DefaultExample.vue';
import CustomizedExample      from './components/CustomizedExample.vue';
import VideoExample           from './components/VideoExample.vue';


export default {
  name: 'App',
  components: {
    DefaultExample,
    CustomizedExample,
    VideoExample,
  },
}

</script>

<style>

html, body, #app {
  background-color: hsl(222deg 25% 6%);
  margin: 0;
}

#app {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 1000px;
  margin: 0 auto;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

figure {
  position: relative;
  display: flex;
  align-items: center;
  padding: 2rem;
}

figure, video {
  border-radius: 15px;
  margin: 0;
}

video {
  min-width: 100%;
  max-width: 100%;
  margin-bottom: 3rem;
}

.figure--video {
  display: flex;
  flex-direction: column;
}

.app__section {
  display: flex;
  flex-direction: column;
  padding: 4rem 0;
  margin: 0 2rem;
}

.app__section:last-child {
  margin-bottom: 6rem;
}

.app__header {
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 600;
  color: white;
}

.play-button {
  margin-right: 2rem;
  border: none;
  fill: lavenderblush;
  background-color: transparent;
}

</style>
