import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/core/operation/services/product/product.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})


export class ProductsComponent implements OnInit {
  constructor(private productService: ProductService) {}
  tableButtons = [
    { label: 'Edit', action: 'edit' },
    { label: 'Delete', action: 'delete' }
];
  tableRows: any[] = [];
  filteredRows: any[] = [];
  response: any;
  tableHeaders: string[] = [];
  loading: boolean = false;
  title: string = 'All Products';

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.loading = true;
    this.productService.getAllProducts().subscribe(
      (data: any) => {
       this.response = data?.products;
       this.loading = false;
       this.tableHeaders = [
        'Name',
        'Description',
        'Price',
        'In Stock',
        'Rating',
        'Number of Reviews',
        'Brand',
        'Date Created'
        // Add more headers as needed
      ];
        this.tableRows = data?.products.map((product: any) => {
          return {
            name: product.name,
            description: product.description,
            price: product.price,
            inStock: product.inStock ? 'Yes' : 'No',
            rating: product.rating,
            numReviews: product.numReviews,
            brand: product.brand,
            dateCreated: product.dateCreated
            // Add more properties as needed
          };
        });
  
        console.log('Table Rows:', this.tableRows);
        console.log(data, 'products');
      },
      (error) => {
        // Handle the error appropriately
        this.loading = false;
        console.error('Error fetching products:', error);
      }
    );
  }
  


  onEditClick(row: any): void {
    // Handle edit logic here
  }
  
  onDeleteClick(row: any): void {
    // Handle delete logic here
  }
  
  onCustomButton1Click(row: any): void {
    // Handle custom button 1 logic here
  }
  
  onCustomButton2Click(row: any): void {
    // Handle custom button 2 logic here
  }
  
}