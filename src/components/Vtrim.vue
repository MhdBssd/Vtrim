<template>
  <div class="vtrim__wrapper">
    <div
      class="vtrim__progress"
      ref="progress">
      <slot
        name="progress"
        v-bind="{ currentRightPosition }">
        <div class="vtrim__progress--default"></div>
        <div
          :style="{ right: `${currentRightPosition}%` }"
          :class="[{ 'vtrim--no-transition': Boolean(mouseDown) }, 'vtrim__progress-playing--default']">
        </div>
      </slot>
    </div>
    <span
      :style="leftOffset"
      class="vtrim__progress-time">
      <slot
        name="start-time"
        v-bind="{ currentTime, startTime }">
        <span class="vtrim__progress-time--default vtrim__progress-time--start">
          {{ startTime }}
        </span>
      </slot>
    </span>

    <div
      @mousedown="mouseDown = 'start'"
      @touchstart="mouseDown = 'start'"
      @touchend="handleTouchEnd"
      @touchmove.prevent="handleStartLeftTrim"
      :style="leftOffset"
      class="vtrim__trim-control vtrim__trim-control--start">
      <slot name="start-trim">
        <button
          :style="{ backgroundColor: color }"
          type="button"
          class="vtrim__trim-control--default">
        </button>
      </slot>
    </div>

    <slot
      name="timeline"
      v-bind="{ startLeftPosition, endRightPosition }">
      <div
        :style="{
          ...leftOffset,
          ...rightOffset,
          backgroundColor: color
        }"
        class="vtrim__trimmed-timeline">
      </div>
    </slot>

    <div
      @mousedown="mouseDown = 'seek'"
      @touchstart="mouseDown = 'seek'"
      @touchend="handleTouchEnd"
      @touchmove.prevent="handleSeek"
      :style="{ right: `${currentRightPosition}%` }"
      :class="[{ 'vtrim--no-transition': Boolean(mouseDown) }, 'vtrim__playhead']">
      <slot name="playhead">
        <button
          :style="{ backgroundColor: color }"
          type="button"
          class="vtrim__playhead--default">
        </button>
      </slot>
      <slot name="playing-time">
        <div
          class="
            vtrim__progress-time
            vtrim__progress-time--default
            vtrim__progress-time-playing">
          {{ formatTime(currentTime) }}
        </div>
      </slot>
    </div>

    <slot
      name="timeline-playing"
      v-bind="{ startLeftPosition, currentRightPosition: maxEndRightPosition }">
      <div
        :style="{
          left: `${startLeftPosition}%`,
          right: `${Math.max(endRightPosition, currentRightPosition)}%`,
          backgroundColor: color
        }"
        :class="[{ 'vtrim--no-transition': Boolean(mouseDown) }, 'vtrim__trimmed-timeline--playing']">
      </div>
    </slot>

    <div
      @mousedown="mouseDown = 'end'"
      @touchstart="mouseDown = 'end'"
      @touchend="handleTouchEnd"
      @touchmove.prevent="handleEndRightTrim"
      :style="rightOffset"
      class="vtrim__trim-control vtrim__trim-control--end">
      <slot name="end-trim">
        <button
          type="button"
          :style="{ backgroundColor: color }"
          class="vtrim__trim-control--default">
        </button>
      </slot>
    </div>

    <span
      :style="rightOffset"
      class="vtrim__progress-time">
      <slot
        name="end-time"
        v-bind="{ currentTime, endTime }">
        <span class="vtrim__progress-time--default vtrim__progress-time--end">
          {{ endTime }}
        </span>
      </slot>
    </span>
  </div>
</template>

<script>

import getTimeAsMMSS      from '../utils/getTimeAsMMSS.js';


