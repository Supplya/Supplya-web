import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastyService } from 'ng-toasty';
import { AuthService } from 'src/app/authentication/service/auth.service';
import { ProductService } from 'src/app/core/operation/services/product/product.service';
import { HelperService } from 'src/app/shared/helpers/helper.service';
import { MediaUploadService } from 'src/app/shared/services/mediaUpload.service';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit {
  categories: any;
  constructor(
    public productService: ProductService,
    private fb: FormBuilder,
    private helperService: HelperService,
    private authService: AuthService,
    private notify: ToastyService,
    private uploadService: MediaUploadService,
    private route: Router,
    private router: ActivatedRoute,
    private adminService: DashboardService
  ) {}

  form!: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  passwordVisible: boolean = false;
  id: any;
  ngOnInit(): void {
    this.router.paramMap.subscribe((params) => {
      this.id = params.get('id');
      this.getProductByID();
    });
    this.getAllCategories();
    this.initForm();
    this.getAllUsers();

    this.form.get('unit_price')?.valueChanges.subscribe(() => this.validateDiscountPrice());
    this.form.get('discounted_price')?.valueChanges.subscribe(() => this.validateDiscountPrice());
  }
  requestLoading: boolean = false;
  errorFetching: boolean = false;
  response: any;
  getProductByID() {
    this.requestLoading = true;
    this.productService.getProductId(this.id).subscribe(
      (details: any) => {
        if (details.status) {
          this.response = details?.data;
          this.requestLoading = false;

          // Extract category _id
          const formData = {
            ...details.data,
            category: details.data.category._id, // Use _id for the category form control
          };

          // Patch the transformed formData
          this.form.patchValue(formData);
          // console.log(this.form.value);

          // Set the images
          this.images = details.data.images;
          const mainImageUrl = details.data.image;
          this.mainImageIndex = this.images.indexOf(mainImageUrl);
        }
      },
      (error) => {
        this.requestLoading = false;
        this.errorFetching = true;
      }
    );
  }

  refresh() {
    this.errorFetching = false;
    this.getProductByID();
  }

  isSpecialOffer: boolean = false;
  specialOfferType: string = '';

  toggleSpecialOffer() {
    if (!this.isSpecialOffer) {
      this.specialOfferType = ''; // Reset if toggled off
    }
  }
  handleToggle(event: Event) {
    this.isSpecialOffer = (event.target as HTMLInputElement).checked;
    if (!this.isSpecialOffer) {
      this.specialOfferType = '';
    }
  }

  handleSpecialOfferType(type: string) {
    this.specialOfferType = type;
  }

  vendors: any[] = [];
  transformedVendors: any[] = [];

  getAllUsers() {
    this.adminService.getAllUsers().subscribe(
      (data: any) => {
        if (data.status) {
          this.vendors = data.data.filter(
            (item: any) => item?.role === 'vendor'
          );

          // Transform vendors to only include objects with storeName
          this.transformedVendors = this.vendors.map((vendor) => {
            return {
              id: vendor._id,
              name: vendor.storeName || 'Unnamed Store',
            };
          });
        }
      },
      (error) => {}
    );
  }

  dropdownConfig = {
    displayKey: 'name', // Key to be displayed
    search: true,
    height: '250',
    placeholder: 'Select Store',
    limitTo: this.transformedVendors.length,
    noResultsFound: 'No results found!',
    searchPlaceholder: 'Search',
    searchOnKey: 'name',
    clearOnSelection: false,
    inputDirection: 'ltr',
    multiple: true, // Enable multi-select if needed
    selectAllLabel: 'Select All', // Optional: label for the select all option
  };

  selectedVendors: any[] = [];
  selectedVendor;
  onVendorChange(event: any) {
    this.selectedVendor = event?.value;
  }
  assignProduct() {
    this.toggleModal('assignVendorModal', 'close');
    const payload = {
      productId: this.response?._id,
      vendorId: this.selectedVendor?.id,
    };
    this.adminService.assignProductToVendor(payload).subscribe(
      (data: any) => {
        this.getProductByID();
      },
      (error: any) => {}
    );
  }

  toggleModal = (modalId, action: string, data?: any) => {
    if (action == 'open') {
      document.getElementById(modalId).style.display = 'flex';
    } else {
      document.getElementById(modalId).style.display = 'none';
    }

    this.selectedVendor === null;
  };
  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      unit_price: [, Validators.required],
      discounted_price: [''],
      description: ['', Validators.required],
      quantity: [, Validators.required],
      brand: [''],
      specialOffer: [false],
      category: ['', Validators.required],
      rating: [''],
      vendorId: [''],
      numReviews: [],
      isFeatured: [false],
      isTrending: [false],
      hasDiscount: [false],
      flashsale: [false],
      isDealOfTheDay: [false],
      saleCount: [],
      status: ['', Validators.required],
      sku: ['', Validators.required],
      moq: [, Validators.required],
      image: [''],
    });
  }
  getAllCategories() {
    this.productService.getAllCategories(1, 50).subscribe(
      (data: any) => {
        if (data.status) {
          this.categories = data['data'];
        } else {
          this.notify.danger(data?.msg);
        }
      },
      (error) => {
        this.notify.danger(error.error?.msg);
      }
    );
  }

  onCheckboxChange(selected: string) {
    Object.keys(this.form.controls).forEach(key => {
      if (key !== selected && (key === 'isTrending' || key === 'flashsale' || key === 'isDealOfTheDay')) {
        this.form.get(key)?.setValue(false);
      }
    });
  }

  uploadImages(file: File) {
    this.uploadProgress = 0;
    this.uploadRequestLoading = true;

    this.uploadService.uploadImages(file).subscribe(
      (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response) {
          this.uploadProgress = 0;
          this.uploadRequestLoading = false;
          const uploadedImageUrl = event.body.secure_url;
          this.images.push(uploadedImageUrl);
          // if (this.images.length === 1) {
          //   this.mainImageIndex = 0;
          // }
        }
      },
      (err) => {
        this.errorUploading = true;
        this.uploadRequestLoading = false;
        console.error('Upload error', err);
      }
    );
  }
  images: string[] = [];
  mainImageIndex: number = 0;

  addImages(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          // this.images.push(e.target.result);
          this.uploadImages(e.target.result);
          // if (this.images.length === 1) {
          //   this.mainImageIndex = 0;
          // }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  errorUploading: boolean = false;
  uploadProgress: number = 0;
  uploadRequestLoading: boolean = false;

  removeImage(index: number) {
    this.images.splice(index, 1);
    // If the removed image was the main image, reset mainImageIndex
    if (index === this.mainImageIndex) {
      this.mainImageIndex = 0;
    }
  }

  setMainImage(index: number) {
    this.mainImageIndex = index;
    const mainImageUrl = this.images[index];
    this.form.patchValue({
      image: mainImageUrl,
    });
    console.log(this.form.value.image);
  }

  onDragOver(event: any) {
    event.preventDefault();
  }

  onDragEnter(event: any) {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
  }

  onDragLeave(event: any) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
  }
  onDrop(event: any) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
    const files = event.dataTransfer.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          // Upload the file
          this.uploadImages(files[i]);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }
  onDropss(event: any) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
    const files = event.dataTransfer.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.images.push(e.target.result);
          // If it's the first image, set it as the main image
          this.uploadImages(e.target.result);
          // if (this.images.length === 1) {
          //   this.mainImageIndex = 0;
          // }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  uploadImage(file: any) {
    this.uploadService.uploadImages(file).subscribe(
      (data) => {
        console.log(data);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  numberOnly(event: any): void {
    this.helperService.numberOnly(event);
  }

  submit() {
    this.submitted = true;
    const formData = this.form.value;
    // formData.image = this.images[0];
  
    if (this.form.value.status === 'outOfStock') {
      this.form.value.quantity = 0
    }
    formData.images = this.images;
    if (this.form.valid) {
      this.productService.UpdateProduct(this.id, formData).subscribe((data) => {
        if (data.status) {
          this.notify.success(data.message);
          this.route.navigate(['/core/admin/products']);
        }
      });
    }
  }
  // getDiscountPriceError() {
  //   const control = this.form.get('discounted_price');
  //   if (control?.hasError('required')) {
  //     return 'This field is required';
  //   } else if (control?.hasError('invalidDiscount')) {
  //     return 'Discounted price cannot be greater than unit price';
  //   }
  //   return '';
  // }

  // validateDiscountPrice() {
  //   const unitPrice = this.form.get('unit_price')?.value;
  //   const discountedPrice = this.form.get('discounted_price')?.value;

  //   if (discountedPrice > unitPrice) {
  //     this.form.get('discounted_price')?.setErrors({ invalidDiscount: true });
  //   } else {
  //     this.form.get('discounted_price')?.setErrors(null);
  //   }
  // }
  getDiscountPriceError() {
    const control = this.form.get('discounted_price');
    if (control?.hasError('required')) {
      return 'This field is required';
    } else if (control?.hasError('invalidDiscount')) {
      return 'Discounted price must be less than unit price';
    }
    return '';
  }

  validateDiscountPrice() {
    const unitPrice = this.form.get('unit_price')?.value;
    const discountedPrice = this.form.get('discounted_price')?.value;

    if (discountedPrice >= unitPrice) {  // Ensure discounted price is strictly less than unit price
      this.form.get('discounted_price')?.setErrors({ invalidDiscount: true });
    } else {
      this.form.get('discounted_price')?.setErrors(null);
    }
  }

  getErrorMessage(control: string, message: string) {
    return this.helperService.getError(this.form.get(control), message);
  }
  isInvalid(control: string) {
    return (
      (this.form.get(control)?.touched && this.form.get(control)?.invalid) ||
      (this.submitted && this.form.get(control)?.invalid)
    );
  }
  resetForm() {
    this.form.reset();
    this.submitted = false;
  }
}