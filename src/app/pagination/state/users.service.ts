import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DummyServer } from '../../server/dummy-server';
import { User } from '../../user';
import {
	PaginationService,
	PagingRequest,
	pagingToPaginationResponse
} from '../pagination-service';
import { PaginationResponse } from '../paginator';
import { UsersStore } from './users.store';

@Injectable({ providedIn: 'root' })
export class UsersService implements PaginationService<User> {
	private server = new DummyServer();

	constructor(protected store: UsersStore) {}

	getPage(request: PagingRequest): Observable<PaginationResponse<User>> {
		return this.server.getUsers(request).pipe(
			pagingToPaginationResponse(request),
			tap(data => this.store.add(data.data))
		);
	}
}
