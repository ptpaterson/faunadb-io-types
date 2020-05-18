import { values, errors, Expr } from 'faunadb'
import * as t from 'io-ts'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'

import {
  RefC,
  SetRefC,
  FaunaTimeC,
  FaunaDateC,
  QueryC,
  DocumentC,
  PageC,
  dateFromFaunaValue,
} from '../src'
import { assertFailure, assertSuccess } from './helpers'

const user1Value = new values.Ref(
  '263980061820977682',
  new values.Ref('User', values.Native.COLLECTIONS)
)

describe('RefC', () => {
  describe('decode', () => {
    it('should decode a valid input', () => {
      assertSuccess(RefC.decode(user1Value), user1Value)
    })

    it('should reject an invalid input', () => {
      assertFailure(RefC, null, ['Invalid value null supplied to : RefC'])
    })
  })

  test('is', () => {
    expect(RefC.is(user1Value)).toBeTruthy()
  })
})

const setRefValue = new values.SetRef(`{
  documents: new values.Ref('User', values.Native.COLLECTIONS),
}`)
describe('SetRefC', () => {
  describe('decode', () => {
    it('should decode a valid input', () => {
      assertSuccess(SetRefC.decode(setRefValue), setRefValue)
    })

    it('should reject an invalid input', () => {
      assertFailure(SetRefC, null, ['Invalid value null supplied to : SetRefC'])
    })
  })

  test('is', () => {
    expect(SetRefC.is(setRefValue)).toBeTruthy()
  })
})

const actualDate = new Date()
const timeValue = new values.FaunaTime(actualDate)
describe('FaunaTimeC', () => {
  describe('decode', () => {
    it('should decode a valid input', () => {
      assertSuccess(FaunaTimeC.decode(timeValue), timeValue)
    })

    it('should reject an invalid input', () => {
      assertFailure(FaunaTimeC, null, [
        'Invalid value null supplied to : FaunaTimeC',
      ])
    })
  })

  test('is', () => {
    expect(FaunaTimeC.is(timeValue)).toBeTruthy()
  })
})

const dateValue = new values.FaunaDate(actualDate)
describe('FaunaDateC', () => {
  describe('decode', () => {
    it('should decode a valid input', () => {
      assertSuccess(FaunaDateC.decode(dateValue), dateValue)
    })

    it('should reject an invalid input', () => {
      assertFailure(FaunaDateC, null, [
        'Invalid value null supplied to : FaunaDateC',
      ])
    })
  })

  test('is', () => {
    expect(FaunaDateC.is(dateValue)).toBeTruthy()
  })
})

const queryValue = new values.Query({ key: 'field' })
describe('QueryC', () => {
  describe('decode', () => {
    it('should decode a valid input', () => {
      assertSuccess(QueryC.decode(queryValue), queryValue)
    })

    it('should reject an invalid input', () => {
      assertFailure(QueryC, null, ['Invalid value null supplied to : QueryC'])
    })
  })

  test('is', () => {
    expect(QueryC.is(queryValue)).toBeTruthy()
  })
})

const User = t.type({
  name: t.string,
})
const UserDocumentC = DocumentC(User)
const docValue = {
  ref: user1Value,
  ts: 123456789,
  data: {
    name: 'name',
  },
}
describe('DocumentC', () => {
  describe('decode', () => {
    it('should decode a valid input', () => {
      assertSuccess(UserDocumentC.decode(docValue), docValue)
    })

    it('should reject an invalid input', () => {
      assertFailure(UserDocumentC, null, [
        'Invalid value null supplied to : { ref: RefC, ts: number, data: { name: string } }',
      ])
    })
  })
})

const UserPage = PageC(UserDocumentC)
const pageValue = {
  data: [docValue],
}
describe('PageC', () => {
  describe('decode', () => {
    it('should decode a valid input', () => {
      assertSuccess(UserPage.decode(pageValue), pageValue)
    })

    it('should reject an invalid input', () => {
      assertFailure(UserPage, null, [
        'Invalid value null supplied to : ({ data: Array<{ ref: RefC, ts: number, data: { name: string } }> } & Partial<{ after: ExprC, before: ExprC }>)/0: { data: Array<{ ref: RefC, ts: number, data: { name: string } }> }',
        'Invalid value null supplied to : ({ data: Array<{ ref: RefC, ts: number, data: { name: string } }> } & Partial<{ after: ExprC, before: ExprC }>)/1: Partial<{ after: ExprC, before: ExprC }>',
      ])
    })
  })
})

const mapErrors = E.mapLeft(() => new errors.FaunaError('bad thing'))
describe('Playground', () => {
  test('Can still use fields when decoded', async () => {
    pipe(
      user1Value,
      RefC.decode,
      mapErrors,
      E.map((ref) => (ref.collection ? ref.collection.id : '')),
      E.map((tested) => expect(tested).toEqual('User'))
    )
  })
})

describe('dateFromFaunaValue', () => {
  it('converts FaunaTime', () => {
    expect(dateFromFaunaValue(timeValue)).toEqual(actualDate)
  })
  it('converts FaunaDate', () => {
    expect(dateFromFaunaValue(dateValue)).toEqual(
      new Date(actualDate.toISOString().slice(0, 10))
    )
  })
  it('converts number', () => {
    expect(dateFromFaunaValue(1588398589480000)).toEqual(
      new Date(1588398589480000 / 1000)
    )
  })
})
