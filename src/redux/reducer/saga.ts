import { SAGA_STARTED, SagaAction } from "../actions/saga"

export interface ISagaState {
  ran: boolean,
}

export const initialSagaState: ISagaState = {
  ran: false,
}

export default (state: ISagaState = initialSagaState, action: SagaAction): ISagaState => {
  switch (action.type) {
    case SAGA_STARTED:
      return {
        ...state,
        ran: true,
      }

    default:
      return state
  }
}
