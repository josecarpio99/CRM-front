import ModelService from "@/services/ModelService";

export default class ContactService extends ModelService {

    constructor() {
        super();
        this.url = 'v1/contact';
    }
}
