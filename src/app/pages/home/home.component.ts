import { Component, OnInit } from '@angular/core';
import { SearchService } from "../../services/search.service";
import { IGetReposSearchParams } from "../../interfaces/github.interface";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public searchService: SearchService) {}

  ngOnInit(): void {
    if (!this.searchService.repos$.value) {
      this.searchService.searchRepos()
    }
  }

  onSearchQueryChanged(query: string) {
    if (!query) return

    const params: IGetReposSearchParams = {
      q: query
    }

    this.searchService.searchRepos(params)
  }

  onFilterChange(evt: IGetReposSearchParams) {
    const params: IGetReposSearchParams = {
      ...evt
    }

    this.searchService.searchRepos(params)
  }

  onPaginationChange(event: PageEvent): void {
    const params: IGetReposSearchParams = {
      q: '',
      page: event.pageIndex + 1,
      per_page: event.pageSize
    }

    this.searchService.searchRepos(params)
  }
}
