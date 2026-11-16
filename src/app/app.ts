import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<main id="principal"><router-outlet /></main>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
