<script setup lang="ts">
import { useStopWatch } from '@vueuse/core'

const { elapsed, isRunning, start, stop, resume, reset } = useStopWatch()
</script>

<template>
  <div class="flex flex-col gap-4 items-center">
    <div class="grid cols-2 gap-x-2">
      <div class="font-bold text-right">
        elapsed time:
      </div>
      <div>{{ elapsed }}ms</div>
      <div class="font-bold text-right">
        is running:
      </div>
      <div
        class="font-bold" :class="[isRunning ? 'text-lime-600' : 'text-orange-600']"
      >
        {{ isRunning }}
      </div>
    </div>

    <div class="flex items-center gap-2 justify-center">
      <button @click="start">
        Start
      </button>
      <button @click="stop">
        Stop
      </button>
      <button @click="resume">
        Resume
      </button>
      <button @click="reset">
        Reset
      </button>
    </div>
  </div>
</template>

<style scoped></style>
