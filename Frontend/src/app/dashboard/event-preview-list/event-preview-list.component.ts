import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Page} from '../../shared/model/page.model';
import {MatSnackBar, PageEvent} from '@angular/material';
import {SearchEventsDTO} from '../../shared/model/search-events-dto.model';
import {LocationApiService} from '../../core/location-api.service';
import {EventApiService} from '../../core/event-api.service';
import * as moment from 'moment';

@Component({
  selector: 'app-event-preview-list',
  templateUrl: './event-preview-list.component.html',
  styleUrls: ['./event-preview-list.component.scss']
})
export class EventPreviewListComponent implements OnInit {
  private _events: Event[];
  private _page: Page;
  private _eventCategories: string[];
  private _locationsOptions: Location[];
  private _searchParameters: SearchEventsDTO;
  @Output() eventsPageChanged = new EventEmitter<Page>();
  @Output() resetPaginator = new EventEmitter<any>();

  constructor(private _eventApiService: EventApiService, private _locationApiService: LocationApiService,
              private _snackBar: MatSnackBar) {
    this._eventCategories = ['Music', 'Sport', 'Fair', 'Movie', 'Performance', 'Competition'];
    this.getLocationsOptions();
    this._searchParameters = new SearchEventsDTO('', null, null, '', '');
  }

  get events(): Event[] {
    return this._events;
  }

  set events(value: Event[]) {
    this._events = value;
  }

  get page(): Page {
    return this._page;
  }

  set page(value: Page) {
    this._page = value;
  }

  get eventCategories(): string[] {
    return this._eventCategories;
  }

  set eventCategories(value: string[]) {
    this._eventCategories = value;
  }

  get locationsOptions(): Location[] {
    return this._locationsOptions;
  }

  set locationsOptions(value: Location[]) {
    this._locationsOptions = value;
  }

  ngOnInit() {
    this.getEvents(0, 6);
  }

  private getLocationsOptions() {
    this._locationApiService.getLocationsOptions().subscribe({
      next: (result: Location[]) => {
        this._locationsOptions = result;
      },
      error: (message: string) => {
        this._snackBar.open(message);
      }
    });
  }

  public getEvents(page: number, size: number) {
    this._eventApiService.getEvents(page, size).subscribe({
      next: (result: Page) => {
        this._page = result;
        this.eventsPageChanged.emit(result);
        this._events = result.content;
      },
      error: (message: string) => {
        this._snackBar.open(message);
      }
    });
  }

  public pageChanged(event: PageEvent) {
    this._page.size = event.pageSize;
    this._page.number = event.pageIndex;
    this.searchEvents(this._page.number, this._page.size);
  }

  private onSubmit() {
    this.searchEvents(this._page.number, this._page.size);
  }

  private searchEvents(page: number, size: number) {
    const parameters: SearchEventsDTO = new SearchEventsDTO(this._searchParameters.name,
      this._searchParameters.locationID, this._searchParameters.category,
      this._searchParameters.startDate, this._searchParameters.endDate);
    if (parameters.startDate !== '') {
      parameters.startDate = moment(parameters.startDate).format('DD.MM.YYYY.');
    }
    if (parameters.endDate !== '') {
      parameters.endDate = moment(parameters.endDate).format('DD.MM.YYYY. HH:mm');
    }
    this._eventApiService.searchEvents(parameters, page, size).subscribe({
      next: (result: Page) => {
        this._page = result;
        this.eventsPageChanged.emit(result);
        this._events = result.content;
      },
      error: (message: string) => {
        this._snackBar.open(message);
      }
    });
  }

  private resetForm(form) {
    form.reset();
    this._searchParameters = new SearchEventsDTO('', null, null, '', '');
    this.resetPaginator.emit();
    this.searchEvents(0, 6);
  }

}
