import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DummyServer } from '../../server/dummy-server';
import { User } from '../../user';
import { DataSource } from './data-source';
import { PaginationResponse, PaginationService } from '../models/pagination';
import { PagingRequest } from '../models/paging';
import { pagingToPaginationResponse } from '../pagionation.helpers';

@Injectable({
	providedIn: 'root'
})
export class UserService implements PaginationService<User> {
	private server = new DummyServer();

	constructor(private ds: DataSource) {}

	getPage(request: PagingRequest): Observable<PaginationResponse<User>> {
		return this.server.getUsers(request).pipe(
			pagingToPaginationResponse(request),
			tap(data => this.ds.setData(data.data))
		);
	}
}
