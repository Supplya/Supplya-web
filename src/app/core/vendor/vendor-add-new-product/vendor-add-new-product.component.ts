import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../operation/services/product/product.service';
import { ToastyService } from 'ng-toasty';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from 'src/app/shared/helpers/helper.service';
import { AuthService } from 'src/app/authentication/service/auth.service';
import { MediaUploadService } from 'src/app/shared/services/mediaUpload.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-vendor-add-new-product',
  templateUrl: './vendor-add-new-product.component.html',
  styleUrls: ['./vendor-add-new-product.component.scss'],
})
export class VendorAddNewProductComponent implements OnInit {
  categories: any;
  constructor(
    public productService: ProductService,
    private fb: FormBuilder,
    private helperService: HelperService,
    private authService: AuthService,
    private notify: ToastyService,
    private uploadService: MediaUploadService, private route: Router
  ) {}

  form!: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  passwordVisible: boolean = false;

  ngOnInit(): void {
    this.getAllCategories();
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      unit_price: [, Validators.required],
      discounted_price: [''],
      description: ['', Validators.required],
      quantity: [, Validators.required],
      brand: [''],
      category: ['', Validators.required],
      rating: [''],
      numReviews: [],
      isFeatured: [false],
      hasDiscount: [false],
      flashsale: [false],
      saleCount: [],
      status: ['', Validators.required],
      sku: ['', Validators.required],
      moq: [, Validators.required],
      image: [''],
    });
  }
  getAllCategories() {
    this.productService.getAllCategories().subscribe(
      (data: any) => {
        if (data.status === 'success') {
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
          if (this.images.length === 1) {
            this.mainImageIndex = 0;
          }
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
          if (this.images.length === 1) {
            this.mainImageIndex = 0;
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  errorUploading: boolean = false;
  uploadProgress: number = 0;
  requestLoading: boolean = false;
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
          if (this.images.length === 1) {
            this.mainImageIndex = 0;
          }
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
    formData.image = this.images[0];
    formData.images = this.images;
    if (this.form.valid) {
      this.productService.vendorAddProduct(formData).subscribe(
        (data) => {
          if (data.status === 'success') {
            this.notify.success(data.message);
            this.route.navigate(['/core/vendor/products']);
          }
        },
      );
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
