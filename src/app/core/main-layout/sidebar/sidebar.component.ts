import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/service/auth.service';
import { MenuService } from 'src/app/shared/services/menu.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menuItems: any[] = [];
  showButtonMenu: boolean = false;
  constructor(private menuService: MenuService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.getUserCredentials();
  }





  openMenu: string = '';
  toggleSubMenu(menuItem: any): void {
    if (this.openMenu === menuItem?.name) {
      // If clicking on the already open menu, close it
      this.openMenu = '';
    } else {
      // Close the previous menu and open the clicked menu
      this.openMenu = menuItem?.name;
    }
  }

  isMenuOpen(menu: string): boolean {
    return this.openMenu === menu;
  }

  closeMenuMobile() {
    document.getElementById('navbar-toggler')?.click();
  }
  user: any;
  userDetails: any;
  getUserCredentials() {
    this.user = this.authService.getUserCredentials();
    this.userDetails = this.user;
    console.log(this.userDetails, 'userDetails');
    this.loadMenuItems();
  }
  loadMenuItems(): void {
    this.menuService.getMenuItems().subscribe(
      (menus) => {
        // this.menuItems = menus['vendor'] || [];
        this.menuItems = menus[this.userDetails?.role] || [];
      },
      (error) => {
        console.error('Error loading menu items', error);
      }
    );
  }

  logout(){
    Swal.fire({
      title: "Log out",
      text: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      showClass: {
        popup: `
          animate__animated
          animate__fadeInDown
          animate__faster
        `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `
      }
    }).then((result) => {
      if (result.isConfirmed) {
       this.authService.logout();
      }
    });

  }
}
