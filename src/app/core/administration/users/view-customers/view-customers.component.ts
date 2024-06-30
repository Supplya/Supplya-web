import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { ExportService } from '../../services/export.service';

@Component({
  selector: 'app-view-customers',
  templateUrl: './view-customers.component.html',
  styleUrls: ['./view-customers.component.scss']
})

export class ViewCustomersComponent implements OnInit {
  orders: any[] = [];
  userId: string;
  ordersLoading: boolean = false;
  productsLoading: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private adminService: DashboardService,
    private exportService: ExportService
  ) {}
  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.getOrders();
      this.getUser();
    }
  }
  errorFetchingOrders;
  getOrders(): void {
    this.ordersLoading = true;
    this.adminService.getOrdersByID(this.userId).subscribe(
      (data: any) => {
        this.ordersLoading = false;
        this.orders = data.data;
      },
      (error) => {
        this.errorFetchingOrders = true;
        this.ordersLoading = false;
      }
    );
  }

  errorFetchingUser = false;
  userLoading = false;
  userInfo;
  getUser(): void {
    this.userLoading = true;
    this.adminService.getUserByID(this.userId).subscribe(
      (data: any) => {
        this.userLoading = false;
        this.userInfo = data.data;
        // console.log(this.userInfo);
      },
      (error) => {
        this.errorFetchingUser = true;
        this.userLoading = false;
      }
    );
  }
  selectedTab: string = 'products';
  searchText: string = '';

  // applyFilter() {
  //   this.filteredRows = applyGlobalSearch(this.orders, this.searchText, [
  //     'name',
  //     'moq',
  //     'unit_price',
  //     'unit_price',
  //     'status',
  //     'quantity',
  //   ]);
  //   this.p = 1;
  // }
  exportToExcel() {
    // this.exportService.exportToExcel(this.filteredRows, this.title);
  }
 
  refreshUser() {
    this.errorFetchingUser = false;
    this.getUser();
  }
  itemPerPage: number = 8;
  p: number = 1;
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

  refreshOrders() {
    this.getOrders();
    this.errorFetchingOrders = false;
  }
}