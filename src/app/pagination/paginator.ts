import { Inject, Injectable, Optional } from '@angular/core';
import { BehaviorSubject, interval, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, finalize, map, take, takeUntil, tap } from 'rxjs/operators';
import { PAGINATOR_CONFIG } from './injection-tokens';
import { PaginationDataRequest, PaginationResponse } from './models/pagination';
import { PaginatorConfig } from './paginator.config';

@Injectable()
export class Paginator<T = any> {
	_pagination$ = new BehaviorSubject<PaginationResponse<T>>({
		currentPage: 0,
		data: [],
		pageSize: 10,
		totalPages: 0,
		totalRecords: 0,
		searchTerm: ''
	});

	isLoading$ = new BehaviorSubject(false);

	protected config: PaginatorConfig;
	protected pages = new Map<number, (string | number)[]>([]);
	private cancelRequest$ = new Subject();

	constructor(@Optional() @Inject(PAGINATOR_CONFIG) config: Partial<PaginatorConfig> = {}) {
		this.config = new PaginatorConfig(config);
	}

	get isLoading() {
		return this.isLoading$.asObservable();
	}

	get pagination(): PaginationResponse<T> {
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

	get isFirst() {
		return this.currentPage === 0;
	}

	get isFirst$() {
		return this.pagination$.pipe(map(pagination => pagination.currentPage === 0));
	}

	get isLast$() {
		return this.pagination$.pipe(
			map(pagination => pagination.currentPage === pagination.totalPages - 1)
		);
	}

	get from() {
		return this.pagination$.pipe(
			map(() => (this.isFirst ? 1 : this.currentPage * this.pageSize + 1))
		);
	}

	get to() {
		return this.pagination$.pipe(
			map(() =>
				this.isLast ? this.pagination.totalRecords : (this.currentPage + 1) * this.pageSize
			)
		);
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

	lastPage() {
		this.setPage(this.pagination.totalPages - 1);
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
		if (this.currentPage >= 0) {
			this.setPage(this.currentPage);
		}
	}

	search(searchTerm: string): void {
		this.setPagination({ searchTerm, currentPage: 0 });
		this.fetchPage();
	}

	setPage(page: number): void {
		this.setPagination({ currentPage: page });
		this.fetchPage();
	}

	setPageSize(pageSize: number): void {
		this.setPagination({ pageSize });
		this.fetchPage();
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

	setDataRequest(request: PaginationDataRequest<T>): this {
		this.config.getPageRequest = request;
		return this;
	}

	setDataSource(source: Observable<T[]>) {
		this.config.dataSource = source;
		return this;
	}

	append(): this {
		this.config.append = true;
		return this;
	}

	setIdKey(idKey: string) {
		this.config.idKey = idKey;
		return this;
	}

	makeRequests(make: boolean) {
		this.config.makeRequests = make;
		return this;
	}

	protected setPagination(config: Partial<PaginationResponse<T>>) {
		this._pagination$.next({
			...this.pagination,
			...config
		});
	}

	protected fetchPage() {
		if (this.config.makeRequests) {
			this.cancelRequest$.next();
			if (!this.config.getPageRequest) {
				throw new Error('Data request is not defined');
			}

			this.setLoading(true);
			let obs: Observable<any>;
			if (this.isCurrentPageInCache()) {
				obs = this.getPageFromCache();
			} else {
				obs = this.fetchPageRequest();
			}

			obs
				.pipe(
					takeUntil(this.cancelRequest$),
					finalize(() => this.setLoading(false))
				)
				.subscribe();
		}
	}

	protected updatePage(data: T[]) {
		this.pages.set(
			this.currentPage,
			data.map(d => d[this.config.idKey])
		);
	}

	protected filterPage(data: T[]) {
		const currentPage = this.pages.get(this.currentPage);
		return data.filter(item => currentPage.includes(item[this.config.idKey]));
	}

	protected fetchPageRequest() {
		return this.config
			.getPageRequest({
				pageSize: this.pagination.pageSize,
				requestedPage: this.currentPage,
				searchTerm: this.pagination.searchTerm
			})
			.pipe(
				tap(data => {
					this.onPaginationResponse(data);
				})
			);
	}

	protected isCurrentPageInCache() {
		return this.pages.has(this.currentPage);
	}

	protected onPaginationResponse(data: PaginationResponse<T>) {
		this.setPagination(data);
		this.updatePage(data.data);
		this.initTTL(data);
	}

	protected getPageFromCache() {
		return this.config.dataSource.pipe(
			take(1),
			map(data => this.filterPage(data)),
			tap(data => this.setPagination({ data }))
		);
	}

	protected initTTL(data: PaginationResponse<T>) {
		interval(this.config.cacheTTL)
			.pipe(take(1))
			.subscribe(() => this.pages.delete(data.currentPage));
	}
}
