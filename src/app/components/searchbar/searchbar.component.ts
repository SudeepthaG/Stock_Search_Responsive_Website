import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith,  debounceTime, distinctUntilChanged,tap} from 'rxjs/operators';
import {HttpService} from "../../http.service";
import { Router } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


export interface AutoComplete {
  name: string;
  ticker: string;
}

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css'],
  encapsulation: ViewEncapsulation.None
})


export class SearchbarComponent implements OnInit {

  constructor(private _http: HttpService, private _router: Router) { }
  searchname: string = '';
  myControl = new FormControl();
  searchresult: string[]=['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  enteredTicker: string;
  autoComplete : Object;
  isLoading = false;
  filteredStates: Observable<AutoComplete[]>;
  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    this.myControl.valueChanges
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        tap(() => this.isLoading = true)
      )
      .subscribe(ticker => {
        if (ticker != "") {
          this._http.getAutoCompleteResults(ticker).subscribe((data) => {
            this.autoComplete = data as any[];
            this.isLoading = false;
          })
        }
      })

    this.filteredStates = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value: value.name),
        map(name => name ? this._filterStates(name) : this.autoCompletes.slice())
      );

  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.searchresult.filter(searchval => searchval.toLowerCase().includes(filterValue));
  }



  displayFn(autoComplete: AutoComplete): string {
    return autoComplete && autoComplete.ticker ? autoComplete.ticker : '';
  }
  autoCompletes: AutoComplete[] = [
  ];

  private _filterStates(value: string): AutoComplete[] {
    const filterValue = value.toLowerCase();
    return this.autoCompletes.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
  }

  getTickerDetails() {
    console.log("entered get ticker details")
    if (this.myControl.value == null) {
      return;
    }
    this.enteredTicker = this.myControl.value.ticker;
    if (this.enteredTicker == undefined) {
      return;
    }
    this._router.navigate(['/details', this.enteredTicker])
  }
}
