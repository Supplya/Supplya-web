import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastyService } from 'ng-toasty';
import { AuthService } from 'src/app/authentication/service/auth.service';
import { ProductService } from 'src/app/core/operation/services/product/product.service';
import { HelperService } from 'src/app/shared/helpers/helper.service';
import { MediaUploadService } from 'src/app/shared/services/mediaUpload.service';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-add-media',
  templateUrl: './add-media.component.html',
  styleUrls: ['./add-media.component.scss']
})

export class AddMediaComponent implements OnInit {
  categories: any;
  constructor(
    public productService: ProductService,
    private fb: FormBuilder,
    private helperService: HelperService,
    private authService: AuthService,
    private notify: ToastyService,
    private uploadService: MediaUploadService,
    private route: Router,
    private adminService: DashboardService
  ) {}

  form!: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  passwordVisible: boolean = false;
  mainImage: string = '';
  uploadProgress: number = 0;
  uploadRequestLoading: boolean = false;
  errorUploading: boolean = false;

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      platform: ['', Validators.required],
      description: ['', Validators.required],
      section: ['', Validators.required],
      redirectUrl: [''],
      image: [''],
    });
  }
  bannerOptions = [
    { value: "TopBarBanner", name: "Top Bar Banner" },
    { value: "HeroBanner", name: "Hero Banner" },
    { value: "SpecialBanner", name: "Special Banner" },
    { value: "PopularDealsBanner", name: "Popular Deals Banner" },
    { value: "FlashSalesBanner", name: "Flash Sales Banner" },
    { value: "BillboardBanner", name: "Billboard Banner" },
    { value: "SkyscraperLeftBanner", name: "Skyscraper Left Banner" },
    { value: "SkyscraperRightBanner", name: "Skyscraper Right Banner" },
    { value: "FooterBanner", name: "Footer Banner" },
    { value: "SpecialDealsBanner", name: "Special Deals Banner" },
    { value: "CategoryTopBanner", name: "Category Top Banner" },
    { value: "CategoryBottomBanner", name: "Category Bottom Banner" },
    { value: "HomeMobileTopBanner", name: "Home Mobile Top Banner" },
    { value: "HomeMobileMiddleBanner", name: "Home Mobile Middle Banner" }
  ];

  uploadImage(file: File) {
    this.uploadProgress = 0;
    this.uploadRequestLoading = true;

    this.uploadService.uploadImages(file).subscribe(
      (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response) {
          this.uploadProgress = 0;
          this.uploadRequestLoading = false;
          this.mainImage = event.body.secure_url; // Store uploaded image URL
        }
      },
      (err) => {
        this.errorUploading = true;
        this.uploadRequestLoading = false;
        console.error('Upload error', err);
      }
    );
  }

  addImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadImage(file);
      };
      reader.readAsDataURL(file);
    }
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
    const file = event.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadImage(file);
      };
      reader.readAsDataURL(file);
    }
  }

  submit() {
    this.submitted = true;
    const formData = this.form.value;
    formData.image = this.mainImage;

    const payload = {
      banners: [
        formData
      ]
    }
    if (this.form.valid) {
      this.productService.addMedia(payload).subscribe((data) => {
        if (data.status) {
          this.notify.success(data.message);
          this.route.navigate(['/core/admin/media']);
        }
      });
    }
  }
  selectedVendor;
  toggleModal = (modalId, action: string, data?: any) => {
    if (action == 'open') {
      document.getElementById(modalId).style.display = 'flex';
    } else {
      document.getElementById(modalId).style.display = 'none';
    }

    this.selectedVendor === null;
  };

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