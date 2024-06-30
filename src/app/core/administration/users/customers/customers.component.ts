import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/core/operation/services/product/product.service';
import { ExportService } from '../../services/export.service';
import { ToastyService } from 'ng-toasty';
import { DashboardService } from '../../services/dashboard.service';
import { applyGlobalSearch } from 'src/app/shared/helpers/global-table-search';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  itemPerPage: number = 8;
  p: number = 1;
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
  allOrders: any;
  mockData: any;
  getAllProducts() {
    this.ordersLoading = true;
    this.productService.getAllOrders().subscribe(
      (data: any) => {
        this.allOrders = data?.data;
        this.filteredRows = data?.data;
        this.ordersLoading = false;
      },
      (error) => {
        this.errorFetchingProduct = true;
        this.ordersLoading = false;
      }
    );
  }

  summary;
  summaryLoading = false;
  errorFetchingSummary = false;
  getVendorMetric() {
    this.ordersLoading = true;
    this.adminService.getCustomerMetric().subscribe(
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
  customers
  getAllUsers() {
    this.ordersLoading = true;
    this.adminService.getAllUsers().subscribe(
      (data: any) => {
        this.ordersLoading = false;
        if (data.status) {
this.customers = data.data.filter((item: any) =>item?.role === "customer");
          // console.log(this.customers);
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
  applyFilter() {
    this.summary.orders = applyGlobalSearch(this.allOrders, this.searchText, [
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
    this.exportService.exportToExcel(this.filteredRows, this.title);
  }
  refreshProducts() {
    this.errorFetchingProduct = false;
    this.getAllProducts();
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
      // console.log(this.selectedOrder);
    }
  };

  capitalizeFirstLetter(value: string): string {
    if (!value) return '';
    return value?.charAt(0).toUpperCase() + value?.slice(1);
  }
}