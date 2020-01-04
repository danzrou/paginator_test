import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, map } from 'rxjs/operators';
import { PAGINATOR } from '../pagination/injection-tokens';
import { Paginator } from '../pagination/paginator';

@Component({
	selector: 'app-paginated-table',
	templateUrl: './paginated-table.component.html',
	styleUrls: ['./paginated-table.component.scss']
})
export class PaginatedTableComponent implements OnInit {
	searchTerm = new FormControl('');
	data$ = this.paginator.data$;
	isLoading$ = this.paginator.isLoading;
	pagination$ = this.paginator.pagination$;

	isFirst$ = this.paginator.isFirst$;
	isLast$ = this.paginator.isLast$;
	currentPage$ = this.paginator.pageChanges;
	search$ = this.paginator.searchChanges;
	from$ = this.paginator.from$;
	to$ = this.paginator.to$;

	constructor(@Inject(PAGINATOR) private paginator: Paginator) {}

	ngOnInit() {
		this.subToSearch();
		this.paginator.firstPage();
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

	private subToSearch() {
		this.searchTerm.valueChanges.pipe(debounceTime(300)).subscribe(s => this.search(s));
	}

	firstPage() {
		this.paginator.firstPage();
	}

	lastPage() {
		this.paginator.lastPage();
	}
}
