import { EntityState, EntityStore, getEntityType, HashMap, QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { PaginationResponse } from './pagination';

export interface PaginationDataSource<T = any> {
	selectData(asMap: true): Observable<HashMap<T>>;
	selectData(asMap?: boolean): Observable<T[] | HashMap<T>>;
	getIdKey(): string | number;
	remove(): void;
	destroy?(): void;
}

export class TempDataSource<S extends EntityState, T = getEntityType<S>>
	implements PaginationDataSource<T> {
	store: EntityStore<S>;
	query: QueryEntity<S>;

	constructor(storeName: string, private idKey: string = 'id') {
		this.store = new EntityStore<S>({}, { idKey, resettable: true, name: storeName });
		this.query = new QueryEntity<S>(this.store);
	}

	remove() {
		this.store.remove();
	}

	selectData(asMap: true): Observable<HashMap<T>>;
	selectData(asMap: boolean = false): Observable<T[] | HashMap<T>> {
		return asMap ? this.query.selectAll({ asObject: true }) : this.query.selectAll();
	}

	getIdKey() {
		return this.idKey;
	}

	destroy(): void {
		this.store.destroy();
		this.store = null;
		this.query = null;
	}

	setData(data: PaginationResponse<T>) {
		this.store.add(data.data as getEntityType<S>[]);
	}
}
