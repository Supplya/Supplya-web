import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../operation/services/product/product.service';
import { Chart } from 'chart.js';
import { ToastyService } from 'ng-toasty';
import Swal from 'sweetalert2';
import { ExportService } from '../../administration/services/export.service';
import { AuthService } from 'src/app/authentication/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss'],
})
export class CustomerDashboardComponent implements OnInit {
  itemPerPage: number = 100;
  p: number = 1;
  filteredRows: any;
  title = 'Products';
  searchText: string = '';
  public chart: any;
  constructor(
    private productService: ProductService,
    private exportService: ExportService,
    private toast: ToastyService,
    private authService: AuthService,
    private router: Router
  ) {}
  userDetails;
  ngOnInit(): void {
    this.userDetails = this.authService.getUserCredentials();
    // console.log(this.userDetails);
    this.getAllOrders();

        if (this.userDetails) {
          if (
            this.userDetails?.phoneNumber === null ||
            this.userDetails?.phoneNumber === '' ||
            this.userDetails?.address === null ||
            this.userDetails?.address === '' ||
            this.userDetails?.state === null ||
            this.userDetails?.state === ''
          ) {
            this.toggleModal('updateProfileModal', 'open');
          }
        }
  }
  errorFetchingProduct: boolean = false;
  ordersLoading: boolean = false;
  allOrders: any;
  summary;
  getAllOrders() {
    this.ordersLoading = true;
    this.productService.getUserOrders().subscribe(
      (data: any) => {
        this.allOrders = data?.data.orders;
        this.summary = data?.data;
        console.log(data)
        this.ordersLoading = false;
      },
      (error) => {
        this.errorFetchingProduct = true;
        this.ordersLoading = false;
      }
    );
  }

  capitalizeFirstLetter(value: string): string {
    if (!value) return '';
    return value?.charAt(0).toUpperCase() + value?.slice(1);
  }
  // deleteProduct(product: any) {
  //   Swal.fire({
  //     html: `<span style="color: #000; font-weight: 600; font-size: 19px;">Are you sure you want to delete this product "<span style="color: var(--primary-color);">${product.name}</span>"?</span>`,
  //     icon: 'warning',
  //     showCancelButton: true,
  //     allowOutsideClick: false,
  //     confirmButtonText: 'Yes, delete',
  //     cancelButtonText: 'No',
  //     showClass: {
  //       popup: `
  //                 animate__animated
  //                 animate__fadeInDown
  //                 animate__faster
  //               `,
  //     },
  //     hideClass: {
  //       popup: `
  //                 animate__animated
  //                 animate__fadeOutDown
  //                 animate__faster
  //               `,
  //     },
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       // this.delete(product._id);
  //     }
  //   });
  // }

  exportToExcel() {
    this.exportService.exportToExcel(this.filteredRows, this.title);
  }
  refreshOrders() {
    this.errorFetchingProduct = false;
    this.getAllOrders();
  }
  get productsToShow(): any[] {
    const startIndex = (this.p - 1) * this.itemPerPage;
    const endIndex = Math.min(
      startIndex + this.itemPerPage,
      this.filteredRows?.length
    );
    return this.filteredRows?.slice(startIndex, endIndex);
  }
  selectedOrder: any;
  toggleModal = (modalId, action: string, data?: any) => {
    if (action == 'open') {
      document.getElementById(modalId).style.display = 'flex';
    } else {
      document.getElementById(modalId).style.display = 'none';
    }
    if (data) {
      this.selectedOrder = data;
    }
  };

  toDashboard() {
    this.router.navigate(['/core/customer/profile-settings']);
  }

  updateSuccess() {
    this.userDetails = this.authService.getUserCredentials();
    this.toggleModal('updateProfileModal', 'close');
  }
}
