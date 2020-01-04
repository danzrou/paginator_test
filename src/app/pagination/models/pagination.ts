import { Observable } from 'rxjs';
import { PagingRequest } from './paging';

export interface PaginationResponse<T = any> {
	currentPage: number;
	pageSize: number;
	totalPages: number;
	totalRecords: number;
	data: T[];
	searchTerm: string;
	rangeFrom?: number;
	rangeTo?: number;
	isFirst?: boolean;
	isLast?: boolean;
}

export type PaginationDataRequest<T = any> = (
	request: PagingRequest
) => Observable<PaginationResponse<T>>;
