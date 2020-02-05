import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
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

	selectData(asMap: true);
	selectData(asMap: boolean) {
		return asMap
			? this.selectAll({ asObject: true }).pipe(
					map(map => {
						return Object.keys(map).reduce((acc, key) => {
							acc[key] = { ...map[key], VM: true };
							return acc;
						}, {});
					})
			  )
			: this.selectUserVMs();
	}

	getIdKey(): string | number {
		return this.store.idKey;
	}

	remove() {
		this.store.remove();
	}
}
