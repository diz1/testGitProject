import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { SearchService } from "../../services/search.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  componentDestroyed$ = new Subject()
  commits: any = []
  loading = true

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    const params = (this.route.snapshot.params as { owner: string, repo: string })

    this.searchService.getRepoCommits(params)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
        commits => {
          this.commits = commits
          this.loading = false
        }
      )
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next()
    this.componentDestroyed$.complete()
  }
}
