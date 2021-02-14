<template>
  <section class="app__section">
    <header class="app__header">
      Video example
    </header>
    <figure class="figure--video">
      <video
        @click="$refs.media.paused ? $refs.media.play() : $refs.media.pause()"
        @durationchange="handleDurationChange"
        @timeupdate="handleTimeUpdate"
        @loadedmetadata="handleMetaDataLoaded"
        ref="media"
        preload="metadata"
        src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4">
      </video>
      <Vtrim
        @trim-start="trim => handleTrim('start', trim)"
        @trim-end="trim => handleTrim('end', trim)"
        @seek="handleSeek"
        :color="'blueviolet'"
        :currentTime="currentTime"
        :mediaDuration="mediaDuration"
        :timePrecision="2"
        :defaultTrim="{ start: 27.46, end: 102.58 }"
        restrictSeeking>
      </Vtrim>
    </figure>
  </section>
</template>

<script>

import Vtrim      from './Vtrim.vue';


export default {
  name: 'VideoExample',
  components: { Vtrim },
  data: () => ({
    currentTime: 0,
    mediaDuration: 0,
    trimStart: 0,
    trimEnd: 0,
  }),
  methods: {
    handleMetaDataLoaded() {
      this.mediaDuration = this.$refs.media.duration;
      this.currentTime = Math.max(0, this.trimStart);
    },
    handleDurationChange() {
      this.mediaDuration = this.$refs.media.duration;
    },
    handleTimeUpdate() {
      this.currentTime = this.$refs.media.currentTime;
    },
    handleTrim(position, trim) {
      if (position === 'start') this.trimStart = trim;
      if (position === 'end') this.trimEnd = trim;
    },
    handleSeek(seekTime) {
      this.$refs.media.currentTime = seekTime;
      this.currentTime = seekTime;
    },
  }
}
</script>

<style>

</style>