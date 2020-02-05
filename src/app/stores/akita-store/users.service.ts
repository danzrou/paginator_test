import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PaginationResponse } from '../../pagination/models/pagination';
import { PagingRequest } from '../../pagination/models/paging';
import { toPaginationResponse } from '../../pagination/pagination.helpers';
import { DummyServer } from '../../server/dummy-server';
import { USERS_MOCK } from '../../server/user-data';
import { User } from '../user-stub-store/user';
import { UsersStore } from './users.store';

@Injectable({ providedIn: 'root' })
export class UsersService {
	private server = new DummyServer(USERS_MOCK);

	constructor(protected store: UsersStore) {}

	getPage(request: PagingRequest): Observable<PaginationResponse<User>> {
		return this.server.getData(request).pipe(
			toPaginationResponse(request),
			tap(data => this.store.add(data.data))
		);
	}

	update(number: number, param2: { firstName: string }) {
		this.store.update(number, param2);
	}
}
