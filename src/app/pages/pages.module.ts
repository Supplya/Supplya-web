import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { FaqComponent } from './faq/faq.component';
import { SharedModule } from '../shared/shared.module';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { RefundPolicyComponent } from './refund-policy/refund-policy.component';
import { BlogComponent } from './blog/blog.component';
import { SingleBlogPostComponent } from './blog/single-blog-post/single-blog-post.component';
import { OtherProductTypesComponent } from './other-product-types/other-product-types.component';
import { LandingPageComponent } from './landing-page/landing-page.component';


@NgModule({
  declarations: [
    HomeComponent,
    AboutComponent,
    ContactComponent,
    FaqComponent,
    PrivacyPolicyComponent,
    RefundPolicyComponent,
    BlogComponent,
    SingleBlogPostComponent,
    OtherProductTypesComponent,
    LandingPageComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule
  ]
})
export class PagesModule { }
