import { Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Paginator } from '../paginator';
import { PaginatorConfig } from '../paginator.config';
import { PaginationResponse } from './pagination';

export abstract class PaginatedComponent<T = any> implements OnInit, OnDestroy {
	@Input() config: Partial<PaginatorConfig>;

	isLoading$: Observable<boolean>;
	dataSource$: Observable<T[]>;
	pagination$: Observable<PaginationResponse<T>>;

	constructor(protected paginator?: Paginator<T>) {
		this.initializeSelectors();
	}

	get pagination() {
		return this.paginator.pagination;
	}

	ngOnInit() {
		if (this.config) {
			this.paginator = new Paginator(this.config);
			this.initializeSelectors();
		}
		this.paginator.firstPage();
	}

	ngOnDestroy() {
		this.paginator.destroy();
	}

	nextPage() {
		this.paginator.nextPage();
	}

	prevPage() {
		this.paginator.prevPage();
	}

	refresh() {
		this.paginator.refreshCurrentPage();
	}

	search(term: string) {
		this.paginator.search(term);
	}

	firstPage() {
		this.paginator.firstPage();
	}

	lastPage() {
		this.paginator.lastPage();
	}

	getPaginator() {
		return this.paginator;
	}

	protected initializeSelectors() {
		if (this.paginator) {
			this.isLoading$ = this.paginator.isLoading$;
			this.dataSource$ = this.paginator.dataSource.selectData(false) as Observable<T[]>;
		}
	}
}
