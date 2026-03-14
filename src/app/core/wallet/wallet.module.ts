import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { WalletComponent } from './wallet.component';

@NgModule({
  declarations: [WalletComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [WalletComponent],
})
export class WalletModule {}
