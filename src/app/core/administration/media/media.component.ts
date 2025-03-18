import { Component } from '@angular/core';
import { MediaUploadService } from 'src/app/shared/services/mediaUpload.service';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent {
  banners = [
    { id: 'hero', name: 'Hero Banner', imageUrl: '', image: 'https://picsum.photos/800/300?random=1' },
    { id: 'skyscraperLeft', name: 'Skyscraper Left', imageUrl: '', image: 'https://picsum.photos/160/600?random=2' },
    { id: 'skyscraperRight', name: 'Skyscraper Right', imageUrl: '', image: 'https://picsum.photos/160/600?random=3' },
    { id: 'topGif', name: 'Top GIF Banner', imageUrl: '', image: 'https://picsum.photos/728/90?random=4' },
    { id: 'specialDeals', name: 'Special Deals', imageUrl: '', image: 'https://picsum.photos/400/300?random=5' },
    { id: 'popular', name: 'Popular', imageUrl: '', image: 'https://picsum.photos/400/300?random=6' }
  ];

  // Handle Image Upload
  onFileSelected(event: any, banner: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        banner.imageUrl = e.target.result; // Simulating Live URL
      };
      reader.readAsDataURL(file);
    }
  }
}
