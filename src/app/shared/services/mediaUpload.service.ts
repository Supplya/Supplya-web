import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cloudinary } from '@cloudinary/url-gen';
import { Observable } from 'rxjs';
import { environment } from 'src/assets/environment/environment';

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
  cld = new Cloudinary({
    cloud: {
      cloudName: 'demo',
    },
  });

  uploadImages13(file: FormData): Observable<HttpEvent<any>> {
    return this.http.post<any>(this.baseUrl, file, {
      reportProgress: true,
      observe: 'events',
    });
  }

  uploadImages(file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', environment.cloudinary.uploadPreset);
    formData.append('cloud_name', environment.cloudinary.cloudName);

    return this.http.post<any>(this.baseUrl, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }
  uploadImages1(file: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, file);
  }
}
