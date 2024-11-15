import ModelService from "@/services/ModelService";

export default class SourceService extends ModelService {

    constructor() {
        super();
        this.url = 'v1/source';
    }
}
