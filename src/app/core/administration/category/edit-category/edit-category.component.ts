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
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss'],
})
export class EditCategoryComponent implements OnInit {
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
  mainImage: string = '';
  uploadProgress: number = 0;
  uploadRequestLoading: boolean = false;
  errorUploading: boolean = false;
  id;
  ngOnInit(): void {
    this.router.paramMap.subscribe((params) => {
      this.id = params.get('id');
      if (this.id) {
  
        this.getCategoryById();
}
    });
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      status: [''],
      image: [''], // Set image as required
      showOnHomepage: [false],
    });
  }

  getCategoryById() {
    this.productService.getCategoryById(this.id).subscribe(
      (data: any) => {
        if (data.status) {
          this.form.patchValue(data.data);
          this.mainImage = data?.data?.image
        } else {
          this.notify.danger(data?.msg);
        }
      },
      (error) => {
      }
    );
  }

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
    if (this.form.valid) {
      this.productService.updateCategory(this.id, formData).subscribe((data) => {
        if (data.status) {
          this.notify.success(data.message);
          this.route.navigate(['/core/admin/categories']);
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
