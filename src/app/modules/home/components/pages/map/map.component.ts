import { Component, OnInit } from '@angular/core';
import { JeedomService } from '@app/services/jeedom.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: [ './map.component.scss' ],
  host: {
    class: 'page-container'
  }
})
export class MapComponent implements OnInit {
  constructor(private jeedomService: JeedomService) {
    this.jeedomService.request("version").then((response) => {
      console.log(response);
    });
  }

  ngOnInit(): void {

  }
}
