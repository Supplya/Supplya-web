import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../operation/services/product/product.service';
import { ExportService } from '../../administration/services/export.service';
import { applyGlobalSearch } from 'src/app/shared/helpers/global-table-search';
import Swal from 'sweetalert2';
import { ToastyService } from 'ng-toasty';
import { Chart, registerables } from 'chart.js';
import { AuthService } from 'src/app/authentication/service/auth.service';

@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.scss'],
})
export class VendorDashboardComponent implements OnInit {
  p: number = 1; // Current page
  listPage: number = 1; // Current page
  listItemPerPage: number = 1; 
  itemsPerPage: number = 5; // Number of items per page
  filteredRows: any;
  title = 'Orders';
  searchText: string = '';
  public chart: any;
  constructor(
    private productService: ProductService,
    private exportService: ExportService,
    private toast: ToastyService,
    private authService: AuthService
  ) {
    Chart.register(...registerables);
  }
  userInfo;
  ngOnInit(): void {
    // this.getAllProducts();
    this.userInfo = this.authService.getUserCredentials();
    this.getVendorMetric();
    this.getAllOrders();
    if (this.userInfo) {
      if (
        this.userInfo?.phoneNumber === null ||
        this.userInfo?.phoneNumber === '' ||
        this.userInfo?.address === null ||
        this.userInfo?.address === '' ||
        this.userInfo?.state === null ||
        this.userInfo?.state === ''
      ) {
        this.toggleModal('updateProfileModal', 'open');
      }
    }
  }
  updateSuccess() {
    this.userInfo = this.authService.getUserCredentials();
    this.toggleModal('updateProfileModal', 'close');
  }
  errorFetchingProduct: boolean = false;
  ordersLoading: boolean = false;
  allOrders: any;

  // createChart(data: any) {
  //   this.chart = new Chart('MyChart', {
  //     type: 'bar',
  //     data: {
  //       // Values on X-Axis
  //       labels: [
  //         'Total Orders',
  //         'Total Stock',
  //         'Total Amount Sold',
  //         'Received Orders',
  //         'Delivered Orders',
  //         'New Orders',
  //       ],
  //       datasets: [
  //         {
  //           label: 'Order Summary',
  //           data: [
  //             data.totalOrders,
  //             data.totalStock,
  //             data.totalAmountSold,
  //             data.receivedOrdersCount,
  //             data.deliveredOrdersCount,
  //             data.newOrdersCount,
  //           ],
  //           backgroundColor: 'rgba(0, 123, 255, 0.6)',
  //           borderColor: 'rgba(0, 123, 255, 1)',
  //           borderWidth: 1,
  //         },
  //       ],
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //         },
  //       },
  //       aspectRatio: 2.5,
  //     },
  //   });
  // }
  createChart(data: any) {
    const ctx = document.getElementById('MyChart') as HTMLCanvasElement;
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'bar', // This denotes the type of chart
        data: {
          // Values on X-Axis
          labels: [
            'Total Orders',
            'Total Stock',
            'Total Amount Sold',
            'Received Orders',
            'Delivered Orders',
            'New Orders',
          ],
          datasets: [
            {
              label: 'Order Summary',
              data: [
                data.totalOrders,
                data.totalStock,
                data.totalAmountSold,
                data.receivedOrdersCount,
                data.deliveredOrdersCount,
                data.newOrdersCount,
              ],
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          aspectRatio: 2.5,
        },
      });
    } else {
      console.error('Failed to acquire context for the chart');
    }
  }
  summary;
  getVendorMetric() {
    this.ordersLoading = true;
    this.productService.getVendorMetric().subscribe(
      (data: any) => {
        if (data.status) {
          this.summary = data.data;
          // this.allOrders = data?.data?.orders
          // console.log(this.summary);
          this.createChart(this.summary);
        } else {
        }
        // this.ordersLoading = false;
      },
      (error) => {
        // this.errorFetchingProduct = true;
        // this.ordersLoading = false;
      }
    );
  }

  getAllOrders() {
    this.ordersLoading = true;
    this.errorFetchingProduct = false;
    this.productService.getAllOrderByUser(this.userInfo?._id).subscribe(
      (data: any) => {
        this.allOrders = data?.data;
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
    }
  };
}
