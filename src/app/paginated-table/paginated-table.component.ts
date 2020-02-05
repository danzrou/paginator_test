import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { PagingRequest } from '../pagination/models/paging';
import { Paginator } from '../pagination/paginator';
import { PaginatorConfig } from '../pagination/paginator.config';

@Component({
	selector: 'app-paginated-table',
	templateUrl: './paginated-table.component.html',
	styleUrls: ['./paginated-table.component.scss']
})
export class PaginatedTableComponent implements OnInit, OnDestroy {
	@Input() service: { getPage(request: PagingRequest): any };
	@Input() config: PaginatorConfig;

	searchTerm = new FormControl('');

	pagination$;
	paginator: Paginator;
	isLoading$;
	dataSource$;
	data$;

	ngOnInit() {
		if (this.config) {
			this.paginator = new Paginator(this.config);
			this.initializeSelectors();
		}
		this.subToSearch();
		this.initPaginator();
		this.paginator.firstPage();
	}

	initPaginator() {
		this.pagination$ = combineLatest([this.paginator.pageChanges$, this.paginator.dataSource.selectData()]).pipe(
			switchMap(([changes, data]) =>
				this.paginator.getPage(
					this.service.getPage({
						searchTerm: changes.searchTerm,
						requestedPage: changes.currentPage,
						pageSize: this.paginator.pageSize
					})
				)
			)
		);
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
			this.dataSource$ = this.paginator.dataSource.selectData(false);
		}
	}

	private subToSearch() {
		this.searchTerm.valueChanges
			.pipe(
				debounceTime(300),
				tap(s => console.log(`searchTerm=${s}`))
			)
			.subscribe(s => this.search(s));
	}
}
