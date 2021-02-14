<template>
  <section class="app__section">
    <header class="app__header">
      Customized theme
    </header>
    <figure>
      <audio
        @durationchange="handleDurationChange"
        @timeupdate="handleTimeUpdate"
        @loadedmetadata="handleMetaDataLoaded"
        src="https://freesound.org/data/previews/556/556602_1954411-lq.mp3"
        ref="media"
        preload="metadata">
      </audio>
      <button
        @click="$refs.media.paused ? $refs.media.play() : $refs.media.pause()"
        class="play-button">
        <svg
          v-if="$refs.media && !$refs.media.paused"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="48px"
          height="48px"
          style="cursor: pointer;">
          <path
            fill-rule="evenodd"
            d="M24 12c0 3.1826-1.2643 6.2349-3.5146 8.4854C18.2349 22.7357 15.1826 24 12 24s-6.23484-1.2643-8.48528-3.5146C1.26428 18.2349 0 15.1826 0 12s1.26428-6.23484 3.51472-8.48528C5.76516 1.26428 8.8174 0 12 0s6.2349 1.26428 8.4854 3.51472C22.7357 5.76516 24 8.8174 24 12zM7.5 9c0-.39783.15804-.77935.43934-1.06066C8.22065 7.65804 8.60217 7.5 9 7.5c.39783 0 .77935.15804 1.0607.43934.2813.28131.4393.66283.4393 1.06066v6c0 .3978-.158.7794-.4393 1.0606-.28135.2813-.66287.4394-1.0607.4394s-.77935-.1581-1.06066-.4394C7.65804 15.7794 7.5 15.3978 7.5 15V9zM15 7.5c-.3978 0-.7794.15804-1.0607.43934C13.658 8.22065 13.5 8.60217 13.5 9v6c0 .3978.158.7794.4393 1.0606.2813.2813.6629.4394 1.0607.4394.3978 0 .7794-.1581 1.0606-.4394.2813-.2812.4394-.6628.4394-1.0606V9c0-.39783-.1581-.77935-.4394-1.06066C15.7794 7.65804 15.3978 7.5 15 7.5z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="48px"
          height="48px"
          style="cursor: pointer;">
          <path
            fill-rule="evenodd"
            d="M12 24c3.1825 0 6.2349-1.2643 8.4854-3.5146C22.7357 18.2349 24 15.1825 24 12c0-3.1826-1.2643-6.23484-3.5146-8.48528C18.2349 1.26428 15.1825 0 12 0 8.8174 0 5.76516 1.26428 3.51472 3.51472 1.26428 5.76516 0 8.8174 0 12c0 3.1825 1.26428 6.2349 3.51472 8.4854C5.76516 22.7357 8.8174 24 12 24zm-.6675-16.248c-.2259-.15072-.4885-.23729-.7597-.25046-.2713-.01318-.541.04754-.78045.17566-.23945.12811-.43961.31882-.57916.55178C9.07363 8.46195 8.99995 8.72844 9 9v6c-.00005.2715.07363.538.21319.771.13955.2329.33971.4237.57916.5518.23945.1281.50915.1889.78045.1757.2712-.0132.5338-.0998.7597-.2505l4.5-3c.2055-.137.3739-.3226.4903-.5403.1166-.2177.1775-.4608.1775-.7077s-.0609-.49-.1775-.7077c-.1164-.2177-.2848-.4033-.4903-.5403l-4.5-3z"
          />
        </svg>
      </button>
      <Vtrim
        @trim-start="trim => handleTrim('start', trim)"
        @trim-end="trim => handleTrim('end', trim)"
        @seek="handleSeek"
        :color="'blueviolet'"
        :currentTime="currentTime"
        :mediaDuration="mediaDuration"
        :formatTime="handleFormatTime"
        :timePrecision="2"
        :defaultTrim="{ start: 6, end: 25 }">
        <template #progress="{ currentRightPosition }">
          <div style="
            height: 24px;
            width: 100%;
            background: linear-gradient(90deg, rgba(106,0,223,1) 0%, rgba(195,70,70,1) 41%, rgba(19,170,154,1) 100%);
            border-radius: 15px;">
          </div>
          <div :style="{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: `${currentRightPosition}%`,
            height: '12px',
            background: 'lavender',
            transform: 'translateY(-50%)',
            borderRadius: '12px',
            transition: 'all .5s ease-out'
          }">
        </div>
        </template>
        <template #start-trim>
          <span style="cursor: pointer;">🎾</span>
        </template>
        <template #end-trim>
          <span style="cursor: pointer;">🎾</span>
        </template>
        <template #timeline="{ startLeftPosition, endRightPosition }">
          <div :style="{
            position: 'absolute',
            background: 'lavender',
            height: '24px',
            right: `${endRightPosition}%`,
            left: `${startLeftPosition}%`,
          }">
          </div>
        </template>
        <template #timeline-playing="{ startLeftPosition, currentRightPosition }">
          <div :style="{
            position: 'absolute',
            'background-color': 'cornflowerblue',
            height: '24px',
            left: `${startLeftPosition}%`,
            right: `${currentRightPosition}%`,
          }">
          </div>
        </template>
      </Vtrim>
    </figure>
  </section>
</template>

<script>

import Vtrim      from './Vtrim.vue';


export default {
  name: 'CustomizedExample',
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
    handleFormatTime(rawTime) {
      return `⚡${rawTime}⚡`;
    },
  }
}
</script>

<style>

</style>