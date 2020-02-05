import { Inject, Injectable, Optional } from '@angular/core';
import { HashMap } from '@datorama/akita';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { map, switchMap, take, takeUntil } from 'rxjs/operators';
import { PAGINATOR_CONFIG } from './injection-tokens';
import { PaginationResponse } from './models/pagination';
import { PaginatorConfig } from './paginator.config';

export type PagingChanges = Pick<PaginationResponse, 'searchTerm' | 'currentPage'>;

@Injectable()
export class Paginator<T = any> {
	pagination: PaginationResponse<T>;

	protected pageChanges: BehaviorSubject<PagingChanges>;
	protected isLoading = new BehaviorSubject(false);
	protected config: PaginatorConfig;
	protected pages = new Map<number, (string | number)[]>([]);
	protected cancelRequest$ = new Subject();

	constructor(@Optional() @Inject(PAGINATOR_CONFIG) config: Partial<PaginatorConfig> = {}) {
		this.setConfig(config);
		this.initPagination();
	}

	get isLoading$() {
		return this.isLoading.asObservable();
	}

	get currentPage() {
		return this.pageChanges.getValue().currentPage;
	}

	get pageSize() {
		return this.pagination.pageSize;
	}

	get pageChanges$() {
		return this.pageChanges.asObservable();
	}

	get dataSource() {
		return this.config.dataSource;
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
			this.removePage(this.currentPage);
			this.setPage(this.currentPage);
		}
	}

	search(searchTerm: string): void {
		this.clearCache();
		this.setChanges({ searchTerm });
	}

	setPage(currentPage: number): void {
		this.setChanges({ currentPage });
	}

	setChanges(changes: Partial<PagingChanges>) {
		this.pageChanges.next({
			...this.pageChanges.getValue(),
			...changes
		});
	}

	hasNext(): boolean {
		return this.currentPage + 1 < this.pagination.totalPages;
	}

	hasPrev(): boolean {
		return this.currentPage > 0;
	}

	setLoading(loading: boolean) {
		this.isLoading.next(loading);
	}

	setConfig(config: Partial<PaginatorConfig> = {}) {
		this.config = new PaginatorConfig(config);
		return this;
	}

	getPage(request: Observable<PaginationResponse<T>>): Observable<PaginationResponse<T>> {
		this.cancelRequest$.next();

		if (this.isCurrentPageInCache()) {
			return this.selectPage(this.currentPage);
		} else {
			this.setLoading(true);
			return request.pipe(
				switchMap(response => {
					this.setLoading(false);
					this.onPaginationResponse(response);
					return this.selectPage(response.currentPage);
				}),
				takeUntil(this.cancelRequest$)
			);
		}
	}

	destroy(config: { destroyDataSource?: boolean; clearCache?: boolean } = {}) {
		const merged = { clearCache: true, ...config };
		if (merged.clearCache) {
			this.clearCache();
		}
		if (merged.destroyDataSource) {
			this.destroyDataSource();
		}
		this.initPagination();
	}

	getFrom() {
		return this.isFirst() ? 1 : this.currentPage * this.pageSize + 1;
	}

	getTo() {
		return this.isLast() ? this.pagination.totalRecords : (this.currentPage + 1) * this.pageSize;
	}

	isFirst() {
		return this.currentPage === 0;
	}

	isLast() {
		return this.currentPage === this.pagination.totalPages - 1;
	}

	clearCache() {
		this.pages.clear();
		this.config.clearCacheWithDataSource && this.dataSource.remove();
	}

	removePage(currentPage: number) {
		this.pages.delete(currentPage);
	}

	hasPageInCache(page: number) {
		return this.pages.has(page);
	}

	protected selectPage(page: number): Observable<PaginationResponse<T>> {
		return this.dataSource.selectData(true).pipe(
			take(1),
			map(data => {
				const pagination: PaginationResponse<T> = {
					...this.pagination,
					data: this.getPageData(data, page),
					rangeFrom: this.getFrom(),
					rangeTo: this.getTo(),
					isFirst: this.isFirst(),
					isLast: this.isLast()
				};
				return pagination;
			})
		);
	}

	protected setPagination(pagination: Partial<PaginationResponse<T>>) {
		this.pagination = {
			...this.pagination,
			...pagination
		};
	}

	protected updatePage(data: T[]) {
		this.pages.set(
			this.currentPage,
			data.map(item => item[this.getIdKey()])
		);
	}

	protected isCurrentPageInCache() {
		return this.hasPageInCache(this.currentPage);
	}

	protected onPaginationResponse(data: PaginationResponse<T>) {
		this.setPagination(data);
		this.updatePage(data.data);
		this.initTTL(data);
	}

	protected initTTL(data: PaginationResponse<T>) {
		timer(this.config.cacheTTL)
			.pipe(take(1))
			.subscribe(() => this.removePage(data.currentPage));
	}

	protected getIdKey() {
		return this.config.dataSource.getIdKey();
	}

	protected destroyDataSource() {
		this.config.dataSource.destroy && this.config.dataSource.destroy();
	}

	private initPagination() {
		this.pagination = {
			currentPage: 0,
			data: [],
			pageSize: this.config.pageSize,
			totalPages: 0,
			totalRecords: 0,
			searchTerm: ''
		};

		this.pageChanges = new BehaviorSubject<PagingChanges>({
			currentPage: 0,
			searchTerm: ''
		});
	}

	protected getPageData(data: HashMap<T>, page: number) {
		return this.pages.get(page).map(id => data[id]);
	}
}
