import { Component, EventEmitter, Output } from '@angular/core';
import { MatSelectChange } from "@angular/material/select";
import { IGetReposSearchParams } from "../../interfaces/github.interface";
import {SearchService} from "../../services/search.service";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  @Output() filter: EventEmitter<IGetReposSearchParams> = new EventEmitter<IGetReposSearchParams>()

  sortItems = [
    {
      value: 'stars',
      viewValue: 'Stars'
    },
    {
      value: 'forks',
      viewValue: 'Forks'
    },
    {
      value: 'help-wanted-issues',
      viewValue: 'Help wanted issue'
    },
    {
      value: 'updated',
      viewValue: 'Updated'
    },
  ]
  orderItems = [
    {
      value: 'asc',
      viewValue: 'ASC'
    },
    {
      value: 'desc',
      viewValue: 'DESC'
    }
  ]

  constructor(public searchService: SearchService) { }

  changeFilter(event: MatSelectChange, type: string) {
    this.filter.emit({ q: '', [type]: event.value })
  }
}
