import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../operation/services/product/product.service';
import { ExportService } from '../../administration/services/export.service';
import { applyGlobalSearch } from 'src/app/shared/helpers/global-table-search';
import Swal from 'sweetalert2';
import { ToastyService } from 'ng-toasty';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.scss'],
})
export class VendorDashboardComponent implements OnInit {
  itemPerPage: number = 5;
  p: number = 1;
  filteredRows: any;
  title = 'Products';
  searchText: string = '';
  public chart: any;
  constructor(
    private productService: ProductService,
    private exportService: ExportService,
    private toast: ToastyService
  ) {
    Chart.register(...registerables);
  }
  ngOnInit(): void {
    // this.getAllProducts();
    this.getVendorMetric();
    this.getAllOrders();
  }
  errorFetchingProduct: boolean = false;
  ordersLoading: boolean = false;
  allOrders: any;
  mockData: any;
  getAllProducts() {
    this.ordersLoading = true;
    this.productService.getAllVendorProducts().subscribe(
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
        if (data.status === 'success') {
          this.summary = data.data;
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
    this.productService.getAllVendorOrders().subscribe(
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
      if (result === 'success') {
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
}
