import { Component } from '@angular/core';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent {
  postDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  }

  posts: any[] = [
    {
      title: 'Launching a Digital Business in 2024',
      content: 'Lorem ipsum dolet si',
      images: ['/assets/Images/no-post-image.jpg', ''],
      author: 'John Doe',
      categories: ['Business', 'Technology'],
      tags: ['launch', 'e-commerce', '2024'],
      createdAt: new Date('2024-09-01'),
    },
    {
      title: 'Launching a Digital Business in 2024',
      content: 'Lorem ipsum dolet si',
      images: ['/assets/Images/no-post-image.jpg', ''],
      author: 'John Doe',
      categories: ['Business', 'Technology'],
      tags: ['launch', 'e-commerce', '2024'],
      createdAt: new Date('2024-09-01'),
    },
    {
      title: 'Launching a Digital Business in 2024',
      content: 'Lorem ipsum dolet si',
      images: ['/assets/Images/no-post-image.jpg', ''],
      author: 'John Doe',
      categories: ['Business', 'Technology'],
      tags: ['launch', 'e-commerce', '2024'],
      createdAt: new Date('2024-09-01'),
    },
    {
      title: 'Launching a Digital Business in 2024',
      content: 'Lorem ipsum dolet si',
      images: ['/assets/Images/no-post-image.jpg', ''],
      author: 'John Doe',
      categories: ['Business', 'Technology'],
      tags: ['launch', 'e-commerce', '2024'],
      createdAt: new Date('2024-09-01'),
    },
    {
      title: 'Launching a Digital Business in 2024',
      content: 'Lorem ipsum dolet si',
      images: ['/assets/Images/no-post-image.jpg', ''],
      author: 'John Doe',
      categories: ['Business', 'Technology'],
      tags: ['launch', 'e-commerce', '2024'],
      createdAt: new Date('2024-09-01'),
    },
    {
      title: 'Launching a Digital Business in 2024',
      content: 'Lorem ipsum dolet si',
      images: ['/assets/Images/no-post-image.jpg', ''],
      author: 'John Doe',
      categories: ['Business', 'Technology'],
      tags: ['launch', 'e-commerce', '2024'],
      createdAt: new Date('2024-09-01'),
    },
    // Add more posts here
  ];
}
