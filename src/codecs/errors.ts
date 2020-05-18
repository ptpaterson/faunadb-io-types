import * as t from 'io-ts'
import { errors } from 'faunadb'

export const FaunaErrorC = new t.Type<errors.FaunaError>(
  'FaunaErrorC',
  (u): u is errors.FaunaError => u instanceof errors.FaunaError,
  (u, c) => (u instanceof errors.FaunaError ? t.success(u) : t.failure(u, c)),
  t.identity
)
export type FaunaErrorC = t.TypeOf<typeof FaunaErrorC>
