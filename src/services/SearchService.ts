import ModelService from "@/services/ModelService";

export default class SearchService extends ModelService {

    constructor() {
        super();
        this.url = 'v1/search';
    }

    public search(phrase) {
        return this.get(this.url + `?search=${phrase}`);
    }

}

