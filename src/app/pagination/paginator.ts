import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, finalize, map, startWith } from 'rxjs/operators';
import { User } from '../user';
import { PagingRequest } from './pagination-service';

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

export class Paginator<T = any> {
	_pagination$ = new BehaviorSubject<PaginationResponse<User>>({
		currentPage: 0,
		data: [],
		pageSize: 10,
		totalPages: 0,
		totalRecords: 0,
		searchTerm: ''
	});

	isLoading$ = new BehaviorSubject(false);

	protected _getDataRequest: (request: PagingRequest) => Observable<T[]>;
	protected _dataSource: Observable<T[]>;

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
			map(({ currentPage }) => currentPage),
			distinctUntilChanged()
		);
	}

	get searchChanges() {
		return this.pagination$.pipe(
			map(({ searchTerm }) => searchTerm),
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
		this.setPagination({ searchTerm, currentPage: 0 });
		this.getData();
	}

	setPage(page: number): void {
		this.currentPage = page;
		this.getData();
	}

	setPageSize(pageSize: number): void {
		this.setPagination({ pageSize });
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

	setDataRequest(request: (request: PagingRequest) => Observable<any>) {
		this._getDataRequest = request;
	}

	setDataSource(source: Observable<T[]>) {
		this._dataSource = source;
	}

	getDataSource() {
		if (!this._dataSource) {
			throw new Error('Data source is not defined');
		}
		return this._dataSource;
	}

	private setPagination(config: Partial<PaginationResponse<User>>) {
		this._pagination$.next({
			...this.pagination,
			...config
		});
	}

	private getData() {
		if (!this._getDataRequest) {
			throw new Error('Data re`quest is not defined');
		}
		this.setLoading(true);
		this._getDataRequest({
			pageSize: this.pagination.pageSize,
			requestedPage: this.currentPage,
			searchTerm: this.pagination.searchTerm
		})
			.pipe(finalize(() => this.setLoading(false)))
			.subscribe();
	}
}

function isDefined(val: any) {
	return val !== undefined && val != null;
}
