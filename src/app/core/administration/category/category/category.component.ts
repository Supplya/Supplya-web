import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/core/operation/services/product/product.service';
import { ExportService } from '../../services/export.service';
import { ToastyService } from 'ng-toasty';
import { applyGlobalSearch } from 'src/app/shared/helpers/global-table-search';
import Swal from 'sweetalert2';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  itemPerPage: number = 8;
  p: number = 1;
  filteredRows: any;
  title = 'Categories';
  searchText: string = '';
  constructor(
    private adminService: DashboardService,
    private exportService: ExportService,
    private toast: ToastyService,
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    this.getAllCategories();
    this.getCategoryMetrics();
  }
  errorFetchingCategory: boolean = false;
  categoryLoading: boolean = false;
  categories: any;
  getAllCategories() {
    this.categoryLoading = true;
    this.productService.getAllCategories().subscribe(
      (data: any) => {
        this.categories = data?.data;
        this.filteredRows = data?.data;
        this.categoryLoading = false;
      },
      (error) => {
        this.errorFetchingCategory = true;
        this.categoryLoading = false;
      }
    );
  }

  summary;
  statsLoading;
  errorFetchingSummary;
  getCategoryMetrics() {
    this.statsLoading = true;
    this.adminService.getProductMetric().subscribe(
      (data: any) => {
        this.statsLoading = false;

        if (data.status) {
          this.summary = data.data;
        } 
      },
      (error) => {
        this.errorFetchingSummary = true;
        // this.ordersLoading = false;
        this.statsLoading = false;
      }
    );
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
  applyFilter() {
    this.filteredRows = applyGlobalSearch(this.categories, this.searchText, [
      'name',
      'moq',
      'unit_price',
      'unit_price',
      'status',
      'quantity',
    ]);
    this.p = 1;
  }

  deleteCategory(category: any) {
    Swal.fire({
      html: `<span style="color: #000; font-weight: 600; font-size: 19px;">Are you sure you want to delete this category "<span style="color: var(--primary-color);">${category.name}</span>"?</span>`,
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
        this.delete(category._id);
      }
    });
  }
  delete(id: string) {
    this.productService.deleteCategory(id).subscribe((result) => {
      if (result) {
        this.toast.success('category deleted successfully');
        this.getAllCategories();
      }
    });
  }
  exportToExcel() {
    this.exportService.exportToExcel(this.filteredRows, this.title);
  }
  refreshCategory() {
    this.errorFetchingCategory = false;
    this.getAllCategories();
  }
  get productsToShow(): any[] {
    const startIndex = (this.p - 1) * this.itemPerPage;
    const endIndex = Math.min(
      startIndex + this.itemPerPage,
      this.filteredRows?.length
    );
    return this.filteredRows?.slice(startIndex, endIndex);
  }

  // Method to calculate the start record number shown on the current page
  calculateStartRecord(): number {
    return (this.p - 1) * this.itemPerPage + 1;
  }

  // Method to calculate the end record number shown on the current page
  calculateEndRecord(): number {
    return Math.min(this.p * this.itemPerPage, this.filteredRows?.length);
  }
}
