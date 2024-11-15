import ModelService from "@/services/ModelService";

export default class LeadService extends ModelService {

    constructor() {
        super();
        this.url = 'v1/lead';
    }

    public convert(id, payload) {
        return this.post( 
            this.url + `/${id}/convert`,
            payload, 
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
}
