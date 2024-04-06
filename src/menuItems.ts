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
      route: "/core/admin/analytics",
      hasChild: false,
      icon: "file-earmark-text",
    },
    {
      name: "Wallet",
      route: "/core/admin/wallet",
      hasChild: false,
      icon: "wallet",
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
      route: "/core/admin/",
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
          route: "/core/admin/users",
          icon: "people-fill",
        },
        {
          name: "Add New User",
          route: "/core/admin/add-new-user",
          icon: "plus-circle",
        },
      
      ],
    },
   
    {
      name: "Setting",
      route: "/core/admin/settings",
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
    // {
    //   name: "Profile",
    //   route: "/profile",
    //   hasChild: false,
    //   icon: "person-circle",
    // },
    {
      name: "Orders",
      route: "/core/customer/orders",
      hasChild: false,
      icon: "file-earmark-text",
    },
   
    {
      name: "Wallet",
      route: "/core/customer/wallet",
      hasChild: false,
      icon: "wallet",
    },
   

    // {
    //   name: "Settings",
    //   route: "/core/customer/settings",
    //   hasChild: false,
    //   icon: "gear-fill",
    // },

  ],
  vendor: [
    {
      name: "Dashboard",
      route: "/core/vendor/dashboard",
      hasChild: false,
      icon: "house",
    },
    {
      name: "Orders",
      route: "/core/vendor/orders",
      hasChild: false,
      icon: "file-earmark-text",
    },
   
    {
      name: "Wallet",
      route: "/core/vendor/wallet",
      hasChild: false,
      icon: "wallet",
    },
    {
      name: "Products",
      route: "/core/vendor/products",
      hasChild: false,
      icon: "box"
    },
    {
      name: "Report",
      route: "/core/vendor/report",
      hasChild: false,
      icon: "file-text",
    },
    {
      name: "Settings",
      route: "/core/vendor/shop-settings",
      hasChild: true,
      icon: "gear-fill",
      childMenu: [
        {
          name: "Store",
          route: "/core/vendor/store",
          icon: "cart",
        },
        {
          name: "Payment",
          route: "/core/vendor/store-payment",
          icon: "credit-card",
        },
      ]
    },
  
  ],
};
