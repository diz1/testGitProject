import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { SearchService } from "../../services/search.service";
import { IGetRepoParams } from "../../interfaces/github.interface";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    public searchService: SearchService
  ) { }

  ngOnInit(): void {
    const params = (this.route.snapshot.params as IGetRepoParams)
    const currentRepo = this.searchService.currentRepo$.value

    if (params.owner !== currentRepo?.owner?.login || params.repo !== currentRepo?.name) {
      this.searchService.getRepo(params)
      this.searchService.getRepoPulls(params)
    }
  }
}
