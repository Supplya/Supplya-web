/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MediaUploadService } from './mediaUpload.service';

describe('Service: MediaUpload', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MediaUploadService]
    });
  });

  it('should ...', inject([MediaUploadService], (service: MediaUploadService) => {
    expect(service).toBeTruthy();
  }));
});
