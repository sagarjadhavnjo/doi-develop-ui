import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WorkflowService {
    constructor(private http: HttpClient) {}

    getAllModules(): Observable<any[]> {
        return this.http.post<any[]>('http://DESKTOP-TESTSC4:8080/edp/msmodule/modules/201', {});
    }

    getOffices(): Observable<any[]> {
        return this.http.post<any[]>('http://DESKTOP-TESTSC4:8080/edp/lulookupinfo/getbyname/201', {
            name: 'Office Type'
        });
    }

    getDepartments(officeId: Number): Observable<any[]> {
        return this.http.post<any[]>('http://DESKTOP-TESTSC4:8080/edp/msdepartment/officetype/201', { id: officeId });
    }

    getBranches(departmentId: Number): Observable<any[]> {
        return this.http.post<any[]>('http://DESKTOP-TESTSC4:8080/edp/msbranch/getbydepartmentid/301', {
            id: departmentId
        });
    }

    getPosts(): Observable<any[]> {
        return this.http.post<any[]>('http://DESKTOP-TESTSC4:8080/edp/mspost/posts/201', {});
    }

    getUsers(postId: Number): Observable<any[]> {
        return this.http.post<any[]>('http://DESKTOP-TESTSC4:8080/edp/msuser/getbypostid/201', { id: postId });
    }

    getFormsByModule(id: Number): Observable<any[]> {
        return this.http.post<any[]>('http://DESKTOP-TESTSC4:8080/edp/msmoduleinfo/getbymoduleid/201', { id: id });
    }

    saveWorkflow(workflow: any[]): Observable<any[]> {
        return this.http.post<any[]>('http://10.83.50.123:8087/workflow/wfmsworkflow/createList', workflow);
    }

    getRoles(): Observable<any[]> {
        return this.http.post<any[]>('http://DESKTOP-TESTSC4:8080/workflow/wfrole/wfroles/201', {});
    }

    getPermissions(roleId: Number, postId: Number): Observable<any[]> {
        return this.http.post<any[]>('http://DESKTOP-TESTSC4:8080/workflow/wfperm/getbypostid/getbywrfoleid/201', {
            postId: postId,
            roleId: roleId
        });
    }
}
