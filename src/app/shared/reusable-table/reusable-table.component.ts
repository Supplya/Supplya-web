import { Component, Input, OnInit, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import * as XLSX from 'xlsx';
import { applyGlobalSearch } from '../helpers/global-table-search';
import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-reusable-table',
  templateUrl: './reusable-table.component.html',
  styleUrls: ['./reusable-table.component.scss']
})
export class ReusableTableComponent implements OnInit, OnChanges {
  @Input() headers: string[] = [];
  @Input() rows: any;
  @Input() title: string = '';
  @Input() tableId: string = '';
  @Input() showButton: boolean = false;
  @Input() filteredRows: any;
  @Input() buttons: any[] = [];
  
  @Output() rowClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() editClicked = new EventEmitter<any>();
  @Output() deleteClicked = new EventEmitter<any>();
  @Output() customButton1Clicked = new EventEmitter<any>();
  @Output() customButton2Clicked = new EventEmitter<any>();

  searchText: string = "";
  itemsPerPageOptions = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 100, 150];
  itemsPerPage = this.itemsPerPageOptions[0];

  pagination: PaginationInstance = {
    id: 'custom',
    itemsPerPage: this.itemsPerPage,
    currentPage: 1,
  };

  // filteredRows: any;
  showPagination: boolean = false;

  pages: number[] = [];
  result: any[] = [];

  ngOnInit(): void {
    // if (this.rows.length === 0) {
    //   // Initialize with an empty array or provide some default data
    //   this.rows = []; 
    //   this.filteredRows = this.rows;
    // }
    this.updateFilteredRows();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemsPerPage']) {
      this.pagination.itemsPerPage = this.itemsPerPage;
      this.calculatePages();
      this.updateFilteredRows();
    }
  }


  updateFilteredRows(): void {
    this.filteredRows = applyGlobalSearch(
      this.rows,
      this.searchText,
      this.headers
    );

    console.log('this.searchText:', this.searchText);
    console.log(' Rows:', this.rows);
    console.log('Filtered Rows:', this.filteredRows);
    console.log('this.headers:', this.headers);

    // Update pagination when filtered rows change
    this.pagination.currentPage = 1;
    this.calculatePages();
  }
  onButtonClick(button: any, row: any) {
    this.rowClick.emit({ button, row });
  }


onRowClick(event: any) {
    const button = event.button;
    const row = event.row;
    
    // Handle the button click based on the action
    if (button.action === 'edit') {
        // Handle edit action
    } else if (button.action === 'delete') {
        // Handle delete action
    }
}
onEditClick(row: any): void {
  this.editClicked.emit(row);
}

onDeleteClick(row: any): void {
  this.deleteClicked.emit(row);
}

onCustomButtonClick(row: any, buttonNumber: number): void {
  if (buttonNumber === 1) {
    this.customButton1Clicked.emit(row);
  } else if (buttonNumber === 2) {
    this.customButton2Clicked.emit(row);
  }
  // Add more conditions for additional buttons if needed
}

  applyFilter(): void {
    if (this.searchText) {
      const fieldsToSearch = Object.keys(this.rows[0]);

      if (fieldsToSearch && fieldsToSearch.length > 0) {
        this.filteredRows = applyGlobalSearch(
          this.rows,
          this.searchText,
          fieldsToSearch
        );
      } else {
        this.filteredRows = this.rows;
      }

      // Update pagination when applying filter
      this.pagination.currentPage = 1;
      this.calculatePages();
    } else {
      // Reset to the original rows when there is no search text
      this.filteredRows = this.rows;
      this.pagination.currentPage = 1;
      this.calculatePages();
    }
  }

  onPageChange(page: number): void {
    this.pagination.currentPage = page;
    this.calculatePages();
  }

  calculatePages(): void {
    const pageCount = Math.ceil(this.filteredRows.length / this.itemsPerPage);
    this.showPagination = pageCount > 1;

    // Update the pages array for dynamic pagination buttons
    this.pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  calculateStartIndex(): number {
    return (this.pagination.currentPage - 1) * this.itemsPerPage + 1;
  }

  calculateEndIndex(): number {
    return Math.min(this.pagination.currentPage * this.itemsPerPage, this.filteredRows.length);
  }

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredRows);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, `${this.title} List.xlsx`);
  }
}
