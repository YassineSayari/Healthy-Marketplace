import { Component, OnInit } from '@angular/core';

interface ReviewUser {
  name: string;
  avatar: string;
  location?: string;
  verified?: boolean;
  joinDate?: string;
  reviewCount?: number;
}

interface ReviewImage {
  url: string;
  thumbnail: string;
  caption?: string;
}

interface ReviewComment {
  id: number;
  user: ReviewUser;
  text: string;
  date: string;
  likes: number;
}

interface Review {
  id: number;
  user: ReviewUser;
  rating: number;
  title: string;
  content: string;
  date: string;
  product: string;
  productId?: number;
  helpful: number;
  notHelpful?: number;
  images?: ReviewImage[];
  comments?: ReviewComment[];
  verified: boolean;
  response?: {
    from: string;
    message: string;
    date: string;
  };
}

interface RatingBreakdown {
  stars: number;
  percentage: number;
  count: number;
}

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html'
})
export class ReviewsComponent implements OnInit {
  // Rating System
  overallRating: number = 4.8;
  totalReviews: number = 2547;
  
  ratingBreakdown: RatingBreakdown[] = [
    { stars: 5, percentage: 75, count: 1910 },
    { stars: 4, percentage: 15, count: 382 },
    { stars: 3, percentage: 6, count: 153 },
    { stars: 2, percentage: 3, count: 76 },
    { stars: 1, percentage: 1, count: 26 }
  ];

  // Filters
  selectedRating: number = 0;
  selectedSort: string = 'most_recent';
  selectedFilter: string = 'all';
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 10;

  sortOptions = [
    { value: 'most_recent', label: 'Most Recent' },
    { value: 'highest_rating', label: 'Highest Rating' },
    { value: 'lowest_rating', label: 'Lowest Rating' },
    { value: 'most_helpful', label: 'Most Helpful' }
  ];

  filterOptions = [
    { value: 'all', label: 'All Reviews' },
    { value: 'with_photos', label: 'With Photos' },
    { value: 'verified', label: 'Verified Purchases' },
    { value: 'with_comments', label: 'With Comments' }
  ];

  // Review Form
  hoverRating: number = 0;
  selectedRatingForForm: number = 0;
  reviewForm = {
    title: '',
    content: '',
    rating: 0,
    product: '',
    anonymous: false,
    images: [] as File[]
  };

