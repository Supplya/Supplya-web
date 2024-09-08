import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { FaqComponent } from './faq/faq.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { RefundPolicyComponent } from './refund-policy/refund-policy.component';
import { BlogComponent } from './blog/blog.component';
import { SingleBlogPostComponent } from './blog/single-blog-post/single-blog-post.component';
import { OtherProductTypesComponent } from './other-product-types/other-product-types.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'about-us', component: AboutComponent},
  {path: 'contact-us', component: ContactComponent},
  {path: 'faq', component: FaqComponent},
  {path: 'privacy-policy', component: PrivacyPolicyComponent},
  {path: 'refund-policy', component: RefundPolicyComponent},
  {path: 'blog-posts', component: BlogComponent},
  {path: 'view-blog-post/:id', component: SingleBlogPostComponent},
  {path: 'view-products/:type', component: OtherProductTypesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
