import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/shared/services/menu.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menuItems: any[] = [];
  userRole: string = 'admin'; 
constructor(private menuService: MenuService, private router: Router){}

  ngOnInit(): void {
    this.loadMenuItems();
  }

  
  loadMenuItems(): void {
    this.menuService.getMenuItems().subscribe(
      (menus) => {
        this.menuItems = menus[this.userRole] || [];
      },
      (error) => {
        console.error('Error loading menu items', error);
      }
    );
  }

 toggleSubMenu1(menuItem: any): void {
  menuItem.showSubMenu = !menuItem.showSubMenu;
}
openMenu: string = '';
toggleSubMenu(menuItem: any): void {
  if (this.openMenu === menuItem.name) {
    // If clicking on the already open menu, close it
    this.openMenu = '';
  } else {
    // Close the previous menu and open the clicked menu
    this.openMenu = menuItem.name;
  }
}

isMenuOpen(menu: string): boolean {
  return this.openMenu === menu;
}

}
