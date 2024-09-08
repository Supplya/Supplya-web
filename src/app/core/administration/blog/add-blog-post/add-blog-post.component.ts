import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastyService } from 'ng-toasty';
import { AuthService } from 'src/app/authentication/service/auth.service';
import { ProductService } from 'src/app/core/operation/services/product/product.service';
import { HelperService } from 'src/app/shared/helpers/helper.service';
import { MediaUploadService } from 'src/app/shared/services/mediaUpload.service';
import { DashboardService } from '../../services/dashboard.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-add-blog-post',
  templateUrl: './add-blog-post.component.html',
  styleUrls: ['./add-blog-post.component.scss'],
})
export class AddBlogPostComponent implements OnInit {
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
  newTag: string = '';
  addTagMode: boolean = false;
  userDetails;
  categories = [
   "General",
  "News & Features",
  "Industry News",
  "Deals & Promotions",
  "Customer Stories",
  "Events",
  "Product",
  "Others"
  ];

  ngOnInit(): void {
    this.userDetails = this.authService.getUserCredentials();
    this.initForm();
    this.getAllUsers();
    this.setInitialTags(['2024', 'new', 'post', 'this day']);
  }

  initForm() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      content: [, Validators.required],
      author: [''],
      specialOffer: [false],
      category: [''],
      tags: this.fb.array([]),
      tag: [''],
      status: ['publish', Validators.required],
      images: [''],
    });
  }
  get tags(): string[] {
    return this.form.get('tags').value || [];
  }

  addTag() {
    const trimmedTag = this.form.get('tag').value.trim();
    if (trimmedTag && !this.tags.includes(trimmedTag)) {
      const tagsArray = this.form.get('tags') as FormArray;
      tagsArray.push(new FormControl(trimmedTag));
      this.form.patchValue({
        tag: '',
      });
      this.newTag = '';
      this.addTagMode = false;
    }
  }

  removeTag(tag: string) {
    const tagsArray = this.form.get('tags') as FormArray;
    const index = tagsArray.controls.findIndex((c) => c.value === tag);
    if (index > -1) {
      tagsArray.removeAt(index);
    }
  }

  private setInitialTags(initialTags: string[]) {
    const tagsArray = this.form.get('tags') as FormArray;
    initialTags.forEach((tag) => tagsArray.push(new FormControl(tag)));
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

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '200px',
    maxHeight: 'auto',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [['bold']],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };
  setMainImage(index: number) {
    if (index !== 0 && this.images && this.images.length > 1) {
      // Remove the selected image from its current position
      const selectedImage = this.images.splice(index, 1)[0];
      // Insert the selected image at the beginning of the array
      this.images.unshift(selectedImage);
    }
    // Update the main image index to 0 since the selected image is now the first in the array
    this.mainImageIndex = 0;
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
  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
  numberOnly(event: any): void {
    this.helperService.numberOnly(event);
  }
  submit() {
    this.form.patchValue({
      author: this.userDetails?._id,
    });
    this.submitted = true;
    const formData = {
      images: this.images,
      content: this.form.value.content,
      title: this.form.value.title,
      tags: this.form.value.tags,
      author: this.form.value.author,
      category: this.form.value.category,
    };
    if (this.form.valid && this.images.length > 0) {
      this.productService.addBlogPost(formData).subscribe((data) => {
        if (data.status) {
          this.notify.success(data.message);
          this.route.navigate(['/core/admin/blog-posts']);
        }
      });
    }
  }
  selectedVendor: any = null;
  onVendorChange(event: any) {
    this.selectedVendor = event?.value;
  }
  assign() {
    this.form.value.vendorId = this.selectedVendor?.id;
    this.toggleModal('assignVendorModal', 'close');
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