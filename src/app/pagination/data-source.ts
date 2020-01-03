import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../user';

export interface PaginationDataSource<T> {
	getData(): Observable<T[]>;
}

@Injectable({
	providedIn: 'root'
})
export class DataSource implements PaginationDataSource<any> {
	data$ = new BehaviorSubject(null);

	getData(): Observable<any[]> {
		return this.data$.asObservable();
	}

	setData(data: User[]) {
		this.data$.next(data);
	}
}
