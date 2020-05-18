import * as t from 'io-ts'
import { RequestResult } from 'faunadb'

export const RequestResultC = new t.Type<RequestResult>(
  'RequestResultC',
  (u): u is RequestResult => u instanceof RequestResult,
  (u, c) => (u instanceof RequestResult ? t.success(u) : t.failure(u, c)),
  t.identity
)
export type RequestResultC = t.TypeOf<typeof RequestResultC>
