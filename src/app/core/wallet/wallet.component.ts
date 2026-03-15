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
  upgradeStatus: any | null = null;
  upgradeStatusLoading = false;
  kycForm!: FormGroup;
  kycSubmitting = false;
  genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
  ];

  balanceVisible = true;
  totalEarned = 0;
  totalWithdrawalRequestCount = 0;
  readonly minWithdrawAmount = 5000;
  userBankDetails: any;

  withdrawalForm!: FormGroup;
  bankOptions: { label: string; value: string }[] = [
    { label: 'Access Bank', value: 'Access Bank' },
    { label: 'Zenith Bank', value: 'Zenith Bank' },
    { label: 'GTBank', value: 'GTBank' },
    { label: 'First Bank', value: 'First Bank' },
    { label: 'UBA', value: 'UBA' },
  ];
  validatedBankName: string = '';
  withdrawalSubmitting: boolean = false;
  isAccountValidated: boolean = false;
  validatingAccount: boolean = false;

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
    this.initWithdrawalForm(); // Call the new method
    if (this.hasWallet) {
      this.fetchUpgradeStatus();
    }
    this.fetchBankDetails();
    this.getWalletDashboard();
  }

  get hasWallet(): boolean {
    return !!this.userDetails?.hasWallet;
  }

  // get missingFields(): string[] {
  //   return this.upgradeStatus?.progress?.personalInfo?.missing ?? [];
  // }

  // get hasMissingKycFields(): boolean {
  //   return this.missingFields.length > 0;
  // }

  get missingFields(): string[] {
  const kyc = this.upgradeStatus?.data?.kycDataOnFile;

  if (!kyc) return [];

  const missing: string[] = [];

  if (!kyc.hasBVN) {
    missing.push('BVN');
  }

  if (!kyc.hasDOB) {
    missing.push('Date of Birth');
  }

  if (!kyc.hasGender) {
    missing.push('Gender');
  }

  return missing;
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

  private initWithdrawalForm(): void {
    this.withdrawalForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(this.minWithdrawAmount)]],
      accountNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]], // Assuming 10-digit account number
      bankName: ['', Validators.required],
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

  walletLoading = false;
  walletDetails: any = null;

  private getWalletDashboard(): void {
    this.upgradeStatusLoading = true;
    this.walletService.getWalletDashboard().subscribe({
      next: (res) => {
        this.walletLoading = false;
        this.walletDetails = res?.data;
this.userBankDetails = this.walletDetails?.paymentAccount;

        //         "wallet": {
        //     "balance": 0
        // },
        // "paymentAccount": {
        //     "virtualAccountNumber": "2451343877",
        //     "bankName": "PROVIDUS BANK",
        //     "instructions": "Transfer funds to 2451343877 at PROVIDUS BANK"
        // },
      },
      error: () => {
        this.walletLoading = false;
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

  isInvalidWithdraw(controlName: string): boolean {
    const c = this.withdrawalForm.get(controlName);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  getErrorMessageWithdraw(controlName: string, defaultMsg: string): string {
    const c = this.withdrawalForm.get(controlName);
    if (!c?.errors) return defaultMsg;
    if (c.errors['required']) return 'This field is required';
    if (c.errors['min']) return `Amount must be at least ${this.minWithdrawAmount}`;
    if (c.errors['pattern']) return 'Enter a valid 10-digit account number';
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

  validateAccount(): void {
    const accountNumberControl = this.withdrawalForm.get('accountNumber');
    const bankNameControl = this.withdrawalForm.get('bankName');

    this.validatedBankName = ''; // Clear previous validation
    this.isAccountValidated = false; // Reset validation status

    // Check if account number is provided and valid first
    if (!accountNumberControl?.value || accountNumberControl.invalid) {
      if (bankNameControl?.value) { // Only show this message if bank name is selected without account number
        this.validatedBankName = 'Please enter account number first';
      }
      return; // Stop validation if account number is not valid
    }

    if (accountNumberControl?.valid && bankNameControl?.valid) {
      this.validatingAccount = true; // Set loading state

      // Simulate API call for account validation
      // In a real scenario, you'd make an HTTP request here
      setTimeout(() => {
        const accountNumber = accountNumberControl.value;
        const bankName = bankNameControl.value;

        // Demo validation logic
        if (accountNumber === '1234567890' && bankName === 'Zenith Bank') {
          this.validatedBankName = 'John Doe'; // Simulate account name
          this.isAccountValidated = true;
        } else if (accountNumber === '0987654321' && bankName === 'Access Bank') {
          this.validatedBankName = 'Jane Smith';
          this.isAccountValidated = true;
        } else {
          this.validatedBankName = 'Unable to validate account';
          this.isAccountValidated = false;
        }
        this.validatingAccount = false; // Clear loading state
      }, 1000); // Simulate network delay
    }
  }

  requestWithdrawal(): void {
    if (this.withdrawalSubmitting || this.withdrawalForm.invalid) return;

    this.withdrawalSubmitting = true;
    const value = this.withdrawalForm.value;
    console.log('Withdrawal Request:', value);

    // Simulate API call for withdrawal
    setTimeout(() => {
      this.withdrawalSubmitting = false;
      this.toast.success('Withdrawal request submitted successfully!', 5000);
      this.toggleModal('withdrawWalletModal', 'close');
      this.withdrawalForm.reset(); // Reset the form after submission
      this.validatedBankName = ''; // Clear validated bank name
      this.isAccountValidated = false; // Reset validation status
    }, 2000); // Simulate network delay
  }
}
