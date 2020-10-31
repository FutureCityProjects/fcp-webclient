import { SagaAction, SAGA_STARTED } from "redux/actions/saga"

export interface ISagaState {
  ran: boolean,
}

export const initialSagaState: ISagaState = {
  ran: false,
}

const sagaReducer = (state: ISagaState = initialSagaState, action: SagaAction): ISagaState => {
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

export default sagaReducer