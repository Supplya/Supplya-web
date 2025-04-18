import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastyService } from 'ng-toasty';
import { CartService } from 'src/app/core/operation/services/cart/cart.service';
import { ProductService } from 'src/app/core/operation/services/product/product.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'],
})
export class StoreComponent implements OnInit {
  cart;
  AllAddedItems;
  products: any = null;
  loading = false;
  error = false;
  qrCodeUrl: string = '';
  constructor(
    private productService: ProductService,
    private loaderService: LoaderService,
    private cartService: CartService,
    private route: Router,
    private router: ActivatedRoute,
    private notify: ToastyService
  ) {
    loaderService.hideLoader();
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
      console.log(this.cart)
      this.AllAddedItems = cart.items;
    });
  }
  vendor;
  vendorReviews: any[] = [];
  storeName;
  ngOnInit(): void {
    // this.getProducts();

    this.storeName = this.router.snapshot.paramMap.get('store-name');
    // this.getVendorDetails(vendorId);
    this.getStoreProducts();
    // this.getStoreInfo();
    // this.getVendorReviews(vendorId);
    if (this.vendor?.banners && this.vendor.banners.length > 0) {
    }
    this.startCarousel();
  }

  detailsLoading = false;
  detailsError = false;
  getStoreInfo(): void {
    this.detailsLoading = true;
    this.productService.getStoreDetails(this.storeName).subscribe(
      (response) => {
        this.vendor = response['data'];
        this.detailsLoading = false;
      },
      (error) => {
        this.detailsError = true;
        this.detailsLoading = false;
      }
    );
  }
  capitalizeFirstLetter(value: string): string {
    if (!value) return '';
    return value?.charAt(0).toUpperCase() + value?.slice(1);
  }
  storeUrl;
  elementType: 'url' | 'canvas' | 'img' = 'url';
  async generateQRCode() {
    try {
      this.qrCodeUrl = await QRCode.toDataURL(this.storeUrl);
    } catch (error) {
      console.error('Error generating QR code', error);
    }
  }

  // downloadQRCode() {
  //   if (this.qrCodeUrl) {
  //     const link = document.createElement('a');
  //     link.href = this.qrCodeUrl;
  //     link.download = 'qrcode.png';
  //     link.click();
  //   }
  // }

  // downloadQRCode() {
  //   const container = document.getElementById('qrContainer');

  //   if (container) {
  //     html2canvas(container).then((canvas) => {
  //       const link = document.createElement('a');
  //       link.href = canvas.toDataURL('image/png');
  //       link.download = `${this.vendor?.storeName} store on Supplya.png`;
  //       link.click();
  //     });
  //   }
  // }
  downloadQRCode() {
    const container = document.getElementById('qrContainer');

    if (container) {
      // Temporarily remove the hidden class
      container.classList.remove('hidden');

      html2canvas(container)
        .then((canvas) => {
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png');
          link.download = `${this.vendor?.storeName} store on Supplya.png`;
          link.click();

          // Add the hidden class back
          container.classList.add('hidden');
        })
        .catch(() => {
          // Add the hidden class back if an error occurs
          container.classList.add('hidden');
        });
    }
  }

  downloadQRCode34() {
    const container = document.getElementById('qrContainer');

    if (container) {
      // Remove d-none and add show class
      container.classList.remove('d-none');
      container.classList.add('show');
      // Capture the element and download the image
      html2canvas(container).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `${this.vendor?.storeName} store on Supplya.png`;
        link.click();

        // Revert to d-none after download
        container.classList.remove('show');
        container.classList.add('d-none');
      });
    }
  }
  qrCodeVisible: boolean = false;

  showQRCode() {
    this.qrCodeVisible = true;
  }
  getStoreProducts(): void {
    this.loading = true;
    this.productService.getStoreProducts(this.storeName).subscribe(
      (response: any) => {
        this.products = response.data['products'];
        this.vendor = response.data['vendorDetails'];
        this.storeUrl = `https://supplya.shop/#/store/${this.vendor?.storeName}`;
        // this.totalProducts = response.totalProducts;
        this.generateQRCode();
        this.loading = false;
      },
      (error) => {
        this.error = true;
        this.loading = false;
      }
    );
  }
  totalProducts: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 100;

  p: number = 1;
  pageSize: number = 20;
  totalCount: number = 0;
  getProducts() {
    this.loading = true;
    this.productService.getAllProducts(1, 100).subscribe(
      (data: any) => {
        this.products = data?.data;
        this.totalProducts = data.totalProducts;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.error = true;
      }
    );
  }

  toggleWishlist(product: any) {
    product.isWishlisted = !product.isWishlisted;
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
  }
  carouselIndex: number = 0;
  carouselInterval: any;
  test ={
  banners: [
    {
      "_id": "67ffaf59e8b5bec6882fa866",
      "platform": "web",
      "section": "StoreBanner",
      "image": "https://res.cloudinary.com/piusash/image/upload/v1744809813/supplya-images/dszfe6ovpmzwtmxphpae.jpg",
      "description": "StoreBanner",
      "vendor": "6664a5b92dd055006ba503de",
      "redirectUrl": null,
      "__v": 0,
      "createdAt": "2025-04-16T13:23:37.120Z",
      "updatedAt": "2025-04-16T13:23:37.120Z"
    },
    {
      "_id": "67ffb352e8b5bec6882fa934",
      "platform": "web",
      "section": "StoreBanner",
      "image": "https://res.cloudinary.com/piusash/image/upload/v1744809813/supplya-images/dszfe6ovpmzwtmxphpae.jpg",
      "description": "StoreBanner",
      "vendor": "6664a5b92dd055006ba503de",
      "redirectUrl": null,
      "__v": 0,
      "createdAt": "2025-04-16T13:40:34.182Z",
      "updatedAt": "2025-04-16T13:40:34.182Z"
    },
    {
      "_id": "67ffb352e8b5bec6882fa935",
      "platform": "web",
      "section": "StoreBanner",
      "image": "https://res.cloudinary.com/piusash/image/upload/v1744810829/supplya-images/jniw44njs3nomjjx08ui.png",
      "description": "StoreBanner",
      "vendor": "6664a5b92dd055006ba503de",
      "redirectUrl": null,
      "__v": 0,
      "createdAt": "2025-04-16T13:40:34.182Z",
      "updatedAt": "2025-04-16T13:40:34.182Z"
    }
  ]
}
  startCarousel() {
    this.carouselInterval = setInterval(() => {
      this.carouselIndex = (this.carouselIndex + 1) % this.test.banners.length;
    }, 3000); // Change image every 3 seconds
  }
  ngOnDestroy() {
    // Clear the interval when the component is destroyed
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  viewProduct(product: any) {
    this.route.navigate(['core/operation/product-details/', `${product}`]);
    window.scrollTo(0, 0);
  }

  toCart() {
    this.route.navigate(['core/operation/shopping-cart']);
    window.scrollTo(0, 0);
  }

  getStarsArray(rating: number): number[] {
    return Array(Math?.floor(rating))?.fill(0);
  }

  getEmptyStarsArray(rating: number): number[] {
    return Array(5 - Math?.floor(rating))?.fill(0);
  }

  downloadQR() {
    const qrCodeElement = document.querySelector('#qrCodeContainer img');
    if (qrCodeElement) {
      const qrUrl = (qrCodeElement as HTMLImageElement).src;
      const link = document.createElement('a');
      link.href = qrUrl;
      link.download = `${this.storeName}_store_qr.png`;
      link.click();
    }
  }
}
