import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../user';
import { PaginationDataSource } from '../models/pagination';

@Injectable({
	providedIn: 'root'
})
export class DataSource implements PaginationDataSource {
	data$ = new BehaviorSubject(null);

	getData(): Observable<any[]> {
		return this.data$.asObservable();
	}

	setData(data: User[]) {
		this.data$.next(data);
	}
}
