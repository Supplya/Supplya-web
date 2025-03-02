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
  selectedYear: number = 0;
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
    this.initializeYears();
    if (this.selectedYear) {
      
      this.getDashboardStats();
    }
    this.getDashboardStatsTotalSales();

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
  
  signUpStats
 
  totalSalesAmount
  // getDashboardStatsTotalSales(year = new Date().getFullYear(), month = (new Date().getMonth() + 1).toString().padStart(2, '0')) {
  //   this.adminService.getSales(year, month).subscribe((response: any) => {
  //     if (response.status) {
  //       this.totalSalesAmount = response.data.totalSalesAmount; // Store actual sales amount
  //       this.updateSalesChartData(); // Update the chart with new data
  //     }
  //   }, error => {
  //     console.error('Error fetching sales data:', error);
  //   });
  // }


  
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

  // createSalesLineChart(): void {
  //   const ctx = (
  //     this.mySalesLineChart.nativeElement as HTMLCanvasElement
  //   ).getContext('2d');

  //   if (ctx) {
  //     this.salesLineChart = new Chart(ctx, {
  //       type: 'line',
  //       data: {
  //         labels: this.generateMonthLabels(),
  //         datasets: [
  //           {
  //             label: 'Total Sales Amount',
  //             data: this.generateSalesData(),
  //             borderColor: '#0097A8',
  //             backgroundColor: '#0097A888',
  //             fill: false,
  //             pointBackgroundColor: '#0097A8',
  //             pointRadius: 5,
  //             borderWidth: 2,
  //           },
  //         ],
  //       },
  //       options: {
  //         aspectRatio: 2,
  //         scales: {
  //           y: {
  //             beginAtZero: true,
  //             ticks: {
  //               callback: function (value) {
  //                 return '₦' + new Intl.NumberFormat('en-NG').format(value as number);
  //               },
  //             },
  //           },
  //         },
  //         plugins: {
  //           legend: {
  //             position: 'bottom',
  //             labels: {
  //               usePointStyle: true,
  //             },
  //           },
  //           tooltip: {
  //             callbacks: {
  //               label: function (context) {
  //                 let value = context.raw as number;
  //                 return 'Total Sales: ₦' + new Intl.NumberFormat('en-NG').format(value);
  //               },
  //             },
  //           },
  //         },
  //       },
  //     });
  //   } else {
  //     console.error('Failed to acquire context for the sales line chart');
  //   }
  // }


  // generateSalesMonthLabels(): string[] {
  //   const selectedMonthIndex = this.months.findIndex(
  //     (month) => month.value === this.selectedMonth
  //   );
  //   return this.months.slice(selectedMonthIndex).map((month) => month.label);
  // }

  generateSalesData(): number[] {
    return [this.totalSalesAmount || 0];
  }


 
  // updateSalesChartData(): void {
  //   this.salesLineChart.data.labels = this.generateSalesMonthLabels();
  //   this.salesLineChart.data.datasets.forEach((dataset) => {
  //     dataset.data = this.generateSalesData();
  //   });
  //   this.salesLineChart.update();
  // }

  // changeMonth(event: any): void {
  //   this.selectedMonth = event.target.value;
  //   this.getDashboardStatsTotalSales(this.selectedYear, this.selectedMonth); // Fetch new data when month changes
  // }
  getDashboardStatsTotalSales(year = new Date().getFullYear().toString(), month = (new Date().getMonth() + 1).toString()) {
    this.adminService.getSales(year, month).subscribe((response: any) => {
      if (response.status) {
        this.totalSalesAmount = response.data.totalSalesAmount;
        this.updateSalesChartData();
      }
    });
  }

  createSalesLineChart(): void {
    const ctx = (
      this.mySalesLineChart.nativeElement as HTMLCanvasElement
    ).getContext('2d');

    if (ctx) {
      this.salesLineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [this.getSelectedMonthLabel()], // Show only the selected month
          datasets: [
            {
              label: 'Total Sales Amount',
              data: [this.totalSalesAmount], // Show only selected month’s sales
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
              ticks: {
                callback: function (value) {
                  return '₦' + new Intl.NumberFormat('en-NG').format(value as number);
                },
              },
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
                  return 'Total Sales: ₦' + new Intl.NumberFormat('en-NG').format(value);
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

  changeMonth(event: any): void {
    this.selectedMonth = event.target.value;
    this.getDashboardStatsTotalSales(this.selectedYear.toString(), this.selectedMonth); // Fetch data for selected month
  }

  updateSalesChartData(): void {
    if (this.salesLineChart) {
      this.salesLineChart.data.labels = [this.getSelectedMonthLabel()]; // Show only selected month
      this.salesLineChart.data.datasets[0].data = [this.totalSalesAmount]; // Update sales amount
      this.salesLineChart.update();
    }
  }

  getSelectedMonthLabel(): string {
    return this.months.find((month) => month.value === this.selectedMonth)?.label || '';
  }


  initializeYears(): void {
    const currentYear = new Date().getFullYear();
    this.selectedYear = currentYear;
    for (let year = currentYear - 3; year <= currentYear; year++) {
      this.years.push(year);
    }
  }
  changeYear(event: any): void {
    this.selectedYear = parseInt(event.target.value, 10); // Parse selected year as integer
    this.getDashboardStats(); // Fetch new data
  }

  getDashboardStats() {
    this.adminService.getDashboardStats(this.selectedYear).subscribe((charts: any) => {
      if (charts && charts.data) {
        this.signUpStats = charts.data; // Update dataset
        if (this.lineChart) {
          this.updateLineChart(charts); // If chart exists, update it
        } else {
          this.createLineChart(charts); // Otherwise, create a new chart
        }
      }
    });
  }

  createLineChart(responseData: any): void {
    const ctx = (this.myLineChart.nativeElement as HTMLCanvasElement).getContext('2d');

    if (!ctx) {
      console.error('Failed to acquire context for the line chart');
      return;
    }

    const { labels, customersData, vendorsData } = this.processChartData(responseData.data);

    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Customers',
            data: customersData,
            borderColor: '#0097A8',
            backgroundColor: '#0097A888',
            fill: false,
            pointBackgroundColor: '#0097A8',
            pointRadius: 5,
            borderWidth: 2,
          },
          {
            label: 'Vendors',
            data: vendorsData,
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
              padding: 20,
            },
          },
          tooltip: {
            enabled: true, // Ensure tooltips are enabled
            mode: 'index', // Show tooltip when hovering anywhere on X-axis
            intersect: false, // Ensures tooltip appears even if not directly on a point
            callbacks: {
              label: function (context) {
                let value = context.raw as number;
                return context.dataset.label + ': ' + value;
              },
            },
          }

        },
        hover: {
          mode: 'nearest',
          intersect: false,
        },
      }

    });
  }

  updateLineChart(responseData: any): void {
    if (this.lineChart) {
      const { labels, customersData, vendorsData } = this.processChartData(responseData.data);

      this.lineChart.data.labels = labels; // Update labels with new months
      this.lineChart.data.datasets[0].data = customersData; // Update Customers data
      this.lineChart.data.datasets[1].data = vendorsData; // Update Vendors data

      this.lineChart.update(); // Refresh the chart
    }
  }

  processChartData(data: any) {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const currentMonthIndex = new Date().getMonth(); // Get current month index (0-based)
    const isCurrentYear = this.selectedYear === new Date().getFullYear(); // Check if selected year is current

    const labels: string[] = [];
    const customersData: number[] = [];
    const vendorsData: number[] = [];

    // Determine the range of months to display
    const monthsToShow = isCurrentYear ? currentMonthIndex + 1 : 12;

    for (let i = 0; i < monthsToShow; i++) {
      const month = monthNames[i];
      labels.push(month);
      customersData.push(data[month]?.totalCustomers || 0);
      vendorsData.push(data[month]?.totalVendors || 0);
    }

    return { labels, customersData, vendorsData };
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

  
  userInfo;
  updateSuccess() {
    this.userInfo = this.authService.getUserCredentials();
    this.toggleModal('updateProfileModal', 'close');
  }
}
