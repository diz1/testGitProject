import { Injectable} from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { ApiService } from "./api.service";
import {
  IGetRepoParams, IGetRepoPullsResponse,
  IGetRepoResponse, IGetReposResponse,
  IGetReposSearchParams
} from "../interfaces/github.interface";
import { trimObj } from "../utils/object.util";
import { IReposItem } from "../interfaces/github.interface";

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private _currentRepo$ = new BehaviorSubject<IReposItem | null>(null)
  private _currentRepoPulls$ = new BehaviorSubject<IGetRepoPullsResponse[] | null>(null)
  private _repos$ = new BehaviorSubject<IReposItem[] | null>(null)
  private _totalItems$ = new BehaviorSubject<number>(0)
  private _searchParams$ = new BehaviorSubject<IGetReposSearchParams>({
    q: 'angular',
    sort: '',
    order: '',
    page: 1,
    per_page: 30
  })
  searchParams$ = this._searchParams$.asObservable()
  totalItems$ = this._totalItems$.asObservable()
  currentRepoPulls$ = this._currentRepoPulls$.asObservable()
  currentRepo$ = this._currentRepo$
  repos$ = this._repos$

  constructor(private api: ApiService) {}

  searchRepos(params: IGetReposSearchParams = this._searchParams$.value): void {
    this._repos$.next(null)
    this._searchParams$.next({
      ...this._searchParams$.value,
      ...trimObj<IGetReposSearchParams>(params)
    })

    this.api.get('search/repositories', this._searchParams$.value)
      .subscribe({
        next: (response: IGetReposResponse) => {
          this._repos$.next(response.items as IReposItem[])
          this._totalItems$.next(response.total_count as number)
        }
      })
  }

  getRepo(params: IGetRepoParams): void {
    this._currentRepo$.next(null)

    this.api.get(`repos/${params.owner}/${params.repo}`)
      .subscribe({
        next: (response: IGetRepoResponse) => {
          this._currentRepo$.next(response as IReposItem)
        }
      })
  }

  getRepoPulls(params: IGetRepoParams): void {
    this._currentRepoPulls$.next(null)

    this.api.get(`repos/${params.owner}/${params.repo}/pulls`)
      .subscribe({
        next: (response: IGetRepoPullsResponse[]) => {
          this._currentRepoPulls$.next(response as IGetRepoPullsResponse[])
        }
      })
  }
}
