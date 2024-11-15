import ModelService from "@/services/ModelService";

export default class TaskService extends ModelService {

    constructor() {
        super();
        this.url = 'v1/task';
    }
}
