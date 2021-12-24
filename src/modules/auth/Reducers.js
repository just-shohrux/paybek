import Actions from "./Actions";
import {get} from "lodash";

export default function AuthReducer(state = {}, action) {
    switch (action.type) {
        case Actions.CHECK_AUTH.TRIGGER:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isFetched: false
            }
        case Actions.CHECK_AUTH.REQUEST:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isFetched: false
            }
        case Actions.CHECK_AUTH.FAILURE:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isFetched: true,
            }
        case Actions.CHECK_AUTH.SUCCESS:
            return {
                ...state,
                user: get(action, "payload.user"),
                isAuthenticated: true,
                isFetched: true,
            }
        default:
            return state
    }
}
