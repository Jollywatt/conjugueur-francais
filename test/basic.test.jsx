import { describe, test, assert } from 'vitest'

describe('Math.sqrt() test', () => {
  test('sqrt(4)', () => {
    assert.equal(Math.sqrt(4), 2)
  })
})