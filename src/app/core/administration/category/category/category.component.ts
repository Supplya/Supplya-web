import { Component, OnInit } from '@angular/core';
import { ToastyService } from 'ng-toasty';
import { ProductService } from 'src/app/core/operation/services/product/product.service';
import { applyGlobalSearch } from 'src/app/shared/helpers/global-table-search';
import { ExportService } from '../../services/export.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from 'src/app/shared/helpers/helper.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  categories: any;
  filteredRows: any;
  title = 'All Categories';
  searchText: string = '';
  itemPerPage: number = 8;
  p: number = 1;
  form!: FormGroup;
  submitted: boolean = false;
  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private helper: HelperService,
    private notify: ToastyService,
    private exportService: ExportService
  ) {}
  ngOnInit(): void {
    this.getAllCategories();
    this.initForm();
  }

  getAllCategories() {
    this.productService.getAllCategories().subscribe(
      (data: any) => {
        if (data.status) {
          this.categories = data?.categories;
          this.filteredRows = data?.categories;
          console.log(data, 'products');
        } else {
          this.notify.danger(data?.msg);
        }
      },
      (error) => {
        console.error('Error fetching categories:', error);
        // Handle the error appropriately, for example, show a user-friendly error message.
      }
    );
  }

  applyFilter() {
    this.filteredRows = applyGlobalSearch(this.categories, this.searchText, [
      'name',
      'description',
      'createdAt',
    ]);
    this.p = 1;
  }

  exportToExcel() {
    this.exportService.exportToExcel(this.filteredRows, this.title);
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      createdAt: [''],
    });
  }

  getErrorMessage(control: string, message: string) {
    return this.helper.getError(this.form.get(control), message);
  }
  isInvalid(control: string) {
    return (
      (this.form.get(control)?.touched && this.form.get(control)?.invalid) ||
      (this.submitted && this.form.get(control)?.invalid)
    );
  }
}
