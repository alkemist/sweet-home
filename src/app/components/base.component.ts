import { Directive, OnDestroy, OnInit } from '@angular/core';
import { Subscription, Unsubscribable } from 'rxjs';

@Directive()
export abstract class BaseComponent implements OnInit, OnDestroy {
  protected allSubscriptions = new Subscription();

  protected constructor() {

  }

  set sub(sub: Unsubscribable) {
    this.allSubscriptions.add(sub);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.allSubscriptions.unsubscribe();
  }
}
