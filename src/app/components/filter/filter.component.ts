import { Component, EventEmitter, Output } from '@angular/core';
import { MatSelectChange } from "@angular/material/select";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  @Output() filterChanged: EventEmitter<any> = new EventEmitter<any>()
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

  constructor() { }

  changeFilter(event: MatSelectChange, type: string) {
    this.filterChanged.emit({ [type]: event.value })
  }
}
