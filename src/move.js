// @flow
import type { MutableState, Mutator, Tools } from 'final-form'
import moveFields from './moveFields'
import restoreFunctions from './restoreFunctions'

const TMP: string = 'tmp'

const move: Mutator<any> = (
  [name, from, to]: any[],
  state: MutableState<any>,
  { changeValue, renameField }: Tools<any>
) => {
  if (from === to) {
    return
  }
  changeValue(state, name, (array: ?(any[])): any[] => {
    const copy = [...(array || [])]
    const value = copy[from]
    copy.splice(from, 1)
    copy.splice(to, 0, value)
    return copy
  })

  //make a copy of a state for further functions restore
  const backupState = { ...state, fields: { ...state.fields } }

  // move this row to tmp index
  const fromPrefix = `${name}[${from}]`
  const tempIndexAtEnd = (Object.keys(state.fields).length + 1).toString();
  moveFields(name, fromPrefix, tempIndexAtEnd, state, renameField)

  if (from < to) {
    // moving to a higher index
    // decrement all indices between from and to
    for (let i = from + 1; i <= to; i++) {
      const innerFromPrefix = `${name}[${i}]`
      moveFields(name, innerFromPrefix, `${i - 1}`, state, renameField)
    }
  } else {
    // moving to a lower index
    // increment all indices between to and from
    for (let i = from - 1; i >= to; i--) {
      const innerFromPrefix = `${name}[${i}]`
      moveFields(name, innerFromPrefix, `${i + 1}`, state, renameField)
    }
  }

  // move from tmp index to destination
  const tmpPrefix = `${name}[${tempIndexAtEnd}]`
  moveFields(name, tmpPrefix, to, state, renameField)

  restoreFunctions(state, backupState)
}

export default move
