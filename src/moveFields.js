// @flow
import type { MutableState } from 'final-form'
import moveFieldState from './moveFieldState';

function moveFields(
  name: string,
  matchPrefix: string,
  destIndex: string,
  state: MutableState<any>,
  renameField: (
    state: MutableState<any>,
    from: string,
    to: string
  ) => void
) {
  Object.keys(state.fields).forEach(key => {
    if (key.substring(0, matchPrefix.length) === matchPrefix) {
      const suffix = key.substring(matchPrefix.length)
      const destKey = `${name}[${destIndex}]${suffix}`
      moveFieldState(state, state.fields[key], destKey, renameField)
    }
  })
}

export default moveFields
