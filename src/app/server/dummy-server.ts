import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PagingRequest, PagingResponse } from '../pagination/models/paging';
import { User } from '../user';
import { users } from './data';

export class DummyServer {
	getUsers(pagingRequest: PagingRequest): Observable<PagingResponse<User>> {
		const { pageSize, requestedPage, searchTerm } = pagingRequest;
		const us = this.getUserByPage(pageSize, requestedPage).filter(user =>
			this.filterBySearchTerm(user, searchTerm)
		);
		return of({
			metadata: {
				totalNumberOfPages: this.getTotalPages(pageSize),
				totalRecordsCount: users.length
			},
			objectsList: us
		}).pipe(delay(1000));
	}

	private getUserByPage(pageSize: number, requestedPage: number) {
		const filteredUsers = [];
		const startIndex = requestedPage * pageSize;

		for (let i = 0, k = startIndex; i < pageSize; i++, k++) {
			filteredUsers.push(users[k]);
		}

		return filteredUsers;
	}

	private filterBySearchTerm(user: User, searchTerm: string) {
		return (
			user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}

	private getTotalPages(pageSize: number) {
		return Math.ceil(users.length / pageSize);
	}
}
