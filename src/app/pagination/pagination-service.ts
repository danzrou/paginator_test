import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, OperatorFunction } from 'rxjs';
import { finalize, map, switchMap, tap } from 'rxjs/operators';
import { DummyServer } from '../server/dummy-server';
import { User } from '../user';
import { DataSource } from './data-source';
import { PaginationResponse, Paginator } from './paginator';

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

export interface PagingService<T> {
  getPage(request: PagingRequest): Observable<PaginationResponse<T>>;
}

function pagingToPaginationResponse<T>(request: PagingRequest): OperatorFunction<PagingResponse<T>, PaginationResponse<T>> {
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
export class UserService implements PagingService<User> {
  private server = new DummyServer();
  private paginator: Paginator;
  ds: DataSource;


  getPage(request: PagingRequest): Observable<PaginationResponse<User>> {
    this.paginator.setLoading(true);
    return this.server.getUsers(request).pipe(
      pagingToPaginationResponse(request),
      finalize(() => this.paginator.setLoading(false))
    );
  }

  setDs(ds) {
    this.ds = ds;
  }

  subscribeToPaginator(paginator: Paginator) {
    this.paginator = paginator;
    combineLatest([this.paginator.pageChanges, this.paginator.searchChanges]).pipe(
      switchMap(([page, searchTerm]) => {
        const paginRequest: PagingRequest = {
          searchTerm,
          requestedPage: this.paginator.currentPage,
          pageSize: this.paginator.pageSize
        };

        return this.getPage(paginRequest);
      }),
      tap(result => this.ds.setData(result))
    ).subscribe();
  }
}
