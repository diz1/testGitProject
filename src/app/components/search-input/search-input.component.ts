import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from "rxjs";
import { FormControl, FormGroup } from "@angular/forms";
import { debounceTime, takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit, OnDestroy {
  @Output() search: EventEmitter<string> = new EventEmitter<string>()
  form: FormGroup = new FormGroup({
    search: new FormControl('angular')
  })
  componentDestroyed$ = new Subject()

  constructor() { }

  ngOnInit(): void {
    (this.form.controls.search as FormControl).valueChanges
      .pipe(debounceTime(350), takeUntil(this.componentDestroyed$))
      .subscribe(
        (val: string) => {
          this.search.emit(val)
        }
      )
  }

  clearForm(): void {
    (this.form.controls.search as FormControl).reset('')
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next()
    this.componentDestroyed$.complete()
  }
}
