import ModelService from "@/services/ModelService";

export default class SectorService extends ModelService {

    constructor() {
        super();
        this.url = 'v1/sector';
    }
}
