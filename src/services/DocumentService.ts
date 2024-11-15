import ModelService from "@/services/ModelService";

export default class DocumentService extends ModelService {

    constructor() {
        super();
        this.url = 'v1/document';
    }
}
