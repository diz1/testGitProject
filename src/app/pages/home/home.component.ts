import { Component, OnInit } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import { SearchService } from "../../services/search.service";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  componentDestroyed$ = new Subject()
  cards = new BehaviorSubject<Array<any>>([])
  currentPage = 1
  itemsPerPage = 30
  totalItems = 0
  loading = false

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    this.searchRepos()
  }

  searchRepos(params: any = { q: '' }): void {
    this.loading = true
    this.itemsPerPage = params.per_page ?? 30
    this.currentPage = params.page ?? 0
    this.searchService.searchRepos(params)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
        response => {
          if (response.items) {
            this.cards.next(response.items)
            this.totalItems = Math.floor(response.total_count / this.itemsPerPage)
          } else if (response instanceof Array) {
            this.cards.next(response)
          }
          this.loading = false
        }
      )
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next()
    this.componentDestroyed$.complete()
  }
}
