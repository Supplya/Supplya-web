import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/core/operation/services/product/product.service';
import { ExportService } from '../../services/export.service';
import { ToastyService } from 'ng-toasty';
import { DashboardService } from '../../services/dashboard.service';
import { applyGlobalSearch } from 'src/app/shared/helpers/global-table-search';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss'],
})
export class VendorsComponent implements OnInit {
  selectedTab: string = 'Vendors';
  itemPerPage: number = 500;
  search
  filteredRows: any;
  title = 'Products';
  searchText: string = '';
  constructor(
    private productService: ProductService,
    private exportService: ExportService,
    private toast: ToastyService,
    private adminService: DashboardService
  ) {}
  ngOnInit(): void {
    // this.getAllProducts();
    this.getVendorMetric();
    this.getAllUsers();
  }
  errorFetchingProduct: boolean = false;
  ordersLoading: boolean = false;

  summary;
  summaryLoading = false;
  errorFetchingSummary = false;
  getVendorMetric() {
    this.ordersLoading = true;
    this.adminService.getVendorMetric().subscribe(
      (data: any) => {
        this.ordersLoading = false;
        if (data.status) {
          this.summary = data.data;
          // this.vendors = data.data.vendors;

          console.log(this.summary);
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
  vendors;
  p: number = 1;
  pageSize: number = 20;
  totalCount: number = 0;
  products: any[] = [];
  loading: boolean = false;
  
  onPageChange(page: number) {
    this.p = page;
    this.getAllUsers();
  }
  getAllUsers() {
    this.loading = true;
    this.errorFetchingSummary = false;
    this.adminService.getAllVendor(this.p, this.pageSize).subscribe(
      (data: any) => {
        this.loading = false;
        if (data.status === true) {
          this.vendors = data['data'];
          this.totalCount = data?.totalCount;
        } else {
        }
        this.loading = false;
      },
      (error) => {
        this.errorFetchingSummary = true;
        this.loading = false;
        this.loading = false;
      }
    );
  }
  applyFilter() {
    this.summary.orders = applyGlobalSearch(this.vendors, this.searchText, [
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
    this.productService.deleteOrder(id).subscribe((result) => {
      if (result) {
        this.toast.success('Customer deleted successfully');
        this.getVendorMetric();
      }
    });
  }
  exportToExcel() {
    this.exportService.exportToExcel(this.vendors, this.title);
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