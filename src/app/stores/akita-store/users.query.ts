import { Injectable } from '@angular/core';
import { EntityStore, QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginationDataSource } from '../../pagination/models/data-source';
import { User } from '../user-stub-store/user';
import { UsersState, UsersStore } from './users.store';

@Injectable({ providedIn: 'root' })
export class UsersQuery extends QueryEntity<UsersState> implements PaginationDataSource<User> {
	constructor(protected store: UsersStore) {
		super(store);
	}

	selectUserVMs() {
		return this.selectAll().pipe(map(users => users.map(user => ({ ...user, VM: true }))));
	}

	getData(): Observable<User[]> {
		return this.selectUserVMs();
	}

	getIdKey(): string | number {
		return (this.__store__ as EntityStore).idKey;
	}

	destroy(): void {
		this.__store__.remove();
	}
}
