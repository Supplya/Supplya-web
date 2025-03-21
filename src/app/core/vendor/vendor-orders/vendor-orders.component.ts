import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../operation/services/product/product.service';
import { ExportService } from '../../administration/services/export.service';
import { applyGlobalSearch } from 'src/app/shared/helpers/global-table-search';
import Swal from 'sweetalert2';
import { ToastyService } from 'ng-toasty';

@Component({
  selector: 'app-vendor-orders',
  templateUrl: './vendor-orders.component.html',
  styleUrls: ['./vendor-orders.component.scss'],
})
export class VendorOrdersComponent implements OnInit {
  itemPerPage: number = 100;
  p: number = 1;
  filteredRows: any;
  title = 'Orders';
  searchText: string = '';
  constructor(
    private productService: ProductService,
    private exportService: ExportService,
    private toast: ToastyService
  ) {}
  ngOnInit(): void {
    // this.getAllProducts();
    this.getVendorMetric();
  }
  errorFetchingProduct: boolean = false;
  ordersLoading: boolean = false;
  allOrders: any;
  mockData: any;
  getAllProducts() {
    this.ordersLoading = true;
    this.productService.getAllVendorOrders(1, 30).subscribe(
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
  selectedStatus = '';
  statuses = [
    'New',
    'Confirmed',
    'Package',
    'Shipping',
    'Delivered',
    'Cancelled',
  ];
  updateOrderStatus(item, status) {
    item.orderStatus = status.toLowerCase();
    this.productService.UpdateOrder(item, item?._id).subscribe((result) => {
      if (result) {
        this.toast.success('Order Status Updated Successfully');
        this.getVendorMetric();
      }
    });
  }

  summary;
  summaryLoading = false;
  errorFetchingSummary = false;
  getVendorMetric() {
    this.ordersLoading = true;
    this.productService.getVendorOrderStats().subscribe(
      (data: any) => {
        if (data.status) {
          this.summary = data.data;
          this.allOrders = data?.data?.orders;
          this.filteredRows = data?.data?.orders;
        } else {
          this.summaryLoading = false;
          this.ordersLoading = false;
        }
        this.summaryLoading = false;
        this.ordersLoading = false;
      },
      (error) => {
        this.errorFetchingSummary = true;
        this.summaryLoading = false;
      }
    );
  }
  applyFilter() {
    this.filteredRows = applyGlobalSearch(this.allOrders, this.searchText, [
      'name',
      'moq',
      'unit_price',
      'unit_price',
      'status',
      'quantity',
    ]);
    this.p = 1;
  }

  deleteProduct(product: any) {
    Swal.fire({
      html: `<span style="color: #000; font-weight: 600; font-size: 19px;">Are you sure you want to delete this product "<span style="color: var(--primary-color);">${product.name}</span>"?</span>`,
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
        this.delete(product._id);
      }
    });
  }
  delete(id: string) {
    this.productService.deleteProduct(id).subscribe((result) => {
      if (result) {
        this.toast.success('Product deleted successfully');
        this.getAllProducts();
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
    }
  };

  capitalizeFirstLetter(value: string): string {
    if (!value) return '';
    return value?.charAt(0).toUpperCase() + value?.slice(1);
  }
}
