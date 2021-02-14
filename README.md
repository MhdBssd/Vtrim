# ✂️ Vtrim ✂️

<img src="https://badgen.net/bundlephobia/min/vtrim" />

Easily **trim your medias** with a fully customizable timeline.

+ Mobile touch events support 📱
+ Styled by default and **fully customizable**  🎨
+ **Audio** 🎵 and **video** 🎞️ compatible

## ✨ Demo
<a href="https://mhdbssd.github.io/Vtrim/dist/index.html" target="_blank">Demo</a>

## 📖 Table of contents
* [Installation](#user-content--installation)
* [Getting started](#user-content--getting-started)
* [Props](#user-content--props)
* [Events](#user-content--events)
* [Slots](#user-content--slots)


## 📥 Installation

``` javascript
npm install vtrim
```
You can then register Vtrim globally in your entry file with `Vue.use()` or locally by importing the component where you need it:

``` javascript
// main.js
import Vtrim from 'vtrim';

Vue.use(Vtrim);
```
or
``` javascript
// myComponent.vue
import { Vtrim } from 'vtrim';

export default {
  name: 'myComponent',
  components: { Vtrim }
};
```

## 🚀 Getting started

``` html
<template>
  <figure>
    <video
      @durationchange="event => mediaDuration = event.target.duration"
      @loadedmetadata="event => mediaDuration = event.target.duration"
      @timeupdate="event => currentTime = event.target.currentTime"
      preload="metadata"
      src="...">
    <video>

    <Vtrim
      @trim-start="trim => trimStart = trim"
      @trim-end="trim => trimEnd = trim"
      :currentTime="currentTime"
      :mediaDuration="mediaDuration">
    </Vtrim>

    <button
      @click="saveTrim"
      type="button">
      Save
    </button>
  </figure>
</template>

<script>

import { Vtrim } from 'vtrim';

export default {
  name: 'App',
  components: { Vtrim },
  data: () => ({
    currentTime: 0,
    mediaDuration: 0,
    trimStart: 0,
    trimEnd: 0,
  }),
  methods: {
    async saveTrim() {
      await api.saveTrim({ start: this.trimStart, end: this.trimEnd });
    }
  }
}

</script>
```

## ⚙️ Props

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**`currentTime`**|`Number`|**required**| The current time of your media in seconds  |
|**`mediaDuration`**|`Number`|**required**| The total duration of your media in seconds |
|**`color`**|`String`|`'#1167f2'`| The brand color |
|**`defaultTrim`**|`Object`|`null`| Sets a default trim. Must be an object with the following properties: `{ start: Number, end: Number }`|
|**`minTrimDuration`**|`Number`|`1`| Sets the minimum duration of your trimmed media in seconds. This prevents trim handles from going past each other  |
|**`formatTime`**|`Function`|`(rawTime) => getTimeAsMM:SS(rawTime)`| Formats the trims times (`MM:SS` by default). Receives the raw time in seconds |
|**`timePrecision`**|`Number`|`2`| Sets the number of decimals of the trim time |
|**`restrictSeeking`**|`Boolean`|`false`| Whether the seeking playhead is restricted within the trimmed media |

## 🚨 Events

|Name|Payload|Type|Description|
|:--:|:--:|:-----:|:----------|
|**`trim-strart`**|`trimStart`| `Number` | Fired everytime the start trim handle is moved. Receives the raw start trim time in seconds |
|**`trim-end`**|`trimEnd`| `Number` | Fired everytime the end trim handle is moved. Receives the raw end trim time in seconds |
|**`seek`**|`seekTime`| `Number` | Fired everytime the playhead is moved. Receives the raw seek time in seconds |
|**`play-overflow`**|`currentTime`|`Number`| Fired everytime the media is currently playing before trim start or after trim end. Receives the raw seek time in seconds |

## 🧱 Slots

|Name|Slot props|Description|
|:--:|:--:|:----------|
|**`progress`**|`{ currentRightPosition: Number }`| The progress bar of the original media. Receives the original media current end right position |
|**`start-trim`**|`{}`| The start trim handle |
|**`end-trim`**|`{}`| The end trim handle |
|**`playhead`**|`{}`| The playhead |
|**`start-time`**|`{ currentTime: Number, startTime: Number }`| The start trim time. Receives the current media time and the formatted trim start time |
|**`end-time`**|`{ currentTime: Number, endTime: Number }`| The end trim time. Receives the current media time and the formatted trim end time |
|**`timeline`**|`{ startLeftPosition: Number, endRightPosition: Number }`| The trimmed timeline. Receives the start left position and end right position in `%` relative to the progress bar. *E.g: A video trimmed from its beginning to half its duration would receive: `{ startLeftPosition: 0, endRightPosition: 50 }`* |
|**`timeline-playing`**|`{ startLeftPosition: Number, currentRightPosition: Number }`| The playing timeline within the trimmed timeline. Receives the start left position and current end right position in `%` relative to the trimmed video duration. *E.g: A video trimmed from 0s to 10s currently playing at 5s would receive: `{ startLeftPosition: 0, endRightPosition: 50 }`* |
