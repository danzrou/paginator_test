import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PaginationResponse } from '../../pagination/models/pagination';
import { PagingRequest } from '../../pagination/models/paging';
import { toPaginationResponse } from '../../pagination/pagination.helpers';
import { DummyServer } from '../../server/dummy-server';
import { USERS_MOCK } from '../../server/user-data';
import { User } from './user';
import { TempDataSource } from '../../pagination/models/data-source';

@Injectable({
	providedIn: 'root'
})
export class UserServiceStub {
	private server = new DummyServer(USERS_MOCK);
	private ds = new TempDataSource('UsersStub');

	getPage(request: PagingRequest): Observable<PaginationResponse<User>> {
		return this.server.getData(request).pipe(
			toPaginationResponse(request),
			tap(data => this.ds.setData(data))
		);
	}

	getDataSource() {
		return this.ds;
	}
}
