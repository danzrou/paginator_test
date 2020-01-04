import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PaginationResponse } from '../../pagination/models/pagination';
import { PagingRequest } from '../../pagination/models/paging';
import { pagingToPaginationResponse } from '../../pagination/pagionation.helpers';
import { DummyServer } from '../../server/dummy-server';
import { USERS_MOCK } from '../../server/user-data';
import { User } from './user';
import { DataSource } from '../data-source';

@Injectable({
	providedIn: 'root'
})
export class UserServiceStub {
	private server = new DummyServer(USERS_MOCK);
	private ds = new DataSource();

	getPage(request: PagingRequest): Observable<PaginationResponse<User>> {
		return this.server.getData(request).pipe(
			pagingToPaginationResponse(request),
			tap(data => this.ds.setData(data))
		);
	}

	getDataSource() {
		return this.ds;
	}
}
