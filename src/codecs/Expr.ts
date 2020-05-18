import * as t from 'io-ts'
import { Expr } from 'faunadb'

export const ExprC = new t.Type<Expr>(
  'ExprC',
  (u): u is Expr => u instanceof Expr,
  (u, c) => (u instanceof Expr ? t.success(u) : t.failure(u, c)),
  t.identity
)
export type ExprC = t.TypeOf<typeof ExprC>
