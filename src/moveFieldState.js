// @flow
import type { MutableState } from 'final-form'

function moveFieldState(
  state: MutableState<any>,
  source: Object,
  destKey: string,
  renameField: (state: MutableState<any>, from: string, to: string) => void,
  oldState: MutableState<any> = state
) {
  renameField(state, source.name, destKey)
  delete state.fields[source.name]
  state.fields[destKey] = {
    ...source,
    name: destKey,
    change: state.fields[destKey]
      ? state.fields[destKey].change
      : oldState.fields[destKey] && oldState.fields[destKey].change,
    blur: state.fields[destKey]
      ? state.fields[destKey].blur
      : oldState.fields[destKey] && oldState.fields[destKey].blur,
    focus: state.fields[destKey]
      ? state.fields[destKey].focus
      : oldState.fields[destKey] && oldState.fields[destKey].focus,
    lastFieldState: undefined // clearing lastFieldState forces renotification
  }
  if (!state.fields[destKey].change) {
    delete state.fields[destKey].change
  }
  if (!state.fields[destKey].blur) {
    delete state.fields[destKey].blur
  }
  if (!state.fields[destKey].focus) {
    delete state.fields[destKey].focus
  }
}

export default moveFieldState