export default {
  name: 'Vtrim',
  props: {
    currentTime: {
      type: Number,
      required: true,
    },
    mediaDuration: {
      type: Number,
      required: true,
    },
    defaultTrim: {
      type: Object,
      default: null,
    },
    color: {
      type: String,
      default: 'var(--color-primary)',
    },
    formatTime: {
      type: Function,
      default: getTimeAsMMSS,
    },
    timePrecision: {
      type: Number,
      default: 2,
    },
    minTrimDuration: {
      type: Number,
      default: 1,
    },
    restrictSeeking: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    mouseDown: '',
    transformSeekX: 0,
    transformStartX: 0,
    transformEndX: 0,
    startLeftPosition: 0,
    endRightPosition: 0,
    trimmedStart: 0,
    trimmedEnd: 0,
    lastTouch: null,
  }),
  mounted() {
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
  },
  beforeDestroy() {
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
  },
  computed: {
    leftOffset() {
      return { left: `${this.startLeftPosition}%` };
    },
    rightOffset() {
      return { right: `${this.endRightPosition}%` };
    },
    startTime() {
      return this.formatTime(this.trimmedStart);
    },
    endTime() {
      return this.formatTime(this.trimmedEnd);
    },
    mediaPercentageProgress() {
      return (this.currentTime / this.mediaDuration) * 100;
    },
    maxEndRightPosition() {
      return Math.max(this.endRightPosition, this.currentRightPosition);
    },
    currentRightPosition() {
      return 100 - this.mediaPercentageProgress;
    },
  },
  methods: {
    handleStartLeftTrim(event) {
      if (!this.mouseDown) return;

      const progressBarTotalWidth = this.$refs.progress.clientWidth;
      const movementX = event.touches ? this.getMovementFromTouch(event) : event.movementX;

      if (!movementX) return;

      const newTransformStartX = (this.transformStartX + movementX);
      const newStartLeftPosition = Math.min(Math.max(0, (newTransformStartX / progressBarTotalWidth) * 100), 100);
      const newMediaCurrentTimePrecision = Number(Math.max(0, (this.mediaDuration * (newStartLeftPosition / 100))).toFixed(this.timePrecision));
      const isStartTrimGoingPastTrimEnd = (newMediaCurrentTimePrecision + Math.max(0, this.minTrimDuration)) >= this.trimmedEnd;
      const isRestrictedStartTrimGoingPastPlayhead = this.restrictSeeking && (this.trimmedStart > this.currentTime);

      if (isStartTrimGoingPastTrimEnd) return;
      if (isRestrictedStartTrimGoingPastPlayhead) {
        this.transformSeekX = newTransformStartX;
        this.$emit('seek', newMediaCurrentTimePrecision);
      }

      this.transformStartX = newTransformStartX;
      this.startLeftPosition = newStartLeftPosition;
      this.trimmedStart = newMediaCurrentTimePrecision;
      this.$emit('trim-start', newMediaCurrentTimePrecision);
    },
    handleEndRightTrim(event) {
      if (!this.mouseDown) return;

      const progressBarTotalWidth = this.$refs.progress.clientWidth;
      const movementX = event.touches ? this.getMovementFromTouch(event) : event.movementX;

      if (!movementX) return;

      const newTransformEndX = Math.min(0, this.transformEndX + movementX);
      const newEndRightPosition = Math.min(100, Math.max(0, Math.abs((newTransformEndX / progressBarTotalWidth)) * 100));
      const newMediaCurrentTimePrecision = Number((this.mediaDuration * (1 - (newEndRightPosition / 100))).toFixed(this.timePrecision));
      const isEndTrimGoingPastTrimStart = (newMediaCurrentTimePrecision - Math.max(0, this.minTrimDuration)) <= this.trimmedStart;
      const isRestrictedEndTrimGoingPastPlayhead = this.restrictSeeking && (this.trimmedEnd < this.currentTime);

      if (isEndTrimGoingPastTrimStart) return;
      if (isRestrictedEndTrimGoingPastPlayhead) {
        this.transformSeekX = progressBarTotalWidth + newTransformEndX;
        this.$emit('seek', newMediaCurrentTimePrecision);
      }

      this.transformEndX = newTransformEndX;
      this.endRightPosition = newEndRightPosition;
      this.trimmedEnd = newMediaCurrentTimePrecision;
      this.$emit('trim-end', newMediaCurrentTimePrecision);
    },
    handleSeek(event) {
      if (!this.mouseDown) return;

      const progressBarTotalWidth = this.$refs.progress.clientWidth;
      const movementX = event.touches ? this.getMovementFromTouch(event) : event.movementX;

      if (!movementX) return;

      const newtransformSeekX = (this.transformSeekX + movementX);
      const newSeekPosition = Math.min(Math.max(0, (newtransformSeekX / progressBarTotalWidth) * 100), 100);
      const newMediaCurrentTime = Number(Math.max(0, (this.mediaDuration * (newSeekPosition / 100))).toFixed(this.timePrecision));
      const newMediaCurrentTimePrecision = this.restrictSeeking
        ? Number(Math.min(this.trimmedEnd, Math.max(this.trimmedStart, newMediaCurrentTime)).toFixed(this.timePrecision))
        : newMediaCurrentTime;

      this.transformSeekX = newtransformSeekX;
      this.$emit('seek', newMediaCurrentTimePrecision);
    },
    setDefaultTrim() {
      const { start: trimmedStart, end: trimmedEnd } = this.defaultTrim;
      const progressBarTotalWidth = this.$refs?.progress?.clientWidth ?? 0;

      this.startLeftPosition = (trimmedStart / this.mediaDuration) * 100;
      this.endRightPosition = Math.abs(1 - (trimmedEnd / this.mediaDuration)) * 100;
      this.transformStartX = progressBarTotalWidth * (this.startLeftPosition / 100);
      this.transformEndX = progressBarTotalWidth * (-1 * (this.endRightPosition / 100));
      this.transformSeekX = this.transformStartX;
      this.trimmedStart = trimmedStart;
      this.trimmedEnd = trimmedEnd;

      this.$emit('trim-start', this.trimmedStart);
      this.$emit('trim-end', this.trimmedEnd);
    },
    handleTouchEnd() {
      this.mouseDown = '';
      this.lastTouch = null;
    },
    handleMouseUp() {
      this.mouseDown = '';
    },
    handleMouseMove(event) {
      if (!this.mouseDown) return;

      if (this.mouseDown === 'seek') this.handleSeek(event);
      if (this.mouseDown === 'start') this.handleStartLeftTrim(event);
      if (this.mouseDown === 'end') this.handleEndRightTrim(event);
    },
    getMovementFromTouch(event) {
      const [ lastTouch ] = event.touches;

      if (this.lastTouch === null) {
        this.lastTouch = lastTouch.clientX;

        return 0;
      }

      const movementX = lastTouch.clientX - this.lastTouch;

      this.lastTouch = lastTouch.clientX;

      return movementX;
    },
  },
  watch: {
    mediaDuration() {
      this.trimmedEnd = this.defaultTrim?.end || this.mediaDuration;

      if (this.defaultTrim) this.setDefaultTrim();
      else {
        this.$emit('trim-start', 0);
        this.$emit('trim-end', this.mediaDuration);
      }
    },
    currentTime(currentTime) {
      const isPlayOverflow = (currentTime < this.trimmedStart) || currentTime > this.trimmedEnd;
      const progressBarTotalWidth = this.$refs.progress.clientWidth;
      const newtransformSeekX = (currentTime / this.mediaDuration) * 100;

      if (isPlayOverflow) this.$emit('play-overflow', currentTime);

      this.transformSeekX = progressBarTotalWidth * (newtransformSeekX / 100);
    },
  }
}

