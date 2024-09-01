export const menuItems = {
  admin: [
    {
      name: 'Dashboard',
      route: '/core/admin/dashboard',
      hasChild: false,
      icon: 'house',
    },
    // {
    //   name: 'Analytics',
    //   route: '/core/admin/analytics',
    //   hasChild: false,
    //   icon: 'file-earmark-text',
    // },
    // {
    //   name: 'Wallet',
    //   route: '/core/admin/wallet',
    //   hasChild: false,
    //   icon: 'wallet',
    // },
    {
      name: 'Orders',
      route: '/core/admin/orders',
      hasChild: false,
      icon: 'file-earmark-text',
    },

    {
      name: 'Products',
      route: '/core/admin/products',
      hasChild: false,
      icon: 'list-ul',
      childMenu: [
        {
          name: 'All Products',
          route: '/core/admin/products',
          icon: 'list-ul',
        },
        // {
        //   name: 'Add Product',
        //   route: '/core/admin/add-new-product',
        //   icon: 'plus-circle',
        // },
      ],
    },
    {
      name: 'Categories',
      route: '/core/admin/categories',
      hasChild: false,
      icon: 'box',
      childMenu: [
        {
          name: 'All Categories',
          route: '/core/admin/categories',
          icon: 'list-ul',
        },
        // {
        //   name: 'Add Category',
        //   route: '/core/admin/add-new-category',
        //   icon: 'plus-circle',
        // },
      ],
    },
    {
      name: 'Blog Posts',
      route: '/core/admin/blog-posts',
      hasChild: false,
      icon: 'journal-text',
    },

    // {
    //   name: 'Role Permissions',
    //   route: '/core/admin/',
    //   hasChild: true,
    //   icon: 'box',
    //   childMenu: [
    //     {
    //       name: 'Permissions',
    //       route: '/core/admin/role-permissions',
    //       icon: 'list-ul',
    //     },
    //     {
    //       name: 'Add New Role',
    //       route: '/core/admin/add-new-role',
    //       icon: 'plus-circle',
    //     },
    //   ],
    // },

    {
      name: 'Users',
      route: '/user-management',
      hasChild: true,
      icon: 'people',
      childMenu: [
        {
          name: 'Customers',
          route: '/core/admin/customers',
          icon: 'people-fill',
        },
        {
          name: 'Vendors',
          route: '/core/admin/vendors',
          icon: 'people-fill',
        },
        {
          name: 'Administrators',
          route: '/core/admin/administrators',
          icon: 'people-fill',
        },
      ],
    },

    {
      name: 'Settings',
      route: '/core/admin/profile-settings',
      hasChild: false,
      icon: 'gear-fill',
    },
  ],
  customer: [
    {
      name: 'Dashboard',
      route: '/core/customer/dashboard',
      hasChild: false,
      icon: 'house',
    },
    // {
    //   name: "Profile",
    //   route: "/profile",
    //   hasChild: false,
    //   icon: "person-circle",
    // },
    {
      name: 'Track Order',
      route: '/core/customer/track-order',
      hasChild: false,
      icon: 'wallet',
    },
    {
      name: 'Orders',
      route: '/core/customer/orders',
      hasChild: false,
      icon: 'file-earmark-text',
    },

    // {
    //   name: 'Preference',
    //   route: '/core/customer/settings',
    //   hasChild: false,
    //   icon: 'gear-fill',
    // },
    {
      name: 'Settings',
      route: '/core/customer/profile-settings',
      hasChild: false,
      icon: 'gear-fill',
    },
  ],
  vendor: [
    {
      name: 'Dashboard',
      route: '/core/vendor/dashboard',
      hasChild: false,
      icon: 'house',
    },
    {
      name: 'Products',
      route: '/core/vendor/products',
      hasChild: false,
      icon: 'box',
    },
    {
      name: 'Orders',
      route: '/core/vendor/orders',
      hasChild: false,
      icon: 'truck',
    },
    {
      name: 'Withdrawal',
      route: '/core/vendor/withdrawal',
      hasChild: false,
      icon: 'arrow-left-right',
    },

    // {
    //   name: "Wallet",
    //   route: "/core/vendor/wallet",
    //   hasChild: false,
    //   icon: "wallet",
    // },

    // {
    //   name: "Report",
    //   route: "/core/vendor/report",
    //   hasChild: false,
    //   icon: "file-text",
    // },
    {
      name: 'Settings',
      route: '/core/vendor/shop-settings',
      hasChild: false,
      icon: 'gear-fill',
    },
    // {
    //   name: "Settings",
    //   route: "/core/vendor/shop-settings",
    //   hasChild: true,
    //   icon: "gear-fill",
    //   childMenu: [
    //     {
    //       name: "Store",
    //       route: "/core/vendor/store",
    //       icon: "cart",
    //     },
    //     {
    //       name: "Payment",
    //       route: "/core/vendor/store-payment",
    //       icon: "credit-card",
    //     },
    //   ]
    // },
  ],
};
