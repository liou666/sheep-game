import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'

import Counter from '@/components/Counter'

describe('Counter', () => {
  afterEach(cleanup)

  it('should render', () => {
    const { getByText } = render(<Counter initial={10} />)
    expect(getByText('10')).toBeDefined()
  })
  it('should be interactive', () => {
    const { getByText } = render(<Counter initial={0} />)
    expect(getByText('0')).toBeDefined()

    fireEvent.click(getByText('+1'))
    expect(getByText('1')).toBeDefined()

    fireEvent.click(getByText('-1'))
    expect(getByText('0')).toBeDefined()
  })
})
