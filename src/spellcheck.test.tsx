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
  test('size 1-to-2 substitution', () => {
    assert.deepEqual(
      comptuteStringEdits("abc", "aXYc"),
      [
        {correct: 'a'},
        {swap: 'b', with: 'XY'},
        {correct: 'c'},
      ],
    )
  })
  test('size 3-to-2 substitution', () => {
    assert.deepEqual(
      comptuteStringEdits("aXYZc", "abc"),
      [
        {correct: 'a'},
        {swap: 'XYZ', with: 'b'},
        {correct: 'c'},
      ],
    )
  })
  test('size 2-to-2 substitution', () => {
    assert.deepEqual(
      comptuteStringEdits("aXYd", "abcd"),
      [
        {correct: 'a'},
        {swap: 'XY', with: 'bc'},
        {correct: 'd'},
      ],
    )
  })
  test('size 3-to-2 substitution', () => {
    assert.deepEqual(
      comptuteStringEdits("acXd", "abcd"),
      [
        {correct: 'a'},
        {insert: 'b'},
        {correct: 'c'},
        {delete: 'X'},
        {correct: 'd'},
      ],
    )
  })
})