  // Reviews Data
  reviews: Review[] = [
    {
      id: 1,
      user: {
        name: 'Sarah Johnson',
        avatar: 'assets/avatars/sarah.jpg',
        location: 'New York, NY',
        verified: true,
        joinDate: '2021-03-15',
        reviewCount: 23
      },
      rating: 5,
      title: 'Best organic produce I\'ve ever bought!',
      content: 'The quality of the fruits and vegetables is outstanding. Everything arrived fresh and lasted much longer than supermarket produce. The organic apples are incredibly sweet and crispy. I\'ve been a customer for 6 months now and never been disappointed.',
      date: '2 days ago',
      product: 'Organic Fruit Basket',
      productId: 101,
      helpful: 45,
      notHelpful: 2,
      verified: true,
      images: [
        {
          url: 'assets/reviews/fruit-basket-1.jpg',
          thumbnail: 'assets/reviews/fruit-basket-1-thumb.jpg',
          caption: 'Fresh delivery this morning'
        },
        {
          url: 'assets/reviews/fruit-basket-2.jpg',
          thumbnail: 'assets/reviews/fruit-basket-2-thumb.jpg',
          caption: 'The apples are perfect'
        }
      ],
      comments: [
        {
          id: 1001,
          user: {
            name: 'Mike Thompson',
            avatar: 'assets/avatars/mike.jpg',
            verified: true
          },
          text: 'I agree! Their fruit basket is amazing. Have you tried the organic honey?',
          date: '1 day ago',
          likes: 5
        },
        {
          id: 1002,
          user: {
            name: 'Lisa Chen',
            avatar: 'assets/avatars/lisa.jpg'
          },
          text: 'Thanks for the review! I\'ve been hesitant to order, but this helps.',
          date: '12 hours ago',
          likes: 2
        }
      ],
      response: {
        from: 'GreenMarket Team',
        message: 'Thank you so much Sarah! We\'re thrilled to hear you\'re enjoying our produce. We take great care in selecting only the best for our customers.',
        date: '1 day ago'
      }
    },
    {
      id: 2,
      user: {
        name: 'Robert Martinez',
        avatar: 'assets/avatars/robert.jpg',
        location: 'Los Angeles, CA',
        verified: true,
        joinDate: '2022-06-20',
        reviewCount: 12
      },
      rating: 4,
      title: 'Great quality, delivery could be faster',
      content: 'The vegetables are always fresh and organic. Love the variety they offer. My only complaint is that delivery sometimes takes longer than expected. But the customer service is excellent and they always respond quickly to concerns.',
      date: '1 week ago',
      product: 'Weekly Vegetable Box',
      productId: 102,
      helpful: 32,
      notHelpful: 3,
      verified: true,
      comments: [
        {
          id: 1003,
          user: {
            name: 'GreenMarket Support',
            avatar: 'assets/avatars/support.jpg',
            verified: true
          },
          text: 'Hi Robert, we apologize for the delivery delays. We\'re working on improving our logistics. Please DM us your order number for a special discount on your next order.',
          date: '6 days ago',
          likes: 8
        }
      ]
    },
    {
      id: 3,
      user: {
        name: 'Priya Patel',
        avatar: 'assets/avatars/priya.jpg',
        location: 'Chicago, IL',
        verified: true,
        joinDate: '2022-11-05',
        reviewCount: 8
      },
      rating: 5,
      title: 'Finally found a reliable organic source',
      content: 'As someone who cooks Indian food regularly, I need fresh vegetables and spices. GreenMarket has been a game-changer. The curry leaves and fresh turmeric are amazing!',
      date: '3 days ago',
      product: 'Organic Spices Pack',
      productId: 103,
      helpful: 56,
      notHelpful: 1,
      verified: true,
      images: [
        {
          url: 'assets/reviews/spices.jpg',
          thumbnail: 'assets/reviews/spices-thumb.jpg',
          caption: 'Fresh spices for cooking'
        }
      ]
    },
    {
      id: 4,
      user: {
        name: 'James Wilson',
        avatar: 'assets/avatars/james.jpg',
        location: 'Miami, FL',
        verified: false,
        joinDate: '2023-01-15',
        reviewCount: 3
      },
      rating: 3,
      title: 'Good but packaging needs improvement',
      content: 'The products themselves are good quality, but some items arrived slightly damaged due to poor packaging. The customer service team was helpful and issued a refund, but hope they improve the packaging.',
      date: '5 days ago',
      product: 'Mixed Fruit Box',
      productId: 104,
      helpful: 18,
      notHelpful: 4,
      verified: false
    },
    {
      id: 5,
      user: {
        name: 'Emily Chen',
        avatar: 'assets/avatars/emily.jpg',
        location: 'Seattle, WA',
        verified: true,
        joinDate: '2022-09-10',
        reviewCount: 15
      },
      rating: 5,
      title: 'Excellent customer service',
      content: 'Had an issue with my first order but their support team went above and beyond to make it right. The quality of products is consistently good. Highly recommend the dairy products - the milk and cheese are amazing!',
      date: '1 week ago',
      product: 'Dairy Bundle',
      productId: 105,
      helpful: 42,
      notHelpful: 0,
      verified: true,
      response: {
        from: 'GreenMarket Team',
        message: 'Thank you Emily! We\'re glad we could resolve your issue and that you\'re enjoying our dairy products. We take customer satisfaction very seriously.',
        date: '6 days ago'
      }
    }
  ];

  // Related Products
  relatedProducts = [
    { id: 101, name: 'Organic Fruit Basket', rating: 4.9, reviews: 342, image: 'assets/products/fruit-basket.jpg' },
    { id: 102, name: 'Weekly Vegetable Box', rating: 4.7, reviews: 289, image: 'assets/products/veg-box.jpg' },
    { id: 103, name: 'Organic Spices Pack', rating: 4.8, reviews: 156, image: 'assets/products/spices.jpg' }
  ];

  // Statistics
  statistics = {
    averageRating: 4.8,
    totalReviews: 2547,
    verifiedReviews: 2132,
    recommendations: 94,
    fiveStarPercentage: 75,
    fourStarPercentage: 15,
    threeStarPercentage: 6,
    twoStarPercentage: 3,
    oneStarPercentage: 1
  };

  constructor() { }

  ngOnInit(): void {
    this.calculateStatistics();
  }

