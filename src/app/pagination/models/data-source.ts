import { EntityState, EntityStore, getEntityType, QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { PaginationResponse } from './pagination';

export interface PaginationDataSource<T = any> {
	getData(): Observable<T[]>;
	getIdKey(): string | number;
	destroy(): void;
}

export class TempDataSource<S extends EntityState, T = getEntityType<S>>
	implements PaginationDataSource<T> {
	store: EntityStore<S>;
	query: QueryEntity<S>;

	constructor(storeName: string, private idKey: string = 'id') {
		this.store = new EntityStore<S>({}, { idKey, resettable: true, name: storeName });
		this.query = new QueryEntity<S>(this.store);
	}

	getData(): Observable<T[]> {
		return this.query.selectAll();
	}

	getIdKey() {
		return this.idKey;
	}

	destroy(): void {
		this.store.destroy();
		this.query = null;
	}

	setData(data: PaginationResponse<T>) {
		this.store.add(data.data as any);
	}
}
