import { Inject, Injectable, Optional } from '@angular/core';
import { BehaviorSubject, interval, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, finalize, map, take, takeUntil, tap } from 'rxjs/operators';
import { PAGINATOR_CONFIG } from './injection-tokens';
import { PaginationResponse } from './models/pagination';
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
	protected cancelRequest$ = new Subject();

	constructor(@Optional() @Inject(PAGINATOR_CONFIG) config: Partial<PaginatorConfig> = {}) {
		this.setConfig(config);
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

	get isLast() {
		return this.currentPage === this.pagination.totalPages - 1;
	}

	get isFirst$() {
		return this.pagination$.pipe(map(pagination => pagination.currentPage === 0));
	}

	get isLast$() {
		return this.pagination$.pipe(
			map(pagination => pagination.currentPage === pagination.totalPages - 1)
		);
	}

	get from$() {
		return this.pagination$.pipe(
			map(() => (this.isFirst ? 1 : this.currentPage * this.pageSize + 1))
		);
	}

	get to$() {
		return this.pagination$.pipe(
			map(() =>
				this.isLast ? this.pagination.totalRecords : (this.currentPage + 1) * this.pageSize
			)
		);
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

	get data$() {
		return this.pagination$.pipe(map(pagination => pagination.data));
	}

	get dataSource$() {
		return this.config.dataSource.getData();
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
		this.fetchPageIfNeeded();
	}

	setPage(page: number): void {
		this.setPagination({ currentPage: page });
		this.fetchPageIfNeeded();
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

	setConfig(config: Partial<PaginatorConfig> = {}) {
		this.config = new PaginatorConfig(config);
		return this;
	}

	getPage(request: Observable<PaginationResponse<T>>) {
		this.cancelRequest$.next();
		this.setLoading(true);
		let obs: Observable<any>;
		if (this.isCurrentPageInCache()) {
			obs = this.getCurrentPageFromCache();
		} else {
			obs = request.pipe(tap(data => this.onPaginationResponse(data)));
		}

		return obs.pipe(
			takeUntil(this.cancelRequest$),
			finalize(() => this.setLoading(false))
		);
	}

	protected setPagination(config: Partial<PaginationResponse<T>>) {
		this._pagination$.next({
			...this.pagination,
			...config
		});
	}

	protected fetchPageIfNeeded() {
		if (this.config.makeRequests) {
			if (!this.config.getPageRequest) {
				throw new Error('Data request is not defined');
			}
			this.getPage(
				this.config.getPageRequest({
					searchTerm: this.pagination.searchTerm,
					requestedPage: this.pagination.currentPage,
					pageSize: this.pagination.pageSize
				})
			).subscribe();
		}
	}

	protected updatePage(data: T[]) {
		this.pages.set(
			this.currentPage,
			data.map(item => item[this.getIdKey()])
		);
	}

	protected filterPage(data: T[]) {
		const currentPage = this.pages.get(this.currentPage);
		return data.filter(item => currentPage.includes(item[this.getIdKey()]));
	}

	protected isCurrentPageInCache() {
		return this.pages.has(this.currentPage);
	}

	protected onPaginationResponse(data: PaginationResponse<T>) {
		this.setPagination(data);
		this.updatePage(data.data);
		this.initTTL(data);
	}

	protected getCurrentPageFromCache() {
		return this.config.dataSource.getData().pipe(
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

	protected getIdKey() {
		return this.config.dataSource.getIdKey();
	}
}
