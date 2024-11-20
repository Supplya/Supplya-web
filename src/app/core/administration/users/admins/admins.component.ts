import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/core/operation/services/product/product.service';
import { ExportService } from '../../services/export.service';
import { ToastyService } from 'ng-toasty';
import { DashboardService } from '../../services/dashboard.service';
import { applyGlobalSearch } from 'src/app/shared/helpers/global-table-search';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss'],
})
export class AdminsComponent implements OnInit {
  itemPerPage: number = 100;
  filteredRows: any;
  title = 'All Admins';
  searchText: string = '';
  constructor(
    private productService: ProductService,
    private exportService: ExportService,
    private toast: ToastyService,
    private adminService: DashboardService
  ) {}
  ngOnInit(): void {
    // this.getAllProducts();
    this.getAdminMetric();
    this.getAllUsers();
  }
  errorFetchingProduct: boolean = false;
  ordersLoading: boolean = false;

  summary;
  summaryLoading = false;
  errorFetchingSummary = false;
  getAdminMetric() {
    this.ordersLoading = true;
    this.adminService.getAdminMetric().subscribe(
      (data: any) => {
        this.ordersLoading = false;
        if (data.status) {
          this.summary = data.data;
        } else {
        }
        this.summaryLoading = false;
      },
      (error) => {
        this.errorFetchingSummary = true;
        this.summaryLoading = false;
        this.ordersLoading = false;
      }
    );
  }
  admins;

  p: number = 1;
  pageSize: number = 20;
  totalCount: number = 0;
  products: any[] = [];
  loading: boolean = false;
  errorLoading: boolean = false;

  onPageChange(page: number) {
    this.p = page;
    this.getAllUsers();
  }
  getAllUsers() {
    this.loading = true;
    this.errorLoading = false;
    this.adminService.getAllAdmins(this.p, this.pageSize).subscribe(
      (data: any) => {
        this.loading = false;
        if (data.status) {
          this.admins = data.data;
          this.totalCount = data?.totalCount;
          // console.log(this.customers);
        } else {
        }
        this.loading = false;
      },
      (error) => {
        this.errorLoading = true;
        this.loading = false;
      }
    );
  }
  applyFilter() {
    this.summary.orders = applyGlobalSearch(this.admins, this.searchText, [
      'name',
      'moq',
      'unit_price',
      'unit_price',
      'status',
      'quantity',
    ]);
    this.p = 1;
  }

  deactivate(item: any) {
    Swal.fire({
      html: `<span style="color: #000; font-weight: 600; font-size: 19px;">Are you sure you want to deactivate this customer "<span style="color: var(--primary-color);">${item?.orderId}</span>"?</span>`,
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'No',
      showClass: {
        popup: `
                  animate__animated
                  animate__fadeInDown
                  animate__faster
                `,
      },
      hideClass: {
        popup: `
                  animate__animated
                  animate__fadeOutDown
                  animate__faster
                `,
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.delete(item._id);
      }
    });
  }
  deleteUser(item: any) {
    Swal.fire({
      html: `<span style="color: #000; font-weight: 600; font-size: 19px;">Are you sure you want to delete this customer "<span style="color: var(--primary-color);">${item?.firstName} ${item?.lastName}</span>"?</span>`,
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'No',
      showClass: {
        popup: `
                  animate__animated
                  animate__fadeInDown
                  animate__faster
                `,
      },
      hideClass: {
        popup: `
                  animate__animated
                  animate__fadeOutDown
                  animate__faster
                `,
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.delete(item._id);
      }
    });
  }
  delete(id: string) {
    this.productService.deleteUser(id).subscribe((result) => {
      if (result) {
        this.toast.success('Admin deleted successfully');
        this.getAdminMetric();
        this.getAllUsers();
      }
    });
  }
  exportToExcel() {
    this.exportService.exportToExcel(this.filteredRows, this.title);
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
      // console.log(this.selectedOrder);
    }
  };

  capitalizeFirstLetter(value: string): string {
    if (!value) return '';
    return value?.charAt(0).toUpperCase() + value?.slice(1);
  }
}