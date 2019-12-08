export const SAGA_STARTED: string = "Saga: Started"

export interface ISagaStartedAction {
  type: string,
}

export type SagaAction = ISagaStartedAction

export const sagaStarted = (): ISagaStartedAction => {
  return { type: SAGA_STARTED }
}
