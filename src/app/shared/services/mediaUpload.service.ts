import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cloudinary } from '@cloudinary/url-gen';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediaUploadService {
  cloudinary: Cloudinary;
  baseUrl: string;

  constructor(private http: HttpClient) {
    this.cloudinary = new Cloudinary({
      cloud: {
        cloudName: 'piusash',
      },
      url: {
        secure: true,
      },
    });

    this.baseUrl = `https://api.cloudinary.com/v1_1/piusash/image/upload`;
  }

  uploadImages(file: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, file);
  }
}
