import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import { Subject } from "rxjs";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { debounceTime, takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit, OnDestroy {
  form: FormGroup | any
  componentDestroyed$ = new Subject()
  @Output() search: EventEmitter<string> = new EventEmitter()

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      search: new FormControl('')
    })

    this.form?.controls.search.valueChanges
      .pipe(debounceTime(300), takeUntil(this.componentDestroyed$))
      .subscribe(
        (val: string) => {
          this.search.emit(val)
        }
      )
  }

  clearForm(): void {
    (this.form?.controls.search as FormControl).reset('')
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next()
    this.componentDestroyed$.complete()
  }
}
