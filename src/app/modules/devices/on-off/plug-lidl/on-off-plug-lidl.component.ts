import { AfterContentInit, AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { OnOffComponent } from '../on-off.component';


@Component({
  selector: 'app-onoff-lidl',
  templateUrl: '../on-off.component.html',
  styleUrls: [
    '../../base-device.component.scss',
    '../on-off.component.scss',
  ],
})
export class OnOffPlugLidlComponent extends OnOffComponent implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {

}
