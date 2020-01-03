import { Injectable } from '@angular/core';
import { Observable, OperatorFunction } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DummyServer } from '../server/dummy-server';
import { User } from '../user';
import { DataSource } from './data-source';
import { PaginationResponse } from './paginator';

export interface PagingRequest {
	pageSize: number;
	searchTerm: string;
	requestedPage: number;
}

export interface PagingMetadata {
	totalRecordsCount: number;
	totalNumberOfPages: number;
}

export interface PagingResponse<T> {
	objectsList: T[];
	metadata: PagingMetadata;
}

export interface PaginationService<T> {
	getPage(request: PagingRequest): Observable<PaginationResponse<T>>;
}

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

@Injectable({
	providedIn: 'root'
})
export class UserService implements PaginationService<User> {
	private server = new DummyServer();

	constructor(private ds: DataSource) {}

	getPage(request: PagingRequest): Observable<PaginationResponse<User>> {
		console.log('getData called');
		return this.server.getUsers(request).pipe(
			pagingToPaginationResponse(request),
			tap(data => this.ds.setData(data.data))
		);
	}
}
