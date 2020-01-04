import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../user';
import { PaginationDataSource } from '../models/pagination';

@Injectable({
	providedIn: 'root'
})
export class DataSource implements PaginationDataSource {
	data$ = new BehaviorSubject([]);

	getData(): Observable<any[]> {
		return this.data$.asObservable();
	}

	setData(data: User[]) {
		const filtered = [...this.data$.getValue(), ...this.filterExisting(data)].sort(
			(a, b) => a.id - b.id
		);
		console.log('filtered', filtered);
		this.data$.next(filtered);
	}

	private filterExisting(data: User[]) {
		const current = this.data$.getValue().map(user => user.id);
		return data.filter(user => !current.includes(user.id));
	}
}
