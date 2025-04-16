import { Component, OnInit } from '@angular/core';
import { ToastyService } from 'ng-toasty';
import { applyGlobalSearch } from 'src/app/shared/helpers/global-table-search';
import { MediaUploadService } from 'src/app/shared/services/mediaUpload.service';
import Swal from 'sweetalert2';
import { ProductService } from '../../operation/services/product/product.service';
import { DashboardService } from '../services/dashboard.service';
import { ExportService } from '../services/export.service';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})

export class MediaComponent implements OnInit {
  itemPerPage: number = 100;
  filteredRows: any;
  title = 'Media';
  searchText: string = '';
  search
  constructor(
    private adminService: DashboardService,
    private exportService: ExportService,
    private toast: ToastyService,
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    this.getAllMedia();
    this.getCategoryMetrics();
  }

  p: number = 1;
  pageSize: number = 20;
  totalCount: number = 0;
  products: any[] = [];
  loading: boolean = false;

  onPageChange(page: number) {
    this.p = page;
    this.getAllMedia();
  }
  errorFetchingProduct: boolean = false;
  errorFetchingCategory: boolean = false;
  media: any;
  getAllMedia() {
    this.loading = true;
    this.productService.getAllMedia(this.p, this.pageSize, this.search).subscribe(
      (data: any) => {
        this.media = data?.data;
        this.totalCount = data?.totalMedia;
        this.loading = false;
      },
      (error) => {
        this.errorFetchingCategory = true;
        this.loading = false;
      }
    );
  }

  summary;
  statsLoading;
  errorFetchingSummary;
  getCategoryMetrics() {
    this.statsLoading = true;
    this.adminService.getCategoryMetric().subscribe(
      (data: any) => {
        this.statsLoading = false;

        if (data.status) {
          this.summary = data.data;
          console.log(this.summary);
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
    this.filteredRows = applyGlobalSearch(this.media, this.searchText, [
      'name',
      'moq',
      'unit_price',
      'unit_price',
      'status',
      'quantity',
    ]);
    this.p = 1;
  }

  deleteMedia(category: any) {
    Swal.fire({
      html: `<span style="color: #000; font-weight: 600; font-size: 19px;">Are you sure you want to delete this media "<span style="color: var(--primary-color);">${category?.section}</span>"?</span>`,
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
    this.productService.deleteMedia(id).subscribe((result) => {
      if (result) {
        this.toast.success('Media deleted successfully');
        this.getAllMedia();
      }
    });
  }
  exportToExcel() {
    this.exportService.exportToExcel(this.media, this.title);
  }
  refreshCategory() {
    this.errorFetchingCategory = false;
    this.getAllMedia();
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