</script>

<style lang="css" scoped>

.vtrim__wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;

  --default-height: .5rem;

  --color-white: #FFFF;
  --color-black: #000F;
  --color-grey-light: #E8E8E8;
  --color-grey-medium: #888888;
  --color-primary: #1167f2;

  --space-sm: .75rem;
  --space-base: 1rem;
  --space-md: 1.5rem;

  --rounded-base: .75rem;
  --rounded-circle: 50%;
}

.vtrim__progress {
  position: absolute;
  left: 0;
  right: 0;
}

.vtrim__progress--default {
  width: 100%;
  height: var(--default-height);
  border-radius: var(--rounded-base);
  background-color: var(--color-grey-light);
}

.vtrim__progress-playing--default {
  position: absolute;
  top: 0;
  left: 0;
  height: var(--default-height);
  border-radius: var(--rounded-base);
  background-color: var(--color-grey-medium);
  transition: right .5s ease-out;
}

.vtrim__trim-control {
  z-index: 1;
  position: absolute;
  display: flex;
  user-select: none;
}

.vtrim__trim-control--default {
  left: 0;
  height: var(--space-base);
  width: var(--space-base);
  border-radius: var(--rounded-circle);
  border: 2px solid var(--color-grey-light);
  cursor: pointer;
  outline: none;
}

.vtrim__trim-control--default:focus {
  border: 2px solid var(--color-primary);
}

.vtrim__trim-control--start {
  left: 0;
  transform: translateX(-50%);
}

.vtrim__trim-control--end {
  right: 0;
  transform: translateX(50%);
}

.vtrim__trimmed-timeline {
  position: absolute;
  height: var(--default-height);
  background-color: hsla(0, 0%, 0%, .4);
}

.vtrim__trimmed-timeline::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: var(--default-height);
  width: 100%;
  background-color: hsla(0, 0%, 0%, .4);
}

.vtrim__trimmed-timeline--playing {
  position: absolute;
  height: var(--default-height);
  border-radius: var(--rounded-base);
  transition: right .5s ease-out;
}

.vtrim__playhead {
  z-index: 10;
  position: absolute;
  display: flex;
  transform: translate(50%, 150%);
  transition: right .5s ease-out;
  user-select: none;
}

.vtrim__playhead::after {
  content: '';
  position: absolute;
  left: 0;
  width: 200%;
  height: 200%;
  transform: translate(-25%, -25%);
}

.vtrim__playhead--seeking {
  transition: none;
}

.vtrim__playhead--default {
  height: 12px;
  width: 16px;
  border: none;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

.vtrim__progress-time {
  position: absolute;
  user-select: none;
}

.vtrim__progress-time--default {
  display: block;
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  text-shadow: 0px 0px 4px var(--color-black);
  color: var(--color-grey-light);
  user-select: none;
}

.vtrim__progress-time--start {
  transform: translate(-50%, calc(-1.5 * var(--space-base)));
  pointer-events: none;
}

.vtrim__progress-time--end {
  transform: translate(50%, calc(-1.5 * var(--space-base)));
  pointer-events: none;
}

.vtrim__progress-time-playing {
  left: 50%;
  transform: translate(-50%, var(--space-base));
}

.vtrim--no-transition {
  transition: none;
}

</style>