  // Get filtered and sorted reviews
  get filteredReviews(): Review[] {
    let filtered = [...this.reviews];

    // Filter by rating
    if (this.selectedRating > 0) {
      filtered = filtered.filter(r => r.rating === this.selectedRating);
    }

    // Filter by search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(query) ||
        r.content.toLowerCase().includes(query) ||
        r.product.toLowerCase().includes(query) ||
        r.user.name.toLowerCase().includes(query)
      );
    }

    // Apply special filters
    switch(this.selectedFilter) {
      case 'with_photos':
        filtered = filtered.filter(r => r.images && r.images.length > 0);
        break;
      case 'verified':
        filtered = filtered.filter(r => r.verified);
        break;
      case 'with_comments':
        filtered = filtered.filter(r => r.comments && r.comments.length > 0);
        break;
      default:
        break;
    }

    // Apply sorting
    switch(this.selectedSort) {
      case 'highest_rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest_rating':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'most_helpful':
        filtered.sort((a, b) => b.helpful - a.helpful);
        break;
      default: // most_recent
        // Assuming reviews are already in chronological order in the array
        break;
    }

    return filtered;
  }

  // Get paginated reviews
  get paginatedReviews(): Review[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredReviews.slice(start, end);
  }

  // Calculate total pages
  get totalFilteredPages(): number {
    return Math.ceil(this.filteredReviews.length / this.itemsPerPage);
  }

  // Calculate rating percentage
  getRatingPercentage(rating: number): number {
    const breakdown = this.ratingBreakdown.find(r => r.stars === rating);
    return breakdown ? breakdown.percentage : 0;
  }

  // Get rating count
  getRatingCount(rating: number): number {
    const breakdown = this.ratingBreakdown.find(r => r.stars === rating);
    return breakdown ? breakdown.count : 0;
  }

  // Calculate statistics
  calculateStatistics(): void {
    const total = this.reviews.length;
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.statistics.averageRating = Number((sum / total).toFixed(1));
    
    const verifiedCount = this.reviews.filter(r => r.verified).length;
    this.statistics.verifiedReviews = verifiedCount;
    
    const recommendations = this.reviews.filter(r => r.rating >= 4).length;
    this.statistics.recommendations = Math.round((recommendations / total) * 100);
  }

  // Submit review
  submitReview(): void {
    if (this.reviewForm.title && this.reviewForm.content && this.selectedRatingForForm > 0) {
      const newReview: Review = {
        id: this.reviews.length + 1,
        user: {
          name: 'Current User',
          avatar: 'assets/avatars/current-user.jpg',
          location: 'Your City',
          verified: true,
          joinDate: new Date().toISOString().split('T')[0],
          reviewCount: 1
        },
        rating: this.selectedRatingForForm,
        title: this.reviewForm.title,
        content: this.reviewForm.content,
        date: 'Just now',
        product: this.reviewForm.product || 'General Product',
        helpful: 0,
        verified: true
      };

      this.reviews.unshift(newReview);
      this.calculateStatistics();
      
      // Reset form
      this.reviewForm = {
        title: '',
        content: '',
        rating: 0,
        product: '',
        anonymous: false,
        images: []
      };
      this.selectedRatingForForm = 0;

      // Show success message
      this.showNotification('Review submitted successfully! Thank you for your feedback.');
    }
  }

  // Mark review as helpful
  markHelpful(review: Review): void {
    review.helpful++;
    this.showNotification('Thank you for your feedback!');
  }

  // Mark review as not helpful
  markNotHelpful(review: Review): void {
    if (review.notHelpful !== undefined) {
      review.notHelpful++;
    }
  }

  // Report review
  reportReview(review: Review): void {
    console.log('Reporting review:', review.id);
    this.showNotification('Review reported. Our team will investigate.');
  }

  // Add comment to review
  addComment(review: Review, commentText: string): void {
    if (commentText.trim()) {
      if (!review.comments) {
        review.comments = [];
      }
      
      review.comments.push({
        id: Date.now(),
        user: {
          name: 'Current User',
          avatar: 'assets/avatars/current-user.jpg',
          verified: true
        },
        text: commentText,
        date: 'Just now',
        likes: 0
      });
    }
  }

  // Like a comment
  likeComment(comment: ReviewComment): void {
    comment.likes++;
  }

  // Filter by rating
  filterByRating(rating: number): void {
    this.selectedRating = rating;
    this.currentPage = 1;
  }

  // Clear filters
  clearFilters(): void {
    this.selectedRating = 0;
    this.selectedSort = 'most_recent';
    this.selectedFilter = 'all';
    this.searchQuery = '';
    this.currentPage = 1;
  }

  // Change page
  changePage(page: number): void {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Load more reviews
  loadMore(): void {
    if (this.currentPage < this.totalFilteredPages) {
      this.currentPage++;
    }
  }

  // Open image modal
  viewImage(image: ReviewImage): void {
    console.log('Viewing image:', image.url);
    // Implement image modal
  }

  // Share review
  shareReview(review: Review): void {
    if (navigator.share) {
      navigator.share({
        title: review.title,
        text: review.content,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      this.showNotification('Link copied to clipboard!');
    }
  }

  // Handle image upload
  onImageUpload(event: any): void {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.reviewForm.images.push(files[i]);
    }
  }

  // Remove uploaded image
  removeImage(index: number): void {
    this.reviewForm.images.splice(index, 1);
  }

  // Show notification
  showNotification(message: string): void {
    // You can implement a proper notification system here
    console.log('Notification:', message);
    alert(message); // Temporary - replace with proper notification
  }

  // Get star array for rating display
  getStarArray(rating: number): number[] {
    return [1, 2, 3, 4, 5];
  }

  // Check if rating is filled
  isRatingFilled(star: number, rating: number): boolean {
    return star <= rating;
  }

  // Get rating text
  getRatingText(rating: number): string {
    switch(rating) {
      case 5: return 'Excellent';
      case 4: return 'Very Good';
      case 3: return 'Average';
      case 2: return 'Poor';
      case 1: return 'Terrible';
      default: return '';
    }
  }

  // Format date
  formatDate(date: string): string {
    return date;
  }

  // Get avatar initials if image not available
  getAvatarInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  // Track by function for ngFor
  trackByReviewId(index: number, review: Review): number {
    return review.id;
  }

  trackByCommentId(index: number, comment: ReviewComment): number {
    return comment.id;
  }
}