import ModelService from "@/services/ModelService";

export default class UserService extends ModelService {

    constructor() {
        super();
        this.url = 'v1/user';
    }

    public updateAvatar(id, payload) {
        const formData = new FormData();
        formData.append("avatar", payload.avatar);
        formData.append('_method', 'put');
        return this.post(`/users/${id}/avatar`, formData);
    }

    public syncManagerUser(id, payload) {
        return this.post( 
            this.url + `/${id}/sync-manager-user`,
            payload, 
             {
                'Content-Type': 'application/json'
            }
        );
    }

    public syncBranchUser(id, payload) {
        return this.post( 
            this.url + `/${id}/sync-branch-user`,
            payload, 
             {
                'Content-Type': 'application/json'
            }
        );
    }

}
