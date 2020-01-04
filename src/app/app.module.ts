import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AppComponent } from './app.component';
import { PaginatedTableComponent } from './paginated-table/paginated-table.component';
import { UserTableComponent } from './paginated-table/user-table/user-table.component';

@NgModule({
	declarations: [AppComponent, PaginatedTableComponent, UserTableComponent],
	imports: [BrowserModule, ReactiveFormsModule, AkitaNgDevtools.forRoot()],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
