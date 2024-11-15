import ModelService from "@/services/ModelService";

export default class SmartListService extends ModelService {

    constructor() {
        super();
        this.url = 'v1/smart-list';
    }
}
