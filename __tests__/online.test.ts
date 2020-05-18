import { Client, query as q, values, errors } from 'faunadb'
import * as t from 'io-ts'
import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/pipeable'

import {
  clientTask,
  RefC,
  FaunaTimeC,
  FaunaDateC,
  QueryC,
  DocumentC,
} from '../src'
import { assertFailure, assertSuccess } from './helpers'

const secret = process.env.FAUNADB_ADMIN_KEY
const client = new Client({ secret })
const query = clientTask(client)

const user1Query = q.Ref(q.Collection('User'), '263980061820977682')
const user1Value = new values.Ref(
  '263980061820977682',
  new values.Ref('User', values.Native.COLLECTIONS)
)

describe('clientTask', () => {
  it('works on its own', async () => {
    await query(user1Query)().then(
      E.map((res) => expect(res).toEqual(user1Value))
    )
  })
})
