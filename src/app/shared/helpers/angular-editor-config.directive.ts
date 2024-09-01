import { Directive, Input } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Directive({
  selector: '[appAngularEditorConfig]',
})
export class AngularEditorConfigDirective {
  @Input() appAngularEditorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '200px',
    maxHeight: 'auto',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [['bold']],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };
}
