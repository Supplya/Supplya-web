import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../operation/services/product/product.service';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../services/dashboard.service';
import { AuthService } from 'src/app/authentication/service/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('mySalesLineChart') mySalesLineChart: ElementRef;
  chart: Chart;
  @ViewChild('myLineChart') myLineChart: ElementRef;
  lineChart: Chart;
  salesLineChart: Chart;
  selectedYear: number;
  selectedMonth: string; // Selected month value
  years: number[] = [];
  months: { label: string; value: string }[] = [];
  constructor(
    private productService: ProductService,
    private adminService: DashboardService,
    private authService: AuthService
  ) {
    Chart.register(...registerables);
  }
  ngOnInit(): void {
    this.getDashboardMetric();
    this.getCharts();

    this.userInfo = this.authService.getUserCredentials();

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

  toggleModal = (modalId, action: string, data?: any) => {
    if (action == 'open') {
      document.getElementById(modalId).style.display = 'flex';
    } else {
      document.getElementById(modalId).style.display = 'none';
    }
  };

  getCharts() {
    this.adminService.getDashboardCharts().subscribe(charts => {
      // console.log(charts)
     })
}


  summary;
  statsLoading;
  errorFetchingSummary: boolean = false;
  getDashboardMetric() {
    this.statsLoading = true;
    this.adminService.getDashboardMetric().subscribe(
      (data: any) => {
        this.statsLoading = false;
        if (data.status) {
          // Assign the summary data
          this.summary = data.data;

          // Map the topSellingProducts to include shopLink
          this.summary.topSellingProducts = this.summary.topSellingProducts.map(
            (product) => ({
              ...product, // Include all existing properties of product
              shopLink: this.extractStoreName(product?.storeUrl), // Add the extracted store name
            })
          );
        }
      },
      (error) => {
        this.errorFetchingSummary = true;
        this.statsLoading = false;
      }
    );
  }

 

  extractStoreName(url: string): string {
    const parts = url?.split('/store/');
    return parts?.length > 1 ? parts[1] : '';
  }
  refreshSummary() {
    this.statsLoading = false;
    this.errorFetchingSummary = true;
    this.getDashboardMetric();
  }
  ngAfterViewInit(): void {
    this.createLineChart();
    this.initializeYears();

    this.initializeMonths();
    this.createSalesLineChart();
  }
  initializeMonths(): void {
    const currentMonth = new Date().getMonth(); // Get current month (0-indexed)
    const monthsList = [
      { label: 'January', value: '01' },
      { label: 'February', value: '02' },
      { label: 'March', value: '03' },
      { label: 'April', value: '04' },
      { label: 'May', value: '05' },
      { label: 'June', value: '06' },
      { label: 'July', value: '07' },
      { label: 'August', value: '08' },
      { label: 'September', value: '09' },
      { label: 'October', value: '10' },
      { label: 'November', value: '11' },
      { label: 'December', value: '12' },
    ];

    // Add months from January to current month (inclusive)
    this.months = monthsList.slice(0, currentMonth + 1).reverse(); // Reverse to show recent months first
    this.selectedMonth = monthsList[currentMonth].value; // Set default selected month to current month
  }

  createSalesLineChart(): void {
    const ctx = (
      this.mySalesLineChart.nativeElement as HTMLCanvasElement
    ).getContext('2d');
    if (ctx) {
      this.salesLineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.generateMonthLabels(),
          datasets: [
            {
              label: 'Total Sales Amount',
              data: this.generateSalesData(),
              borderColor: '#0097A8',
              backgroundColor: '#0097A888',
              fill: false,
              pointBackgroundColor: '#0097A8',
              pointRadius: 5,
              borderWidth: 2,
            },
          ],
        },
        options: {
          aspectRatio: 2,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                usePointStyle: true,
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let value = context.raw as number;
                  return 'Total Sales: ₦' + value.toFixed(0);
                },
              },
            },
          },
        },
      });
    } else {
      console.error('Failed to acquire context for the sales line chart');
    }
  }

  generateSalesMonthLabels(): string[] {
    const selectedMonthIndex = this.months.findIndex(
      (month) => month.value === this.selectedMonth
    );
    return this.months.slice(selectedMonthIndex).map((month) => month.label);
  }

  generateSalesData(): number[] {
    // Replace with actual data generation logic for total sales amount
    return Array.from({ length: this.generateSalesMonthLabels().length }, () =>
      Math.floor(Math.random() * 1000)
    );
  }

  changeMonth(event: any): void {
    this.selectedMonth = event.target.value;
    // Replace with logic to update chart data based on selected month
    this.updateSalesChartData();
  }

  updateSalesChartData(): void {
    this.salesLineChart.data.labels = this.generateSalesMonthLabels();
    this.salesLineChart.data.datasets.forEach((dataset) => {
      dataset.data = this.generateSalesData();
    });
    this.salesLineChart.update();
  }
  initializeYears(): void {
    const currentYear = new Date().getFullYear();
    this.selectedYear = currentYear;
    for (let year = currentYear - 3; year <= currentYear; year++) {
      this.years.push(year);
    }
  }

  createLineChart(): void {
    const ctx = (
      this.myLineChart.nativeElement as HTMLCanvasElement
    ).getContext('2d');
    if (ctx) {
      this.lineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.generateMonthLabels(),
          datasets: [
            {
              label: 'Customers',
              data: this.generateRandomData(),
              borderColor: '#0097A8',
              backgroundColor: '#0097A888',
              fill: false,
              pointBackgroundColor: '#0097A8',
              pointRadius: 5,
              borderWidth: 2,
            },
            {
              label: 'Vendors',
              data: this.generateRandomData(),
              borderColor: '#FFD865',
              backgroundColor: '#FFD86588',
              fill: false,
              pointBackgroundColor: '#FFD865',
              pointRadius: 5,
              borderWidth: 2,
            },
          ],
        },
        options: {
          aspectRatio: 2, // Adjust as needed
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                usePointStyle: true, // Use circle for legend
                padding: 20, // Adjust the padding to increase the gap between the labels
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let value = context.raw as number;
                  return context.dataset.label + ': ' + value;
                },
              },
            },
          },
          hover: {
            mode: 'nearest',
            intersect: false,
          },
        },
      });
    } else {
      console.error('Failed to acquire context for the line chart');
    }
  }

  generateMonthLabels(): string[] {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    if (this.selectedYear < currentYear) {
      return months;
    } else {
      return months.slice(0, currentMonth + 1);
    }
  }

  generateRandomData(): number[] {
    // Replace with actual data generation logic for each label (Customers and Vendors)
    return Array.from({ length: this.generateMonthLabels().length }, () =>
      Math.floor(Math.random() * 100)
    );
  }

  changeYear(event: any): void {
    this.selectedYear = parseInt(event.target.value, 10); // Parse selected year as integer
    // Replace with logic to update chart data based on selected year
    // For demo purposes, generate random data
    this.lineChart.data.labels = this.generateMonthLabels();
    this.lineChart.data.datasets.forEach((dataset) => {
      dataset.data = this.generateRandomData();
    });
    this.lineChart.update();
  }
  userInfo;
  updateSuccess() {
    this.userInfo = this.authService.getUserCredentials();
    this.toggleModal('updateProfileModal', 'close');
  }
}
