import ModelService from "@/services/ModelService";

export default class ReportService extends ModelService {

    constructor() {
        super();
        this.url = 'v1/report';
    }

    public sellsByAdvisors(params = {}) {
      let path = this.url + `/sells-by-advisor`;
      let query = new URLSearchParams(params).toString();
      if (query) {
          path += '?' + query
      }
      return this.get( 
          path,
          null, 
           {
              'Content-Type': 'application/json'
          }
      );
    }

    public dealStatus(params = {}) {
        let path = this.url + `/deal/status`;
        let query = new URLSearchParams(params).toString();
        if (query) {
            path += '?' + query
        }
        return this.get(path, null, {
            'Content-Type': 'application/json'
        });
    }

    public dealSource(params = {}) {
        let path = this.url + `/deal/source`;
        let query = new URLSearchParams(params).toString();
        if (query) {
            path += '?' + query
        }
        return this.get(path, null, {
            'Content-Type': 'application/json'
        });
    }

    public branch(params = {}) {
        let path = this.url + `/branch`;
        let query = new URLSearchParams(params).toString();
        if (query) {
            path += '?' + query
        }
        return this.get(path, null, {
            'Content-Type': 'application/json'
        });
    }

    public branchPeriod(params = {}) {
        let path = this.url + `/branch-period`;
        let query = new URLSearchParams(params).toString();
        if (query) {
            path += '?' + query
        }
        return this.get(path, null, {
            'Content-Type': 'application/json'
        });
    }

    public owner(params = {}) {
        let path = this.url + `/owner`;
        let query = new URLSearchParams(params).toString();
        if (query) {
            path += '?' + query
        }
        return this.get(path, null, {
            'Content-Type': 'application/json'
        });
    }

    public ownerPeriod(params = {}) {
        let path = this.url + `/owner-period`;
        let query = new URLSearchParams(params).toString();
        if (query) {
            path += '?' + query
        }
        return this.get(path, null, {
            'Content-Type': 'application/json'
        });
    }

    public userAudit(params = {}) {
        let path = this.url + `/user/audit`;
        let query = new URLSearchParams(params).toString();
        if (query) {
            path += '?' + query
        }
        return this.get(path, null, {
            'Content-Type': 'application/json'
        });
    }

    public userReport(userId, params = {}) {
        let path = this.url + `/reporte-de-asesor/${userId}`;
        let query = new URLSearchParams(params).toString();
        if (query) {
            path += '?' + query
        }
        return this.get(path, null, {
            'Content-Type': 'application/json'
        });
    }
}
