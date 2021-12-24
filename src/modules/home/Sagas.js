import {all, call, put, takeLatest} from "redux-saga/effects";
import {get} from "lodash";
import Actions from "./Actions";
import ApiService from "./ApiService";
import NormalizerAction from "../../services/normalizer/actions";
import Normalizer from "../../services/normalizer";


function* getDashboardDataRequest(action) {
    const {type} = action.payload;
    try {
        const {data} = yield call(ApiService.GetDashboardData, type);
        const normalizedData = yield call(Normalizer.Normalize, get(data, 'data', null), {});

        yield put({
            type: NormalizerAction.NORMALIZE.REQUEST,
            payload: {...normalizedData, storeName: 'dashboard-data',entity:''},
        });
        yield put({type: Actions.GET_DASHBOARD_DATA.SUCCESS});
    } catch (e) {
        yield put({type: Actions.GET_DASHBOARD_DATA.FAILURE});
    }
}




export default function* sagas() {
    yield all([
        takeLatest(Actions.GET_DASHBOARD_DATA.REQUEST, getDashboardDataRequest),
    ]);
}
