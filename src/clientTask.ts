import * as TE from 'fp-ts/lib/TaskEither'
import {} from './codecs/values'
import { Client, Expr, errors } from 'faunadb'
// import { FaunaErrorC } from './codecs/errors'

export const clientTask = (client: Client) => <T>(
  expr: Expr
): TE.TaskEither<errors.FaunaError, T> =>
  TE.tryCatch<errors.FaunaError, T>(
    () => client.query(expr),
    (e) => {
      if (e instanceof errors.FaunaError) return e

      return new errors.FaunaError('Unknown Error')
    }
  )
