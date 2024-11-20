import { Component, OnInit } from '@angular/core';
import { ToastyService } from 'ng-toasty';
import { applyGlobalSearch } from 'src/app/shared/helpers/global-table-search';
import Swal from 'sweetalert2';
import { ExportService } from '../../administration/services/export.service';
import { ProductService } from '../../operation/services/product/product.service';

@Component({
  selector: 'app-customer-order',
  templateUrl: './customer-order.component.html',
  styleUrls: ['./customer-order.component.scss'],
})
export class CustomerOrderComponent implements OnInit {
  itemPerPage: number = 100;
  filteredRows: any;
  title = 'Orders';
  searchText: string = '';
  constructor(
    private productService: ProductService,
    private exportService: ExportService,
    private toast: ToastyService
  ) {}
  ngOnInit(): void {
    // this.getAllOrders();
    this.getMetric();
  }
  errorFetchingProduct: boolean = false;
  ordersLoading: boolean = false;
  allOrders: any;
  mockData: any;

  p: number = 1;
  pageSize: number = 20;
  totalCount: number = 0;
  loading: boolean;

  onPageChange(page: number): void {
    this.p = page;
    this.getMetric();
  }
  getAllOrders() {
    this.loading = true;
    this.productService.getAllVendorOrders(this.p, this.pageSize).subscribe(
      (data: any) => {
        this.allOrders = data?.data;
        this.loading = false;
      },
      (error) => {
        this.errorFetchingProduct = true;
        this.loading = false;
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
        this.getMetric();
      }
    });
  }

  summary;
  summaryLoading = false;
  errorFetchingSummary = false;
  getMetric() {
    this.loading = true;
    this.productService.getVendorOrderStats().subscribe(
      (data: any) => {
        if (data.status) {
          this.summary = data.data;
          this.allOrders = data?.data?.orders;
          this.totalCount = data?.data?.totalOrdersCount;
        } else {
          this.summaryLoading = false;
          this.loading = false;
        }
        this.summaryLoading = false;
        this.loading = false;
      },
      (error) => {
        this.errorFetchingSummary = true;
        this.summaryLoading = false;
      }
    );
  }
  applyFilter() {
    this.allOrders = applyGlobalSearch(this.allOrders, this.searchText, [
      'name',
      'moq',
      'unit_price',
      'unit_price',
      'status',
      'quantity',
    ]);
    this.p = 1;
  }

  exportToExcel() {
    this.exportService.exportToExcel(this.allOrders, this.title);
  }
  refreshProducts() {
    this.errorFetchingProduct = false;
    this.getAllOrders();
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