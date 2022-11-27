import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('useCounter', () => {
  it('increment & decrement', () => {
    const { result } = renderHook(() => useCounter(10))
    expect(result.current[0]).toMatchInlineSnapshot('10')
    act(() => result.current[1].inc(1))
    expect(result.current[0]).toMatchInlineSnapshot('11')
    act(() => result.current[1].dec(1))
    expect(result.current[0]).toMatchInlineSnapshot('10')
  })
})

