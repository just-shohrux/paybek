import {request} from "../../services/api";

class ApiService{

    static GetDashboardData= (type) => {
        return request.get('/api/report/v1/txn', {params:{type}});
    }
}

export default ApiService;