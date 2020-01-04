import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PagingRequest, PagingResponse } from '../pagination/models/paging';

export class DummyServer<T> {
	constructor(private data: T[]) {}

	getData(pagingRequest: PagingRequest): Observable<PagingResponse<T>> {
		const { pageSize, requestedPage, searchTerm } = pagingRequest;
		const data = this.getDataPerPage(pageSize, requestedPage).filter(item =>
			this.filterBySearchTerm(item, searchTerm)
		);
		return of({
			metadata: {
				totalNumberOfPages: this.getTotalPages(pageSize),
				totalRecordsCount: this.data.length
			},
			objectsList: data
		}).pipe(delay(1000));
	}

	private getDataPerPage(pageSize: number, requestedPage: number) {
		const filteredUsers = [];
		const startIndex = requestedPage * pageSize;

		for (let i = 0, k = startIndex; i < pageSize; i++, k++) {
			filteredUsers.push(this.data[k]);
		}

		return filteredUsers;
	}

	private filterBySearchTerm(item: any, searchTerm: string) {
		return Object.entries(item)
			.filter(([key, value]) => typeof value === 'string')
			.some(([key, value]: [string, string]) =>
				value.toLowerCase().includes(searchTerm.toLowerCase())
			);
	}

	private getTotalPages(pageSize: number) {
		return Math.ceil(this.data.length / pageSize);
	}
}
