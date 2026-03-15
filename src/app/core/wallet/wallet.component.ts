import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/authentication/service/auth.service';
import { ToastyService } from 'ng-toasty';
import { WalletService, UpgradeStatusResponse } from './services/wallet.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
  userDetails: any = null;
  initializing = false;
  upgradeStatus: UpgradeStatusResponse | null = null;
  upgradeStatusLoading = false;
  kycForm!: FormGroup;
  kycSubmitting = false;
  genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
  ];

  balanceVisible = true;
  availableBalance = 560430;
  totalEarned = 0;
  totalWithdrawalRequestCount = 0;
  readonly minWithdrawAmount = 5000;
  userBankDetails: { bankName: string, accountNumber: string } | null = null;

  constructor(
    private authService: AuthService,
    private walletService: WalletService,
    private toast: ToastyService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userDetails = this.authService.getUserCredentials();
    console.log('user', this.userDetails)
    this.initKycForm();
    if (this.hasWallet) {
      this.fetchUpgradeStatus();
    }
    this.fetchBankDetails();
  }

  get hasWallet(): boolean {
    return !!this.userDetails?.hasWallet;
  }

  get missingFields(): string[] {
    return this.upgradeStatus?.progress?.personalInfo?.missing ?? [];
  }

  get hasMissingKycFields(): boolean {
    return this.missingFields.length > 0;
  }

  get upgradeMessage(): string {
    return this.upgradeStatus?.message ?? '';
  }

  get isVendor(): boolean {
    return this.userDetails?.role === 'vendor';
  }

  toggleBalanceVisibility(): void {
    this.balanceVisible = !this.balanceVisible;
  }

  goToWithdraw(): void {
    // Withdraw functionality to be implemented later
  }

  fetchBankDetails() {
    // Replace with your actual logic to fetch bank details
    // For now, I'll use some dummy data
    this.userBankDetails = { bankName: 'Zenith Bank', accountNumber: '1234567890' };
  }

  fundWallet() {
    this.toggleModal('fundWalletModal', 'open');
  }

  toggleModal = (modalId, action: string, data?: any) => {
    if (action == 'open') {
      document.getElementById(modalId).style.display = 'flex';
    } else {
      document.getElementById(modalId).style.display = 'none';
    }
  };

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.toast.success('Copied to clipboard', 2000);
    }, () => {
      // this.toast.error('Failed to copy', 2000);
    });
  }

  private initKycForm(): void {
    const u = this.userDetails || {};
    const dobRaw = u.dob;
    const dateOfBirth =
      typeof dobRaw === 'string' && dobRaw
        ? dobRaw.split('T')[0]
        : '';

    this.kycForm = this.fb.group({
      bvn: [u.bvn ?? '', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      dateOfBirth: [dateOfBirth, Validators.required],
      gender: [u.gender ?? '', Validators.required],
    });
  }

  private fetchUpgradeStatus(): void {
    this.upgradeStatusLoading = true;
    this.walletService.getUpgradeStatus().subscribe({
      next: (res) => {
        this.upgradeStatusLoading = false;
        this.upgradeStatus = res;
        this.patchFormFromUser();
      },
      error: () => {
        this.upgradeStatusLoading = false;
      },
    });
  }

  private patchFormFromUser(): void {
    const u = this.userDetails || {};
    if (u.bvn) this.kycForm.patchValue({ bvn: u.bvn });
    if (u.dob) {
      const d = typeof u.dob === 'string' ? u.dob.split('T')[0] : '';
      if (d) this.kycForm.patchValue({ dateOfBirth: d });
    }
    if (u.gender) this.kycForm.patchValue({ gender: u.gender });
  }

  createWallet(): void {
    if (this.initializing) return;
    this.initializing = true;
    this.walletService.initializeWallet().subscribe({
      next: (res) => {
        this.initializing = false;
        if (res?.success && res?.data) {
          this.authService.updateStoredUser({
            hasWallet: true,
            anchorCustomerId: res.data.anchorCustomerId,
            anchorAccountStatus: res.data.status,
          });
          this.userDetails = this.authService.getUserCredentials();
          this.toast.success(res.message || 'Wallet created successfully.', 5000);
          this.fetchUpgradeStatus();
        }
      },
      error: () => {
        this.initializing = false;
      },
    });
  }

  isInvalid(controlName: string): boolean {
    const c = this.kycForm.get(controlName);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  getErrorMessage(controlName: string, defaultMsg: string): string {
    const c = this.kycForm.get(controlName);
    if (!c?.errors) return defaultMsg;
    if (c.errors['required']) return 'This field is required';
    if (c.errors['pattern']) return 'Enter a valid 11-digit BVN';
    return defaultMsg;
  }

  submitKyc(): void {
    if (this.kycSubmitting || this.kycForm.invalid) return;
    this.kycSubmitting = true;
    const value = this.kycForm.value;
    const payload = {
      bvn: value.bvn?.trim() ?? '',
      dateOfBirth: value.dateOfBirth ?? '',
      gender: value.gender ?? '',
    };

    this.walletService.submitKycUpgrade(payload).subscribe({
      next: (res) => {
        this.kycSubmitting = false;
        if (res?.success) {
          this.toast.success(res.message ?? 'Profile updated successfully.', 5000);
          this.authService.updateStoredUser({
            bvn: payload.bvn,
            dob: payload.dateOfBirth,
            gender: payload.gender,
          });
          this.userDetails = this.authService.getUserCredentials();
          this.fetchUpgradeStatus();
        }
      },
      error: () => {
        this.kycSubmitting = false;
      },
    });
  }
}
