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
  itemsPerPage: number = 10;
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
    this.getAllOrders();
    this.getVendorMetric();
  }
  errorFetchingOrders: boolean = false;
  ordersLoading: boolean = false;
  allOrders;
  mockData: any;
  totalCount;
  getAllOrders(page = this.p) {
    this.ordersLoading = true;
    this.errorFetchingOrders = false;
    this.productService.getAllOrdersAdmin(page).subscribe(
      (data: any) => {
        this.allOrders = data?.data;
        this.ordersLoading = false;
        this.totalCount = data?.totalOrders;
        this.p = data?.currentPage;
      },
      (error) => {
        this.errorFetchingOrders = true;
        this.ordersLoading = false;
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

  selectedStatus = '';
  statuses = ['New', 'Confirmed', 'Package', 'Shipping', 'Delivered'];
  updateOrderStatus(item, status) {
    item.orderStatus = status;
    console.log(item);
    // Call your API to update status on the server.
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