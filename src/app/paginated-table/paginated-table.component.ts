import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { PAGINATOR } from '../pagination/injection-tokens';
import { Paginator } from '../pagination/paginator';

@Component({
	selector: 'app-paginated-table',
	templateUrl: './paginated-table.component.html',
	styleUrls: ['./paginated-table.component.scss']
})
export class PaginatedTableComponent implements OnInit {
	searchTerm = new FormControl('');
	data$ = this.paginator.getDataSource();
	isLoading$ = this.paginator.isLoading;

	constructor(@Inject(PAGINATOR) private paginator: Paginator) {}

	ngOnInit() {
		this.subToSearch();
		this.refresh();
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
}
