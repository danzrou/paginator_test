import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginationDataSource, PaginationResponse } from './pagination';

export class DataSource<T> implements PaginationDataSource {
	data$ = new BehaviorSubject([]);

	dataMapper: Function = (data: T[]) => data;

	constructor(private idKey: string = 'id') {}

	getData(): Observable<T[]> {
		return this.data$.asObservable().pipe(map(data => this.dataMapper(data)));
	}

	getIdKey() {
		return this.idKey;
	}

	clear(): void {
		this.data$ = new BehaviorSubject([]);
	}

	setData(data: PaginationResponse<T>) {
		const _data = this.filterDataIfNeeded(data);
		this.data$.next(_data);
	}

	private filterDataIfNeeded(response: PaginationResponse<T>): T[] {
		return response.searchTerm ? response.data : this.appendData(response.data);
	}

	private appendData(data: T[]) {
		const filtered = [...this.data$.getValue(), ...this.filterExisting(data)];
		return filtered;
	}

	private filterExisting(data: T[]) {
		const current = this.data$.getValue().map(item => item[this.idKey]);
		return data.filter(item => !current.includes(item[this.idKey]));
	}
}
