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

  getTransactions(page: number, limit: number): Observable<TransactionResponse> {
    return this.http.get<TransactionResponse>(
      `${this.baseUrl}wallet/transactions?page=${page}&limit=${limit}`
    );
  }

  getBanks(): Observable<BankListResponse> {
    return this.http.get<BankListResponse>(`${this.baseUrl}wallet/banks`);
  }

  verifyBankAccount(payload: VerifyAccountPayload): Observable<VerifyAccountResponse> {
    return this.http.post<VerifyAccountResponse>(`${this.baseUrl}wallet/verify-account`, payload);
  }
}

// Interfaces for transactions (moved from wallet.component.ts)
export interface Transaction {
  _id: string;
  transactionType: 'DEPOSIT' | 'WITHDRAWAL' | 'ORDER_PAYMENT' | 'REFUND' | string;
  amount: number;
  description: string;
  orderId?: string;
  bnplLoanId?: string;
  anchorTransferId?: string;
  reference: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | string;
  date: string;
}

export interface TransactionResponse {
  status: boolean;
  message: string;
  data: {
    transactions: Transaction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface Bank {
  name: string;
  code: string;
  id: string;
}

export interface BankListResponse {
  success: boolean;
  data: {
    banks: Bank[];
  };
}

export interface VerifyAccountPayload {
  accountNumber: string;
  bankCode: string;
}

export interface VerifyAccountResponse {
  success: boolean;
  data: {
    accountNumber: string;
    bankCode: string;
    accountName: string;
  };
}
