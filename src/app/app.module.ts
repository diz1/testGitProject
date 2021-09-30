import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardComponent } from './components/card/card.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { HomeComponent } from './pages/home/home.component';
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app-routing.module";
import { FilterComponent } from './components/filter/filter.component';
import {MatSelectModule} from "@angular/material/select";
import {MatOptionModule} from "@angular/material/core";
import {MatPaginatorModule} from "@angular/material/paginator";

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    SearchInputComponent,
    ProfileComponent,
    HomeComponent,
    FilterComponent
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatProgressSpinnerModule,
        RouterModule,
        AppRoutingModule,
        MatSelectModule,
        MatOptionModule,
        MatPaginatorModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
