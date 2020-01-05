import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { PaginatedComponent } from '../pagination/models/paginated-component';
import { Paginator } from '../pagination/paginator';

@Component({
	selector: 'app-paginated-table',
	templateUrl: './paginated-table.component.html',
	styleUrls: ['./paginated-table.component.scss']
})
export class PaginatedTableComponent extends PaginatedComponent implements OnInit {
	searchTerm = new FormControl('');

	constructor(@Optional() protected paginator: Paginator) {
		super(paginator);
	}

	ngOnInit() {
		this.subToSearch();
		super.ngOnInit();
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
