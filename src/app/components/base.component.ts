import {Directive, OnDestroy} from '@angular/core';
import {Subscription, Unsubscribable} from 'rxjs';

@Directive()
export default abstract class BaseComponent implements OnDestroy {
  protected allSubscriptions = new Subscription();

  protected constructor() {

  }

  set sub(sub: Unsubscribable) {
    this.allSubscriptions.add(sub);
  }

  ngOnDestroy(): void {
    this.allSubscriptions.unsubscribe();
  }
}
