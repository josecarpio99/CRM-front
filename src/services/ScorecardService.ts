import ModelService from "@/services/ModelService";

export default class ScorecardService extends ModelService {

    constructor() {
        super();
        this.url = 'v1/report/scorecard';
    }
}
