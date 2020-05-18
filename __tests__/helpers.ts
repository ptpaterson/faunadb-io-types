// Copyright (c) 2017 Giulio Canti
// https://github.com/gcanti/io-ts-types/blob/master/test/helpers.ts

// modifications made to use `expect` rather than the `assert` package

import * as t from 'io-ts'
import { PathReporter } from 'io-ts/lib/PathReporter'
import { isRight, isLeft } from 'fp-ts/lib/Either'

export function assertStrictEqual<T>(
  result: t.Validation<T>,
  expected: any
): void {
  if (isRight(result)) {
    expect(result.right).toEqual(expected)
  } else {
    throw new Error(`${result} is not a right`)
  }
}

export function assertSuccess<T>(result: t.Validation<T>, expected?: T): void {
  if (isRight(result)) {
    if (expected !== undefined) {
      expect(result.right).toEqual(expected)
    }
  } else {
    throw new Error(`${result} is not a right`)
  }
}

export function assertStrictSuccess<T>(
  result: t.Validation<T>,
  expected: T
): void {
  if (isRight(result)) {
    if (expected !== undefined) {
      expect(result.right).toEqual(expected)
    }
  } else {
    throw new Error(`${result} is not a right`)
  }
}

export function assertFailure(
  codec: t.Any,
  value: unknown,
  errors: Array<string>
): void {
  const result = codec.decode(value)
  if (isLeft(result)) {
    expect(PathReporter.report(result)).toEqual(errors)
  } else {
    throw new Error(`${result} is not a left`)
  }
}
