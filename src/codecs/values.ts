import * as t from 'io-ts'
import { values } from 'faunadb'

import { ExprC } from './Expr'

// value.Ref
export const RefC = new t.Type<values.Ref>(
  'RefC',
  (u): u is values.Ref => u instanceof values.Ref,
  (u, c) => (u instanceof values.Ref ? t.success(u) : t.failure(u, c)),
  t.identity
)
export type RefC = t.TypeOf<typeof RefC>

// values.SetRef
export const SetRefC = new t.Type<values.SetRef>(
  'SetRefC',
  (u): u is values.SetRef => u instanceof values.SetRef,
  (u, c) => (u instanceof values.SetRef ? t.success(u) : t.failure(u, c)),
  t.identity
)
export type SetRefC = t.TypeOf<typeof SetRefC>

// values.FaunaTime and
// values.FaunaDate
export const FaunaTimeC = new t.Type<values.FaunaTime>(
  'FaunaTimeC',
  (u): u is values.FaunaTime => u instanceof values.FaunaTime,
  (u, c) => (u instanceof values.FaunaTime ? t.success(u) : t.failure(u, c)),
  t.identity
)
export type FaunaTimeC = t.TypeOf<typeof FaunaTimeC>

export const FaunaDateC = new t.Type<values.FaunaDate>(
  'FaunaDateC',
  (u): u is values.FaunaDate => u instanceof values.FaunaDate,
  (u, c) => (u instanceof values.FaunaDate ? t.success(u) : t.failure(u, c)),
  t.identity
)
export type FaunaDateC = t.TypeOf<typeof FaunaDateC>

// values.Query
export const QueryC = new t.Type<values.Query>(
  'QueryC',
  (u): u is values.Query => u instanceof values.Query,
  (u, c) => (u instanceof values.Query ? t.success(u) : t.failure(u, c)),
  t.identity
)
export type QueryC = values.Query

// values.Document
export type DocumentC<T extends t.TypeC<t.Props>> = t.TypeC<{
  ref: typeof RefC
  ts: t.NumberC
  data: T
}>
export const DocumentC = <T extends t.TypeC<t.Props>>(
  dataType: T
): DocumentC<T> =>
  t.type({
    ref: RefC,
    ts: t.number,
    data: dataType,
  })

// values.Page
export type PageC<T extends t.TypeC<t.Props>> = t.IntersectionC<
  [
    t.TypeC<{
      data: t.ArrayC<T>
    }>,
    t.PartialC<{
      after: typeof ExprC
      before: typeof ExprC
    }>
  ]
>
export const PageC = <T extends t.TypeC<t.Props>>(dataType: T): PageC<T> =>
  t.intersection([
    t.type({
      data: t.array(dataType),
    }),
    t.partial({
      after: ExprC,
      before: ExprC,
    }),
  ])

// bonus utils
export const dateFromFaunaValue = (
  value: number | FaunaTimeC | FaunaDateC
): Date =>
  FaunaTimeC.is(value) || FaunaDateC.is(value)
    ? value.date
    : new Date(value / 1000)
