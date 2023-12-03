// menuItems.ts
export const menuItems = {
  admin: [
    {
      name: "Dashboard",
      route: "/core/admin/dashboard",
      hasChild: false,
      icon: "house",
    },
    {
      name: "Analytics",
      route: "/core/admin/order",
      hasChild: false,
      icon: "file-earmark-text",
    },
    {
      name: "Orders",
      route: "/core/admin/orders",
      hasChild: false,
      icon: "file-earmark-text",
    },

    
    {
      name: "Products",
      route: "/core/admin/",
      hasChild: true,
      icon: "box",
      childMenu: [
        {
          name: "All Products",
          route: "/core/admin/products",
          icon: "list-ul",
        },
        {
          name: "Add Product",
          route: "/core/admin/add-new-product",
          icon: "plus-circle",
        },
      ],
    },
    {
      name: "Category",
      route: "/category",
      hasChild: true,
      icon: "box",
      childMenu: [
        {
          name: "All Categories",
          route: "/core/admin/categories",
          icon: "list-ul",
        },
        {
          name: "Add Category",
          route: "/core/admin/add-new-category",
          icon: "plus-circle",
        },
      ],
    },
   
    {
      name: "Role Permissions",
      route: "/core/admin/produ",
      hasChild: true,
      icon: "box",
      childMenu: [
        {
          name: "Permissions",
          route: "/core/admin/role-permissions",
          icon: "list-ul",
        },
        {
          name: "Add New Role",
          route: "/core/admin/add-new-role",
          icon: "plus-circle",
        },
      ],
    },
  
    {
      name: "User Management",
      route: "/user-management",
      hasChild: true,
      icon: "people",
      childMenu: [
        {
          name: "All Users",
          route: "/user-management/all",
          icon: "people-fill",
        },
        {
          name: "Add New User",
          route: "/products/add",
          icon: "plus-circle",
        },
      
      ],
    },
   
    {
      name: "Setting",
      route: "/setting",
      hasChild: false,
      icon: "gear-fill",
    },
  ],
  customer: [
    {
      name: "Dashboard",
      route: "/core/customer/dashboard",
      hasChild: false,
      icon: "house",
    },
    {
      name: "Profile",
      route: "/profile",
      hasChild: false,
      icon: "person-circle",
    },
    {
      name: "Orders",
      route: "/orders",
      hasChild: false,
      icon: "file-earmark-text",
    },
    {
      name: "Products",
      route: "/products",
      hasChild: true,
      icon: "box",
      childMenu: [
        {
          name: "All Products",
          route: "/products/all",
          icon: "list-ul",
        },
        {
          name: "Add Product",
          route: "/products/add",
          icon: "plus-circle",
        },
      ],
    },
    {
      name: "Category",
      route: "/category",
      hasChild: true,
      icon: "box",
      childMenu: [
        {
          name: "All Categories",
          route: "/category/all",
          icon: "list-ul",
        },
        {
          name: "Add Category",
          route: "/category/add",
          icon: "plus-circle",
        },
      ],
    },
    {
      name: "Settings",
      route: "/settings",
      hasChild: false,
      icon: "gear-fill",
    },
    {
      name: "Logout",
      route: "/logout",
      hasChild: false,
      icon: "box-arrow-right",
    },
    {
      name: "Report",
      route: "/report",
      hasChild: false,
      icon: "file-text",
    },
    {
      name: "Analytics",
      route: "/analytics",
      hasChild: false,
      icon: "bar-chart-line",
    },
  ],
  seller: [
    {
      name: "Dashboard",
      route: "/core/seller/dashboard",
      hasChild: false,
      icon: "house",
    },
    {
      name: "Orders",
      route: "/orders",
      hasChild: false,
      icon: "file-earmark-text",
    },
    {
      name: "Products",
      route: "/products",
      hasChild: true,
      icon: "box",
      childMenu: [
        {
          name: "All Products",
          route: "/products/all",
          icon: "list-ul",
        },
        {
          name: "Add Product",
          route: "/products/add",
          icon: "plus-circle",
        },
      ],
    },
    {
      name: "Category",
      route: "/category",
      hasChild: true,
      icon: "box",
      childMenu: [
        {
          name: "All Categories",
          route: "/category/all",
          icon: "list-ul",
        },
        {
          name: "Add Category",
          route: "/category/add",
          icon: "plus-circle",
        },
      ],
    },
    {
      name: "Settings",
      route: "/settings",
      hasChild: false,
      icon: "gear-fill",
    },
    {
      name: "Logout",
      route: "/logout",
      hasChild: false,
      icon: "box-arrow-right",
    },
    {
      name: "Report",
      route: "/report",
      hasChild: false,
      icon: "file-text",
    },
    {
      name: "Analytics",
      route: "/analytics",
      hasChild: false,
      icon: "bar-chart-line",
    },
  ],
  vendor: [
    {
      name: "Dashboard",
      route: "/core/vendor/dashboard",
      hasChild: false,
      icon: "house",
    },
    {
      name: "Profile",
      route: "/profile",
      hasChild: false,
      icon: "person-circle",
    },
    {
      name: "Products",
      route: "/products",
      hasChild: true,
      icon: "box",
      childMenu: [
        {
          name: "All Products",
          route: "/products/all",
          icon: "list-ul",
        },
        {
          name: "Add Product",
          route: "/products/add",
          icon: "plus-circle",
        },
      ],
    },
    {
      name: "Orders",
      route: "/orders",
      hasChild: false,
      icon: "file-earmark-text",
    },
    {
      name: "Settings",
      route: "/settings",
      hasChild: false,
      icon: "gear-fill",
    },
    {
      name: "Logout",
      route: "/logout",
      hasChild: false,
      icon: "box-arrow-right",
    },
    {
      name: "Report",
      route: "/report",
      hasChild: false,
      icon: "file-text",
    },
    {
      name: "Analytics",
      route: "/analytics",
      hasChild: false,
      icon: "bar-chart-line",
    },
  ],
};
