import ModelService from "@/services/ModelService";
import {useAlertStore} from "@/stores";
import {getResponseError} from "@/helpers/api";

import {useGlobalStateStore} from "@/stores";

export default class CustomerService extends ModelService {

    constructor() {
        super();
        this.url = 'v1/customer';
    }

    public export(params = {}) {
        let path = this.url + '/export';
        let query = new URLSearchParams(params).toString();
        if (query) {
            path += '?' + query
        }
        return this.get(path, {
            headers: {
                'Accept': '*'
            }
        });
    }

    public toggleStar(id) {
        return this.post( 
            this.url + `/${id}/star`,
            [], 
            {
                'Content-Type': 'application/json'
            }
        );
    }

    public bulkDelete(payload) {
        return this.post( 
            this.url + `/bulk-delete`,
            payload, 
             {
                'Content-Type': 'application/json'
            }
        );
    }

    public handleCreate(ui_element_id, data) {
        const alertStore = useAlertStore();
        const globalUserState = useGlobalStateStore();
        globalUserState.setElementLoading(ui_element_id, true);
        return this.store(this.transformPayloadForSubmission(data), {'Content-Type': 'multipart/form-data'}).then((response) => {
            let answer = response.data;
            alertStore.success(answer.message);
            return response;
        }).catch((error) => {
            alertStore.error(getResponseError(error));
        }).finally(() => {
            globalUserState.setElementLoading(ui_element_id, false);
        })
    }

    public handleUpdate(ui_element_id, object_id, data) {
        const alertStore = useAlertStore();
        const globalUserState = useGlobalStateStore();
        globalUserState.loadingElements[ui_element_id] = true;
        return this.update(object_id, this.transformPayloadForSubmission(data), {'Content-Type': 'multipart/form-data'}).then((response) => {
            let answer = response.data;
            alertStore.success(answer.message);
            return response;
        }).catch((error) => {
            alertStore.error(getResponseError(error));
            return error;
        }).finally(() => {
            globalUserState.loadingElements[ui_element_id] = false;
        })
    }

    public transformPayloadForSubmission(payload) {
        let data = new FormData();
        for (let key in payload) {
            let val = payload[key];
            if (typeof val === "boolean") {
                let value = (val) ? '1' : '0';
                data.append(key, value);                
            } else if (Array.isArray(val)) {
                for (let index in val) {
                    data.append(key + '[]', val[index]);
                }
            } else {
                data.append(key, val);
            }
        }
        return data;
    }
}
