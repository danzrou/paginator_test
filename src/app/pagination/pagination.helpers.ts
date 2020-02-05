import { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginationResponse } from './models/pagination';
import { PagingRequest, PagingResponse } from './models/paging';

export function toPaginationResponse<T>(
	request: PagingRequest,
	config?: { dataMapper?(data: T[]): any[] }
): OperatorFunction<PagingResponse<T>, PaginationResponse<T>> {
	const mergedConfig = { dataMapper: data => data, ...config };
	return (source: Observable<PagingResponse<T>>): Observable<PaginationResponse<T>> => {
		return source.pipe(
			map(pagingResponse => ({
				pageSize: request.pageSize,
				currentPage: request.requestedPage,
				data: mergedConfig.dataMapper(pagingResponse.objectsList),
				searchTerm: request.searchTerm,
				totalPages: pagingResponse.metadata.totalNumberOfPages,
				totalRecords: pagingResponse.metadata.totalRecordsCount
			}))
		);
	};
}
