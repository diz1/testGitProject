import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

interface SearchParamsI {
  q: string,
  sort?: string | 'stars' | 'forks' | 'help-wanted-issues' | 'updated',
  order?: string | 'desc' | 'asc',
  page?: number,
  per_page?: number
}

interface getRepoI {
  owner: string,
  repo: string
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchParams: SearchParamsI = {
    q: 'angular',
    sort: '',
    order: '',
    page: 1,
    per_page: 30
  }

  constructor(private api: ApiService) {}

  searchRepos(params: SearchParamsI): Observable<any> {
    if (params) {
      Object.entries(params).forEach((entries) => {
        this.updateSearchParams(entries)
      })
    }
    return this.api.get('search/repositories', this.searchParams)
  }

  getRepoCommits(params: getRepoI): Observable<any> {
    return this.api.get(`repos/${params.owner}/${params.repo}/commits`)
  }

  updateSearchParams([key, value]: any): void {
    if (value) {
      (this.searchParams as any)[key] = value
    }
  }
}
