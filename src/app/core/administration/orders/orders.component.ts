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
    // this.getAllProducts();
    this.getVendorMetric();
  }
  errorFetchingProduct: boolean = false;
  ordersLoading: boolean = false;
  allOrders: any;
  mockData: any;
  getAllProducts() {
    this.ordersLoading = true;
    this.productService.getAllOrders().subscribe(
      (data: any) => {
        this.allOrders = data?.data;
        this.filteredRows = data?.data;
        this.ordersLoading = false;

        //   {
        //     orderStatus: 'completed',
        //     _id: '6665ed5d31b6a48b88ec0c12',
        //     user: '666565698bfa8c6d44a85b9d',
        //     orderItems: [
        //       {
        //         quantity: 5,
        //         product: {
        //           unit_price: 5500,
        //           discounted_price: 5300,
        //           image:
        //             'https://res.cloudinary.com/piusash/image/upload/v1717534989/supplya-images/sfr2jnrjexigm4k41ptt.jpg',
        //           images: [
        //             'https://res.cloudinary.com/piusash/image/upload/v1717534989/supplya-images/sfr2jnrjexigm4k41ptt.jpg',
        //           ],
        //           status: 'inStock',
        //           isFeatured: false,
        //           flashsale: false,
        //           saleCount: null,
        //           approved: true,
        //           sku: '1313332',
        //           moq: 5,
        //           _id: '665f8170e47896006c30a768',
        //           name: 'Golden Penny Noodles',
        //           description: 'Oloyin Foods Premium Yam Flour Elubo',
        //           quantity: 0,
        //           brand: '',
        //           category: '65fd32c22627e92b2549d027',
        //           rating: '',
        //           createdBy: '664bd4797a7ea05de81105bc',
        //           dateCreated: '2024-06-04T21:04:48.840Z',
        //           __v: 0,
        //         },
        //       },
        //       {
        //         quantity: 5,
        //         product: {
        //           unit_price: 5500,
        //           discounted_price: 5300,
        //           image:
        //             'https://res.cloudinary.com/piusash/image/upload/v1717534989/supplya-images/sfr2jnrjexigm4k41ptt.jpg',
        //           images: [
        //             'https://res.cloudinary.com/piusash/image/upload/v1717534989/supplya-images/sfr2jnrjexigm4k41ptt.jpg',
        //           ],
        //           status: 'inStock',
        //           isFeatured: false,
        //           flashsale: false,
        //           saleCount: null,
        //           approved: true,
        //           sku: '1313332',
        //           moq: 5,
        //           _id: '665f8170e47896006c30a768',
        //           name: 'Yam Flour',
        //           description: 'Oloyin Foods Premium Yam Flour Elubo',
        //           quantity: 0,
        //           brand: '',
        //           category: '65fd32c22627e92b2549d027',
        //           rating: '',
        //           createdBy: '664bd4797a7ea05de81105bc',
        //           dateCreated: '2024-06-04T21:04:48.840Z',
        //           __v: 0,
        //         },
        //       },
        //       {
        //         quantity: 5,
        //         product: {
        //           unit_price: 5500,
        //           discounted_price: 5300,
        //           image:
        //             'https://res.cloudinary.com/piusash/image/upload/v1717534989/supplya-images/sfr2jnrjexigm4k41ptt.jpg',
        //           images: [
        //             'https://res.cloudinary.com/piusash/image/upload/v1717534989/supplya-images/sfr2jnrjexigm4k41ptt.jpg',
        //           ],
        //           status: 'inStock',
        //           isFeatured: false,
        //           flashsale: false,
        //           saleCount: null,
        //           approved: true,
        //           sku: '1313332',
        //           moq: 5,
        //           _id: '665f8170e47896006c30a768',
        //           name: 'Palm Oil',
        //           description: 'Oloyin Foods Premium Yam Flour Elubo',
        //           quantity: 0,
        //           brand: '',
        //           category: '65fd32c22627e92b2549d027',
        //           rating: '',
        //           createdBy: '664bd4797a7ea05de81105bc',
        //           dateCreated: '2024-06-04T21:04:48.840Z',
        //           __v: 0,
        //         },
        //       },
        //     ],
        //     city: 'Lagos',
        //     zip: '501721',
        //     country: 'Nigeria',
        //     phone: '09023901138',
        //     email: 'dwaine.khaidyn@dockleafs.com',
        //     address: '17, Bode Thomas Street',
        //     orderNote: 'Test order.',
        //     totalPrice: '27500',
        //     paymentMethod: 'paystack',
        //     dateOrdered: '2024-06-09T17:58:53.947Z',
        //     deliveryDate: '2024-06-29T12:00:00.000Z',
        //   },
        //   {
        //     orderStatus: 'completed',
        //     _id: '6665ed5d31b6a48b88ec0c13',
        //     user: '666565698bfa8c6d44a85b9e',
        //     orderItems: [
        //       {
        //         quantity: 2,
        //         product: {
        //           unit_price: 7000,
        //           discounted_price: 6800,
        //           image:
        //             'https://res.cloudinary.com/piusash/image/upload/v1717534990/supplya-images/sfr2jnrjexigm4k41ptt.jpg',
        //           images: [
        //             'https://res.cloudinary.com/piusash/image/upload/v1717534990/supplya-images/sfr2jnrjexigm4k41ptt.jpg',
        //           ],
        //           status: 'inStock',
        //           isFeatured: true,
        //           flashsale: false,
        //           saleCount: null,
        //           approved: true,
        //           sku: '1313333',
        //           moq: 2,
        //           _id: '665f8170e47896006c30a769',
        //           name: 'Cassava Flour',
        //           description: 'Oloyin Foods Premium Cassava Flour Elubo',
        //           quantity: 0,
        //           brand: '',
        //           category: '65fd32c22627e92b2549d028',
        //           rating: '',
        //           createdBy: '664bd4797a7ea05de81105bd',
        //           dateCreated: '2024-06-05T21:04:48.840Z',
        //           __v: 0,
        //         },
        //       },
        //     ],
        //     city: 'Abuja',
        //     zip: '501722',
        //     country: 'Nigeria',
        //     phone: '09023901139',
        //     email: 'alice.jones@dockleafs.com',
        //     address: '21, Marina Street',
        //     orderNote: 'Urgent order.',
        //     totalPrice: '13600',
        //     paymentMethod: 'paystack',
        //     dateOrdered: '2024-06-10T17:58:53.947Z',
        //     deliveryDate: '2024-06-30T12:00:00.000Z',
        //   },
        //   {
        //     orderStatus: 'pending',
        //     _id: '6665ed5d31b6a48b88ec0c14',
        //     user: '666565698bfa8c6d44a85b9f',
        //     orderItems: [
        //       {
        //         quantity: 3,
        //         product: {
        //           unit_price: 4500,
        //           discounted_price: 4300,
        //           image:
        //             'https://res.cloudinary.com/piusash/image/upload/v1717534991/supplya-images/sfr2jnrjexigm4k41ptt.jpg',
        //           images: [
        //             'https://res.cloudinary.com/piusash/image/upload/v1717534991/supplya-images/sfr2jnrjexigm4k41ptt.jpg',
        //           ],
        //           status: 'outOfStock',
        //           isFeatured: false,
        //           flashsale: true,
        //           saleCount: 10,
        //           approved: true,
        //           sku: '1313334',
        //           moq: 3,
        //           _id: '665f8170e47896006c30a770',
        //           name: 'Rice Flour',
        //           description: 'Oloyin Foods Premium Rice Flour Elubo',
        //           quantity: 0,
        //           brand: '',
        //           category: '65fd32c22627e92b2549d029',
        //           rating: '',
        //           createdBy: '664bd4797a7ea05de81105be',
        //           dateCreated: '2024-06-06T21:04:48.840Z',
        //           __v: 0,
        //         },
        //       },
        //     ],
        //     city: 'Ibadan',
        //     zip: '501723',
        //     country: 'Nigeria',
        //     phone: '09023901140',
        //     email: 'john.doe@dockleafs.com',
        //     address: '10, Oyo Street',
        //     orderNote: 'Handle with care.',
        //     totalPrice: '12900',
        //     paymentMethod: 'flutterwave',
        //     dateOrdered: '2024-06-11T17:58:53.947Z',
        //     deliveryDate: '2024-07-01T12:00:00.000Z',
        //   },
        //   {
        //     orderStatus: 'new',
        //     _id: '6665ed5d31b6a48b88ec0c15',
        //     user: '666565698bfa8c6d44a85b9g',
        //     orderItems: [
        //       {
        //         quantity: 4,
        //         product: {
        //           unit_price: 6000,
        //           discounted_price: 5800,
        //           image:
        //             'https://res.cloudinary.com/piusash/image/upload/v1717534992/supplya-images/sfr2jnrjexigm4k41ptt.jpg',
        //           images: [
        //             'https://res.cloudinary.com/piusash/image/upload/v1717534992/supplya-images/sfr2jnrjexigm4k41ptt.jpg',
        //           ],
        //           status: 'inStock',
        //           isFeatured: true,
        //           flashsale: false,
        //           saleCount: null,
        //           approved: true,
        //           sku: '1313335',
        //           moq: 4,
        //           _id: '665f8170e47896006c30a771',
        //           name: 'Maize Flour',
        //           description: 'Oloyin Foods Premium Maize Flour Elubo',
        //           quantity: 0,
        //           brand: '',
        //           category: '65fd32c22627e92b2549d030',
        //           rating: '',
        //           createdBy: '664bd4797a7ea05de81105bf',
        //           dateCreated: '2024-06-07T21:04:48.840Z',
        //           __v: 0,
        //         },
        //       },
        //     ],
        //     city: 'Kano',
        //     zip: '501724',
        //     country: 'Nigeria',
        //     phone: '09023901141',
        //     email: 'jane.doe@dockleafs.com',
        //     address: '5, Kano Road',
        //     orderNote: 'Gift order.',
        //     totalPrice: '23200',
        //     paymentMethod: 'paystack',
        //     dateOrdered: '2024-06-12T17:58:53.947Z',
        //     deliveryDate: '2024-07-02T12:00:00.000Z',
        //   },
        //   {
        //     orderStatus: 'cancelled',
        //     _id: '6665ed5d31b6a48b88ec0c16',
        //     user: '666565698bfa8c6d44a85b9h',
        //     orderItems: [
        //       {
        //         quantity: 1,
        //         product: {
        //           unit_price: 8000,
        //           discounted_price: 7800,
        //           image:
        //             'https://res.cloudinary.com/piusash/image/upload/v1717534993/supplya-images/sfr2jnrjexigm4k41ptt.jpg',
        //           images: [
        //             'https://res.cloudinary.com/piusash/image/upload/v1717534993/supplya-images/sfr2jnrjexigm4k41ptt.jpg',
        //           ],
        //           status: 'inStock',
        //           isFeatured: false,
        //           flashsale: true,
        //           saleCount: 5,
        //           approved: true,
        //           sku: '1313336',
        //           moq: 1,
        //           _id: '665f8170e47896006c30a772',
        //           name: 'Wheat Flour',
        //           description: 'Oloyin Foods Premium Wheat Flour Elubo',
        //           quantity: 0,
        //           brand: '',
        //           category: '65fd32c22627e92b2549d031',
        //           rating: '',
        //           createdBy: '664bd4797a7ea05de81105bg',
        //           dateCreated: '2024-06-08T21:04:48.840Z',
        //           __v: 0,
        //         },
        //       },
        //       {
        //         quantity: 1,
        //         product: {
        //           unit_price: 8000,
        //           discounted_price: 7800,
        //           image:
        //             'https://res.cloudinary.com/piusash/image/upload/v1717534993/supplya-images/sfr2jnrjexigm4k41ptt.jpg',
        //           images: [
        //             'https://res.cloudinary.com/piusash/image/upload/v1717534993/supplya-images/sfr2jnrjexigm4k41ptt.jpg',
        //           ],
        //           status: 'inStock',
        //           isFeatured: false,
        //           flashsale: true,
        //           saleCount: 5,
        //           approved: true,
        //           sku: '1313336',
        //           moq: 1,
        //           _id: '665f8170e47896006c30a772',
        //           name: 'Wheat Flour',
        //           description: 'Oloyin Foods Premium Wheat Flour Elubo',
        //           quantity: 0,
        //           brand: '',
        //           category: '65fd32c22627e92b2549d031',
        //           rating: '',
        //           createdBy: '664bd4797a7ea05de81105bg',
        //           dateCreated: '2024-06-08T21:04:48.840Z',
        //           __v: 0,
        //         },
        //       },
        //       {
        //         quantity: 1,
        //         product: {
        //           unit_price: 8000,
        //           discounted_price: 7800,
        //           image:
        //             'https://res.cloudinary.com/piusash/image/upload/v1717534993/supplya-images/sfr2jnrjexigm4k41ptt.jpg',
        //           images: [
        //             'https://res.cloudinary.com/piusash/image/upload/v1717534993/supplya-images/sfr2jnrjexigm4k41ptt.jpg',
        //           ],
        //           status: 'inStock',
        //           isFeatured: false,
        //           flashsale: true,
        //           saleCount: 5,
        //           approved: true,
        //           sku: '1313336',
        //           moq: 1,
        //           _id: '665f8170e47896006c30a772',
        //           name: 'Wheat Flour',
        //           description: 'Oloyin Foods Premium Wheat Flour Elubo',
        //           quantity: 0,
        //           brand: '',
        //           category: '65fd32c22627e92b2549d031',
        //           rating: '',
        //           createdBy: '664bd4797a7ea05de81105bg',
        //           dateCreated: '2024-06-08T21:04:48.840Z',
        //           __v: 0,
        //         },
        //       },
        //     ],
        //     city: 'Port Harcourt',
        //     zip: '501725',
        //     country: 'Nigeria',
        //     phone: '09023901142',
        //     email: 'mary.smith@dockleafs.com',
        //     address: '15, PH Street',
        //     orderNote: 'Please deliver on time.',
        //     totalPrice: '7800',
        //     paymentMethod: 'flutterwave',
        //     dateOrdered: '2024-06-13T17:58:53.947Z',
        //     deliveryDate: '2024-07-03T12:00:00.000Z',
        //   },
        // ];
      },
      (error) => {
        this.errorFetchingProduct = true;
        this.ordersLoading = false;
      }
    );
  }

  summary;
  summaryLoading = false;
  errorFetchingSummary = false;
  getVendorMetric() {
    this.ordersLoading = true;
    this.adminService.getOrderMetric().subscribe(
      (data: any) => {
        this.ordersLoading = false;
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
        this.ordersLoading = false;
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