import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { InputNotificationService } from '../services/input.service';
import { isNullOrWhitespace, replaceAll } from '../../extern-functions/extern-functions';
import { WeatherPublishingService } from '../services/weather-property-publishing-service';
import { Observable, Subscription } from 'rxjs';
import { map, startWith, } from 'rxjs/operators';
import { ContentService } from '../services/content-service';

@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.sass']
})
export class UserInputComponent implements OnInit, OnDestroy {

  private subscription: Subscription | undefined;
  inputFieldId: string = "cityWeatherInput";
  unconfirmedFormat: boolean = false;
  placeholder: string = "Enter a city...";
  errorNotice: string = "Format of city entry: New York, US"
  options = new Set<string>();
  myControl = new FormControl();
  listCityNames: string[] = [];
  filteredOptions!: Observable<string[]>;

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.listCityNames.filter(option => option.toLowerCase().includes(filterValue));
  }

  constructor(
    private inputNotificationService: InputNotificationService,
    private weatherPublishingService: WeatherPublishingService,
    private contentService: ContentService) { }

  ngOnInit(): void {
    this.subscription = this.weatherPublishingService.weatherConfirmed$.subscribe(
      () => { this.unconfirmedFormat = false; });

    this.subscription = this.contentService.optionsListAnnounced$.subscribe(
      (result: string[]) => {
        result.forEach(v => this.options.add(v));
        this.listCityNames = Array.from(this.options);
      });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value).slice(0, 5)));
  }

  userQueryEvent(input: string): void {
    this.evDetectProcessEnteredInput(input)
  }

  private isNotformatted(param: string): boolean {
    // Regex for a City and Country => [a-zA-Z][a-zA-Z\s-]+[a-zA-Z]
    // Regex for a zipcode [0-9]{5}(?:-[0-9]{4})?

    let expression: string = "[a-zA-Z][a-zA-Z\s-]+[a-zA-Z]|[0-9]{5}(?:-[0-9]{4})?";
    let rE = new RegExp(expression);

    if (rE.test(param)) {
      this.unconfirmedFormat = false;
      return this.unconfirmedFormat;
    } else {
      this.unconfirmedFormat = true;
      return this.unconfirmedFormat;
    }
  }

  private sanitizeIncoming(param: string): string {
    // Matches any word character (alphanumeric & underscore).
    // Only matches low-ascii characters (no accented or non-roman characters).
    let charExp: string = "[^a-zA-Z-,0-9%]";
    let rE = new RegExp(charExp);
    let value: string = encodeURI(param);
    // Split the text to be analyzed
    // Examine each index and remove any implausible text
    let splitText = value.split(rE);
    // Reconstruct the text after analyzation
    value = splitText.join(' ');
    value = replaceAll(value, " ", "");
    return value;
  }

  private eraseAllInput(): void {
    let erasePreviousQuery: HTMLInputElement = document.getElementById(this.inputFieldId) as HTMLInputElement;
    erasePreviousQuery.value = "";
  }

  private evDetectProcessEnteredInput(value: string): void {
    if (!isNullOrWhitespace(value)) {
      let aConfirmedInput = this.sanitizeIncoming(value);
      if (!this.isNotformatted(aConfirmedInput)) {
        this.inputNotificationService.inputAnnouncementMade(aConfirmedInput);
      }
      this.eraseAllInput();
    } else {
      this.isNotformatted(value);
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}