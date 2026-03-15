import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination'; // Import NgxPaginationModule
import { WalletComponent } from './wallet.component';

@NgModule({
  declarations: [WalletComponent],
  imports: [CommonModule, ReactiveFormsModule, NgxPaginationModule], // Add NgxPaginationModule to imports
  exports: [WalletComponent],
})
export class WalletModule {}
