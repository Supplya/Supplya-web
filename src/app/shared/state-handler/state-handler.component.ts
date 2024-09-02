import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-state-handler',
  templateUrl: './state-handler.component.html',
  styleUrls: ['./state-handler.component.scss'],
})
export class StateHandlerComponent {
  @Input() isLoading: boolean = false;
  @Input() hasError: boolean = false;
  @Input() isEmpty: boolean = false;
  @Input() dataAvailable: boolean = false;

  @Input() name: string = 'data';

  @Input() loadingMessage: string = 'Loading...';
  @Input() errorMessage: string;
  @Input() emptyMessage: string;

  @Input() loadingImage: string;
  @Input() errorImage: string;
  @Input() emptyImage: string;

  @Output() retry = new EventEmitter<void>();
}
