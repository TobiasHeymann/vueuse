import type { ShallowRef } from 'vue'
import { computed, readonly, shallowRef } from 'vue'
import { useNow } from '../useNow'

export interface UseStopWatchOptions {
  /**
   * Update interval in milliseconds, or use requestAnimationFrame
   *
   * @default 'requestAnimationFrame'
   */
  interval?: 'requestAnimationFrame' | number

  /**
   * Start the stopwatch immediately
   *
   * @default false
   */
  immediate?: boolean

  /**
   * Callback fired when the stopwatch starts from zero
   */
  onStart?: () => void

  /**
   * Callback fired when the stopwatch is stopped/paused
   *
   * @param elapsed - Current elapsed time in milliseconds
   */
  onStop?: (elapsed: number) => void

  /**
   * Callback fired when the stopwatch resumes from a paused state
   *
   * @param elapsed - Current elapsed time in milliseconds
   */
  onResume?: (elapsed: number) => void

  /**
   * Callback fired when the stopwatch is reset to zero
   */
  onReset?: () => void
}

export interface UseStopWatchReturn {
  /**
   * Current elapsed time in milliseconds
   */
  elapsed: Readonly<ShallowRef<number>>

  /**
   * Whether the stopwatch is currently running
   */
  isRunning: Readonly<ShallowRef<boolean>>

  /**
   * Start the stopwatch from zero
   *
   * Resets any previously accumulated time and begins timing from zero.
   * If already running, this will restart from zero.
   */
  start: () => void

  /**
   * Stop/pause the stopwatch
   *
   * Preserves the current elapsed time for potential resume.
   * Has no effect if the stopwatch is not running.
   */
  stop: () => void

  /**
   * Resume the stopwatch from where it was stopped
   *
   * Continues timing from the previously accumulated time.
   * Has no effect if the stopwatch is already running.
   */
  resume: () => void

  /**
   * Reset the stopwatch to zero and stop it
   *
   * Clears all accumulated time and stops the stopwatch.
   */
  reset: () => void
}

/**
 * Reactive stopwatch composable with precise timing control
 *
 * Provides a high-precision stopwatch with start, stop, resume, and reset functionality.
 * Built on top of `useNow` for consistent and efficient time updates.
 *
 * Key features:
 * - Start always begins from zero, resetting any previous time.
 * - Resume continues the measurement from the previously stopped time.
 * - Customizable interval to optimize performance (Milliseconds or `requestAnimationFrame`).
 * - Callbacks for state changes (`onStart`, `onStop`, `onResume`, `onReset`).
 * - Readonly values prevent unintended external mutations.
 *
 * @param {UseStopWatchOptions} options Configuration options for the stopwatch behavior
 * @returns {UseStopWatchReturn} Object containing reactive elapsed time, running state, and control methods
 *
 * @see https://vueuse.org/useStopWatch
 */
export function useStopWatch(options: UseStopWatchOptions = {}): UseStopWatchReturn {
  const { interval = 'requestAnimationFrame', immediate = false, onStart, onStop, onResume, onReset } = options

  // Get reactive current time from VueUse
  const now = useNow({ interval })

  // Internal state tracking
  const startTime = shallowRef<number | null>(null)
  const accumulatedTime = shallowRef(0)
  const isRunning = shallowRef(false)

  // Computed elapsed time that updates reactively while running
  const elapsed = computed(() => {
    if (!isRunning.value || startTime.value === null) {
      return accumulatedTime.value
    }

    return accumulatedTime.value + (now.value.getTime() - startTime.value)
  })

  /**
   * Start the stopwatch from zero
   *
   * Resets any previously accumulated time and begins timing from zero.
   * If already running, this will restart from zero.
   */
  const start = () => {
    accumulatedTime.value = 0
    startTime.value = now.value.getTime()
    isRunning.value = true

    onStart?.()
  }

  /**
   * Stop/pause the stopwatch
   *
   * Preserves the current elapsed time for potential resume.
   * Has no effect if the stopwatch is not running.
   */
  const stop = () => {
    if (!isRunning.value || startTime.value === null)
      return

    // Preserve the current session time
    accumulatedTime.value += now.value.getTime() - startTime.value
    startTime.value = null
    isRunning.value = false

    onStop?.(elapsed.value)
  }

  /**
   * Resume the stopwatch from where it was stopped
   *
   * Continues timing from the previously accumulated time.
   * Has no effect if the stopwatch is already running.
   */
  const resume = () => {
    if (isRunning.value)
      return

    startTime.value = now.value.getTime()
    isRunning.value = true

    onResume?.(elapsed.value)
  }

  /**
   * Reset the stopwatch to zero
   *
   * Clears all timing data and stops the stopwatch.
   */
  const reset = () => {
    startTime.value = null
    accumulatedTime.value = 0
    isRunning.value = false

    onReset?.()
  }

  // Start immediately if the option is enabled
  if (immediate) {
    start()
  }

  return {
    elapsed: readonly(elapsed),
    isRunning: readonly(isRunning),
    start,
    stop,
    resume,
    reset,
  }
}
