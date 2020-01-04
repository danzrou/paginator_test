import { Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Paginator } from '../paginator';
import { PaginatorConfig } from '../paginator.config';
import { PaginationResponse } from './pagination';

export abstract class PaginatedComponent<T = any> implements OnInit, OnDestroy {
	@Input() config: Partial<PaginatorConfig>;

	pagination$: Observable<PaginationResponse<T>>;
	isLoading$: Observable<boolean>;
	dataSource$: Observable<T[]>;

	protected constructor(protected paginator: Paginator<T>) {
		this.initializeSelectors();
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

	protected initializeSelectors() {
		this.pagination$ = this.paginator.pagination$;
		this.isLoading$ = this.paginator.isLoading$;
		this.dataSource$ = this.paginator.dataSource$;
	}
}
