import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { User } from '../user';

export interface PaginationResponse<T> {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  rangeFrom?: number;
  rangeTo?: number;
  data: T[];
  searchTerm: string;
}

export class Paginator {
  _pagination$ = new BehaviorSubject<PaginationResponse<User>>({
    currentPage: 0,
    data: [],
    pageSize: 10,
    totalPages: 0,
    totalRecords: 0,
    searchTerm: ''
  });

  isLoading$ = new BehaviorSubject(false);

  get isLoading() {
    return this.isLoading$.asObservable();
  }

  get pagination(): PaginationResponse<User> {
    return this._pagination$.getValue();
  }

  get pagination$() {
    return this._pagination$.asObservable();
  }

  get currentPage() {
    return this.pagination.currentPage;
  }

  get pageSize() {
    return this.pagination.pageSize;
  }

  set currentPage(page: number) {
    this._pagination$.next({
      ...this.pagination,
      currentPage: page
    });
  }

  get isFirst() {
    return this.currentPage === 0;
  }

  get isLast() {
    return this.currentPage === this.pagination.totalPages - 1;
  }

  get pageChanges() {
    return this.pagination$.pipe(
      map(({currentPage}) => currentPage),
      distinctUntilChanged()
    );
  }

  get searchChanges() {
    return this.pagination$.pipe(
      map(({searchTerm}) => searchTerm),
      distinctUntilChanged()
    );
  }

  firstPage(): void {
    this.setPage(0);
  }

  nextPage(): void {
    if (this.hasNext()) {
      this.setPage(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.hasPrev()) {
      this.setPage(this.currentPage - 1);
    }
  }

  refreshCurrentPage(): void {
    if (isDefined(this.currentPage)) {
      this.setPage(this.currentPage);
    }
  }

  search(searchTerm: string): void {
    this.setPagination({searchTerm, currentPage: 0});
  }

  setPage(page: number): void {
    this.currentPage = page;
  }

  setPageSize(pageSize: number): void {
    this.setPagination(({pageSize}));
  }

  hasNext(): boolean {
    return this.currentPage !== this.pagination.totalPages - 1;
  }

  hasPrev(): boolean {
    return this.currentPage > 0;
  }

  setLoading(loading: boolean) {
    this.isLoading$.next(loading);
  }

  private setPagination(config: Partial<PaginationResponse<User>>) {
    this._pagination$.next({
      ...this.pagination,
      ...config
    });
  }
}

function isDefined(val: any) {
  return val !== undefined && val != null;
}
