import { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginationResponse } from './models/pagination';
import { PagingRequest, PagingResponse } from './models/paging';

export function pagingToPaginationResponse<T>(
	request: PagingRequest
): OperatorFunction<PagingResponse<T>, PaginationResponse<T>> {
	return (source: Observable<PagingResponse<T>>): Observable<PaginationResponse<T>> => {
		return source.pipe(
			map(pagingResponse => ({
				pageSize: request.pageSize,
				currentPage: request.requestedPage,
				data: pagingResponse.objectsList,
				searchTerm: request.searchTerm,
				totalPages: pagingResponse.metadata.totalNumberOfPages,
				totalRecords: pagingResponse.metadata.totalRecordsCount
			}))
		);
	};
}
