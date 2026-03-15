import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/assets/environment/environment';

export interface WalletInitializeResponse {
  success: boolean;
  message: string;
  data: {
    status: string;
    anchorCustomerId: string;
    nextStep: string;
  };
}

export interface UpgradeStatusResponse {
  status: boolean;
  isVendor: boolean;
  canUpgrade: boolean;
  progress?: {
    personalInfo: {
      completed: string[];
      missing: string[];
      percentage: number;
    };
  };
  message: string;
}

export interface KycUpgradePayload {
  bvn: string;
  dateOfBirth: string;
  gender: string;
}

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private baseUrl = environment.BASE_URL;

  constructor(private http: HttpClient) {}

  initializeWallet(): Observable<WalletInitializeResponse> {
    return this.http.post<WalletInitializeResponse>(
      `${this.baseUrl}wallet/initialize`,
      {}
    );
  }

  getUpgradeStatus(): Observable<UpgradeStatusResponse> {
    return this.http.get<UpgradeStatusResponse>(
      `${this.baseUrl}wallet/kyc/status`
      // `${this.baseUrl}account/upgrade/status`
    );
  }
  getWalletDashboard(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}wallet/dashboard`
      // `${this.baseUrl}account/upgrade/status`
    );
  }

  submitKycUpgrade(payload: KycUpgradePayload): Observable<{ success: boolean; message?: string; data?: any }> {
    return this.http.post<{ success: boolean; message?: string; data?: any }>(
      `${this.baseUrl}wallet/kyc/upgrade`,
      payload
    );
  }
}
