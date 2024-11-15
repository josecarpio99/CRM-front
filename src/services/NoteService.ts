import ModelService from "@/services/ModelService";

export default class NoteService extends ModelService {

    constructor() {
        super();
        this.url = 'v1/note';
    }
}
