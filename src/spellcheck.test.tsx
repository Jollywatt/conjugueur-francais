import { describe, test, assert } from 'vitest'

import {
  comptuteStringEdits,
} from './spellcheck.tsx'

describe('single character edits', () => {
  test('insertion', () => {
    assert.deepEqual(
      comptuteStringEdits("abc", "abXc"),
      [
        {correct: 'ab'},
        {insert: 'X'},
        {correct: 'c'},
      ],
    )
  })
  test('deletion', () => {
    assert.deepEqual(
      comptuteStringEdits("abc", "ac"),
      [
        {correct: 'a'},
        {delete: 'b'},
        {correct: 'c'},
      ],
    )
  })
  test('substitution', () => {
    assert.deepEqual(
      comptuteStringEdits("abc", "aXc"),
      [
        {correct: 'a'},
        {swap: 'b', with: 'X'},
        {correct: 'c'},
      ],
    )
  })
})

describe('composite edits', () => {
  test('two insertions', () => {
    assert.deepEqual(
      comptuteStringEdits("abc", "abXYc"),
      [
        {correct: 'ab'},
        {insert: 'XY'},
        {correct: 'c'},
      ],
    )
  })
  test('insertion and deletion', () => {
    assert.deepEqual(
      comptuteStringEdits("abc", "bcd"),
      [
        {delete: 'a'},
        {correct: 'bc'},
        {insert: 'd'},
      ],
    )
  })
  test('substitution with insertion', () => {
    assert.deepEqual(
      comptuteStringEdits("abc", "aXYc"),
      [
        {correct: 'a'},
        {swap: 'b', with: 'X'},
        {insert: 'Y'},
        {correct: 'c'},
      ],
    )
  })
})