---
category: Time
---

# useStopWatch

Wrapper build on `useNow` that provides stopwatch functionality.

- Start always begins from zero, resetting any previous time.
- Resume continues the measurement from the previously stopped time.
- Customizable interval to optimize performance (Milliseconds or `requestAnimationFrame`).
- Callbacks for state changes (`onStart`, `onStop`, `onResume`, `onReset`).
- Readonly values prevent unintended external mutations.

## Basic Usage

```ts
import { useStopWatch } from '@vueuse/core'

const { elapsed, isRunning, start, stop, resume, reset } = useStopWatch()
```

## Custom Interval and Callbacks

```ts
import { useStopWatch } from '@vueuse/core'

const { elapsed, isRunning, start, stop, resume, reset } = useStopWatch({
  interval: 100,
  onStart: () => console.log('Started from zero'),
  onStop: time => console.log('Stopped at:', time),
})
```
