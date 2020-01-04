import { Input, OnDestroy, OnInit } from '@angular/core';
import { Paginator } from '../paginator';
import { PaginatorConfig } from '../paginator.config';

export abstract class PaginatedComponent<T = any> implements OnInit, OnDestroy {
	@Input() config: Partial<PaginatorConfig>;

	data$ = this.paginator.data$;
	isLoading$ = this.paginator.isLoading;
	dataSource$ = this.paginator.dataSource$;
	isFirst$ = this.paginator.isFirst$;
	isLast$ = this.paginator.isLast$;
	currentPage$ = this.paginator.pageChanges;
	searchTerm$ = this.paginator.searchChanges;
	from$ = this.paginator.from$;
	to$ = this.paginator.to$;
	totalPages$ = this.paginator.totalPages$;
	totalRecords$ = this.paginator.totalRecords$;

	protected constructor(protected paginator: Paginator<T>) {}

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
		this.data$ = this.paginator.data$;
		this.isLoading$ = this.paginator.isLoading;
		this.dataSource$ = this.paginator.dataSource$;
		this.isFirst$ = this.paginator.isFirst$;
		this.isLast$ = this.paginator.isLast$;
		this.currentPage$ = this.paginator.pageChanges;
		this.searchTerm$ = this.paginator.searchChanges;
		this.from$ = this.paginator.from$;
		this.to$ = this.paginator.to$;
		this.totalPages$ = this.paginator.totalPages$;
		this.totalRecords$ = this.paginator.totalRecords$;
	}
}
