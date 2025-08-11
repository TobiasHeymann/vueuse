import { useStopWatch } from '@vueuse/core'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('useStopWatch', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllTimers()
  })

  it('should be defined', () => {
    expect(useStopWatch).toBeDefined()
  })

  it('should initialize with correct default values', () => {
    const { elapsed, isRunning } = useStopWatch()
    expect(isRunning.value).toBe(false)
    expect(elapsed.value).toBe(0)

    vi.advanceTimersByTime(1_000)

    expect(isRunning.value).toBe(false)
    expect(elapsed.value).toBe(0)
  })

  it('should advance with default interval', () => {
    const { elapsed, start } = useStopWatch()

    start()
    expect(elapsed.value).toBe(0)
    vi.advanceTimersByTime(8)
    expect(elapsed.value).toBe(0)
    vi.advanceTimersByTime(8)
    expect(elapsed.value).toBe(16)
    vi.advanceTimersByTime(8)
    expect(elapsed.value).toBe(16)
    vi.advanceTimersByTime(8)
    expect(elapsed.value).toBe(32)
  })

  it('should advance with custom interval', () => {
    const { elapsed, start } = useStopWatch({ interval: 1 })

    start()
    expect(elapsed.value).toBe(0)
    vi.advanceTimersByTime(8)
    expect(elapsed.value).toBe(8)
    vi.advanceTimersByTime(8)
    expect(elapsed.value).toBe(16)
    vi.advanceTimersByTime(8)
    expect(elapsed.value).toBe(24)
    vi.advanceTimersByTime(8)
    expect(elapsed.value).toBe(32)
  })

  it('should start running and measure time with start()', () => {
    const { elapsed, isRunning, start } = useStopWatch({ interval: 1 })

    start()
    expect(isRunning.value).toBe(true)

    vi.advanceTimersByTime(2000)
    expect(elapsed.value).toBe(2000)

    vi.advanceTimersByTime(3000)
    expect(elapsed.value).toBe(5000)
  })

  it('should stop and preserve the elapsed time with stop()', () => {
    const { elapsed, isRunning, start, stop } = useStopWatch({ interval: 1 })

    start()
    vi.advanceTimersByTime(1500)
    stop()

    expect(isRunning.value).toBe(false)
    expect(elapsed.value).toBe(1500)

    vi.advanceTimersByTime(5000)
    expect(elapsed.value).toBe(1500)
  })

  it('should resume from the stopped time with resume()', () => {
    const { elapsed, isRunning, start, stop, resume } = useStopWatch({ interval: 1 })

    start()
    vi.advanceTimersByTime(1000)
    stop()

    expect(isRunning.value).toBe(false)
    expect(elapsed.value).toBe(1000)

    vi.advanceTimersByTime(2000)

    resume()
    expect(isRunning.value).toBe(true)

    vi.advanceTimersByTime(1000)
    expect(elapsed.value).toBe(2000)
  })

  it('should reset to zero and stop with reset()', () => {
    const { elapsed, isRunning, start, reset } = useStopWatch({ interval: 1 })

    start()
    vi.advanceTimersByTime(3000)
    reset()

    expect(isRunning.value).toBe(false)
    expect(elapsed.value).toBe(0)
  })

  it('should restart from zero when start() is called on a running stopwatch', () => {
    const { elapsed, isRunning, start } = useStopWatch({ interval: 1 })

    start()
    vi.advanceTimersByTime(5000)
    expect(elapsed.value).toBe(5000)

    start()
    expect(isRunning.value).toBe(true)
    expect(elapsed.value).toBe(0)

    vi.advanceTimersByTime(1000)
    expect(elapsed.value).toBe(1000)
  })

  it('should call onStart when start() is executed', () => {
    const onStart = vi.fn()
    const { start } = useStopWatch({ onStart })

    start()
    expect(onStart).toHaveBeenCalledTimes(1)
  })

  it('should call onStop when stop() is executed', () => {
    const onStop = vi.fn()
    const { start, stop } = useStopWatch({ onStop, interval: 1 })

    start()
    vi.advanceTimersByTime(1_000)
    stop()

    expect(onStop).toHaveBeenCalledTimes(1)
    expect(onStop).toHaveBeenCalledWith(1_000)
  })

  it('should call onResume when resume() is executed', () => {
    const onResume = vi.fn()
    const { start, stop, resume } = useStopWatch({ onResume, interval: 1 })

    start()
    vi.advanceTimersByTime(1_000)
    stop()
    resume()

    expect(onResume).toHaveBeenCalledTimes(1)
    expect(onResume).toHaveBeenCalledWith(1_000)
  })

  it('should call onReset when reset() is executed', () => {
    const onReset = vi.fn()
    const { start, reset } = useStopWatch({ onReset })

    start()
    vi.advanceTimersByTime(1_000)
    reset()

    expect(onReset).toHaveBeenCalledTimes(1)
  })
})
