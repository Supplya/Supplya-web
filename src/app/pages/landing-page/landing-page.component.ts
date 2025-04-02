import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/core/operation/services/product/product.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
  productCount: number = 0;
  vendorCount: number = 0;
  retailerCount: number = 0;
  manufacturerCount: number = 0;
  constructor(private route: Router, private productService: ProductService) {
  
}
  ngOnInit(): void {
    this.animateCount('productCount', 25);
    this.animateCount('vendorCount', 120);
    this.animateCount('retailerCount', 500);
    this.animateCount('manufacturerCount', 8);
    this.getAllMedia();
  }
  partnerLogos = [
    '/assets/partner-logos/54co.png',
    '/assets/partner-logos/Adanian.png',
    '/assets/partner-logos/Aidi.png',
    '/assets/partner-logos/Bel Impex.png',
    '/assets/partner-logos/Black-Pepper-Stamp-1.png',
    '/assets/partner-logos/Coca Cola.png',
    '/assets/partner-logos/Dengun.png',
    '/assets/partner-logos/FMN.png',
    '/assets/partner-logos/IFC.png',
    '/assets/partner-logos/ITC.png',
    '/assets/partner-logos/Jumia-Logo.png',
    '/assets/partner-logos/Lagos Innovates.png',
    '/assets/partner-logos/LSETF.png',
    '/assets/partner-logos/Microsoft.png',
    '/assets/partner-logos/MovingWorlds.png',
    '/assets/partner-logos/MTN.png',
    '/assets/partner-logos/Nvidia.png',
    '/assets/partner-logos/Pearl-logo-09-3.png',
    '/assets/partner-logos/superbrandz_global_distribution_limited_cover.png',
    '/assets/partner-logos/Sustain Chain.png',
    '/assets/partner-logos/Termii.png',
    '/assets/partner-logos/TGI Group.png',
    '/assets/partner-logos/Vault icon 614x614.png',
  ];

  signUp() {
    this.route.navigate(['/auth/sign-up']);
    window.scrollTo(0, 0);
  }
  login() {
    this.route.navigate(['/auth']);
    window.scrollTo(0, 0);
  }
  errorFetchingMedia
  banners
  loading
  getAllMedia() {
    this.loading = true;
    this.productService.getAllMedia(1, 50).subscribe(
      (data: any) => {
        this.banners = data?.data;
        this.loading = false;
      },
      (error) => {
        this.errorFetchingMedia = true;
        this.loading = false;
      }
    );
  }
  getBanner(tag: string) {
    return this.banners?.find(banner => banner?.tag?.toLowerCase() === tag?.toLowerCase());
  }


  shop() {
    this.route.navigate(['/shop']);
    window.scrollTo(0, 0);
  }
  about() {
    this.route.navigate(['/about-us']);
    window.scrollTo(0, 0);
  }
  blog() {
    this.route.navigate(['/blog-posts']);
    window.scrollTo(0, 0);
  }
  contact() {
    this.route.navigate(['/contact-us']);
    window.scrollTo(0, 0);
  }
  animateCount(property: string, target: number): void {
    const interval = 50; // Update every 50ms
    const increment = Math.ceil(target / 50); // Number of steps for animation

    let currentValue = 0;
    const intervalId = setInterval(() => {
      currentValue += increment;
      if (currentValue >= target) {
        currentValue = target;
        clearInterval(intervalId);
      }
      (this as any)[property] = currentValue;
    }, interval);
  }
}
