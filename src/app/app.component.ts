import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { SwUpdate } from "@angular/service-worker";
import { WorkerService } from "@services";
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: [ "./app.component.scss" ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {

  constructor(
    private swUpdate: SwUpdate,
    private workerService: WorkerService,
    private config: PrimeNGConfig,
    private translateService: TranslateService
  ) {
  }

  ngOnInit() {
    this.translateService.setDefaultLang('fr');
    this.translateService.setTranslation('fr', {
      primeng: {
        closeText: "Fermer",
        prevText: "Précédent",
        nextText: "Suivant",
        today: "Aujourd'hui",
        clear: "Effacer",
        monthNames: [ "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
          "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre" ],
        monthNamesShort: [ "janv.", "févr.", "mars", "avr.", "mai", "juin",
          "juil.", "août", "sept.", "oct.", "nov.", "déc." ],
        dayNames: [ "dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi" ],
        dayNamesShort: [ "dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam." ],
        dayNamesMin: [ "D", "L", "M", "M", "J", "V", "S" ],
        weekHeader: "Sem.",
        dateFormat: "dd/mm/yy",
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ""
      }
    })
    this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));

    if (this.swUpdate.isEnabled) {
      /*this.swUpdate.versionUpdates.subscribe(() => {
        if(confirm("New version available. Load New Version?")) {
          window.location.reload();
        }
      });*/
    }
  }
}

