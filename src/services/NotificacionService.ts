import ModelService from "@/services/ModelService";

export default class NotificacionService extends ModelService {

    constructor() {
        super();
        this.url = 'v1/notification';
    }

    public markAsRead(id = null) {      
      let url = this.url + '/mark-as-read';

      if (id) {
        url = url + `/?id=${id}`;        
      }

      return this.post(
        this.url + '/mark-as-read',
        {id}, 
             {
                'Content-Type': 'application/json'
            }
        );
  }
}
