import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/core/operation/services/product/product.service';
import { ExportService } from '../../services/export.service';
import { ToastyService } from 'ng-toasty';
import { applyGlobalSearch } from 'src/app/shared/helpers/global-table-search';
import Swal from 'sweetalert2';
import { DashboardService } from '../../services/dashboard.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  filteredRows: any;
  title = 'Products';
  searchText: string = '';
  search
  constructor(
    private adminService: DashboardService,
    private exportService: ExportService,
    private toast: ToastyService,
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    this.getAllProducts();
    this.getProductMetric();
  }

  p: number = 1; 
  pageSize: number = 20; 
  totalCount: number = 0; 
  products: any[] = [];
  productLoading: boolean = false;
  errorFetchingProduct: boolean = false;

  getAllProducts() {
    this.productLoading = true;
    this.productService.getAllProducts(this.p, this.pageSize).subscribe(
      (response: any) => {
        this.products = response?.data || [];
        this.totalCount = response?.totalProducts || 0;
        this.productLoading = false;
      },
      (error) => {
        this.errorFetchingProduct = true;
        this.productLoading = false;
      }
    );
  }

  // Handle page changes
  onPageChange(page: number) {
    this.p = page;
    this.getAllProducts();
  }

  summary;
  statsLoading;
  errorFetchingSummary;
  getProductMetric() {
    this.statsLoading = true;
    this.adminService.getProductMetric().subscribe(
      (data: any) => {
        this.statsLoading = false;

        if (data.status) {
          this.summary = data.data;

          //         {
          //   totalProducts: 9,
          //   totalProductsAddedLastMonth: 0,
          //   totalProductsAddedLastWeek: 0,
          //   newProductsAddedToday: 0,
          //   totalProductsInStock: 9,
          //   totalProductsOutOfStock: 0
          // }
        } else {
        }
        // this.ordersLoading = false;
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
    this.filteredRows = applyGlobalSearch(this.products, this.searchText, [
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
    this.exportService.exportToExcel(this.products, this.title);
  }
  refreshProducts() {
    this.errorFetchingProduct = false;
    this.getAllProducts();
  }

}