import { Observable } from 'rxjs';
import { PagingRequest } from './paging';

export interface PaginationResponse<T = any> {
	currentPage: number;
	pageSize: number;
	totalPages: number;
	totalRecords: number;
	rangeFrom?: number;
	rangeTo?: number;
	data: T[];
	searchTerm: string;
}

export interface PaginationService<T = any> {
	getPage(request: PagingRequest): Observable<PaginationResponse<T>>;
}

export interface PaginationDataSource<T = any> {
	getData(): Observable<T[]>;
}

export type PaginationDataRequest<T = any> = (
	request: PagingRequest
) => Observable<PaginationResponse<T>>;