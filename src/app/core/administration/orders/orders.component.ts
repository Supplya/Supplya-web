import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../operation/services/product/product.service';
import { ExportService } from '../services/export.service';
import { ToastyService } from 'ng-toasty';
import Swal from 'sweetalert2';
import { applyGlobalSearch } from 'src/app/shared/helpers/global-table-search';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  filteredRows: any;
  title = 'Orders';
  searchText: string = '';
  constructor(
    private productService: ProductService,
    private exportService: ExportService,
    private toast: ToastyService,
    private adminService: DashboardService
  ) {}
  ngOnInit(): void {
    this.getAllOrders();
    this.getVendorMetric();
  }
  errorFetchingOrders: boolean = false;

  allOrders;
  search
  p: number = 1;
  pageSize: number = 20;
  totalCount: number = 0;
  products: any[] = [];
  loading: boolean = false;
  itemPerPage = 100;
  onPageChange(page: number) {
    this.p = page;
    this.getAllOrders();
  }
  getAllOrders() {
    this.loading = true;
    this.errorFetchingOrders = false;
    this.productService.getAllOrdersAdmin(this.p, this.pageSize).subscribe(
      (data: any) => {
        this.allOrders = data?.data;
        this.loading = false;
        this.totalCount = data?.totalOrders;
      },
      (error) => {
        this.errorFetchingOrders = true;
        this.loading = false;
      }
    );
  }

  summary;
  summaryLoading = false;
  errorFetchingSummary = false;
  getVendorMetric() {
    this.summaryLoading = true;
    this.adminService.getOrderMetric().subscribe(
      (data: any) => {
        this.summaryLoading = false;
        if (data.status) {
          this.summary = data.data;
          // console.log(this.summary);
        } else {
        }
        this.summaryLoading = false;
      },
      (error) => {
        this.errorFetchingSummary = true;
        this.summaryLoading = false;
      }
    );
  }
  applyFilter() {
    this.filteredRows = applyGlobalSearch(this.allOrders, this.searchText, [
      'orderId',
      'dateOrdered',
      'totalPrice',
      'user.firstName',
      'orderStatus',
      'quantity',
    ]);
    this.p = 1;
  }

  deleteOrder(item: any) {
    Swal.fire({
      html: `<span style="color: #000; font-weight: 600; font-size: 19px;">Are you sure you want to delete this order "<span style="color: var(--primary-color);">${item?.orderId}</span>"?</span>`,
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
        this.toast.success('Order deleted successfully');
        this.getVendorMetric();
      }
    });
  }
  exportToExcel() {
    this.exportService.exportToExcel(this.allOrders, this.title);
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

  capitalizeFirstLetter(value: string): string {
    if (!value) return '';
    return value?.charAt(0).toUpperCase() + value?.slice(1);
  }
}