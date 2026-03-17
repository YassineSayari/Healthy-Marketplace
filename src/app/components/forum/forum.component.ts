import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html'
})
export class ForumComponent implements OnInit {
  categories: string[] = [
    'All Topics',
    'Organic Gardening',
    'Recipes',
    'Health & Wellness',
    'Product Reviews',
    'Q&A',
    'Announcements'
  ];

  selectedCategory: string = 'All Topics';

  posts = [
    {
      id: 1,
      title: 'Best organic fertilizers for vegetable garden',
      content: 'I\'ve been gardening for 5 years and wanted to share my experience with different organic fertilizers. Compost tea has been a game-changer for my tomatoes!',
      author: {
        name: 'GreenThumbGardener',
        avatar: 'assets/avatars/user1.jpg',
        posts: 156,
        joined: '2020-03-15'
      },
      date: '2 hours ago',
      category: 'Organic Gardening',
      likes: 45,
      comments: 12,
      commentsList: [
        {
          name: 'HerbLover',
          avatar: 'assets/avatars/user2.jpg',
          text: 'Thanks for sharing! How often do you apply compost tea?',
          date: '1 hour ago'
        },
        {
          name: 'TomatoKing',
          avatar: 'assets/avatars/user3.jpg',
          text: 'I also swear by worm castings. They work wonders!',
          date: '30 minutes ago'
        }
      ],
      showComments: false,
      tags: ['gardening', 'fertilizer', 'organic']
    },
    {
      id: 2,
      title: 'Quick and healthy organic breakfast ideas',
      content: 'Looking for some quick breakfast ideas using organic ingredients. I usually make smoothie bowls with organic fruits and granola. What are your go-to recipes?',
      author: {
        name: 'HealthyEats',
        avatar: 'assets/avatars/user4.jpg',
        posts: 89,
        joined: '2021-06-20'
      },
      date: '5 hours ago',
      category: 'Recipes',
      likes: 32,
      comments: 8,
      commentsList: [
        {
          name: 'SmoothieQueen',
          avatar: 'assets/avatars/user5.jpg',
          text: 'Overnight oats with chia seeds and fresh berries!',
          date: '3 hours ago'
        }
      ],
      showComments: false,
      tags: ['breakfast', 'recipes', 'healthy']
    },
    {
      id: 3,
      title: 'Benefits of switching to organic skincare',
      content: 'I made the switch to organic skincare products 6 months ago and the difference is amazing. My skin feels healthier and I love knowing exactly what ingredients I\'m putting on my body.',
      author: {
        name: 'GlowNaturally',
        avatar: 'assets/avatars/user6.jpg',
        posts: 67,
        joined: '2022-01-10'
      },
      date: '1 day ago',
      category: 'Health & Wellness',
      likes: 78,
      comments: 23,
      commentsList: [],
      showComments: false,
      image: 'assets/forum/skincare.jpg',
      tags: ['skincare', 'beauty', 'wellness']
    }
  ];

  trendingTopics = [
    { topic: 'Winter vegetable planting', posts: 45 },
    { topic: 'Organic pest control', posts: 38 },
    { topic: 'Farmers market finds', posts: 32 },
    { topic: 'Composting 101', posts: 29 },
    { topic: 'Seasonal recipes', posts: 27 }
  ];

  activeUsers = [
    { name: 'GardenGuru', avatar: 'assets/avatars/user7.jpg', status: 'online' },
    { name: 'RecipeMaster', avatar: 'assets/avatars/user8.jpg', status: 'online' },
    { name: 'EcoWarrior', avatar: 'assets/avatars/user9.jpg', status: 'away' },
    { name: 'GreenChef', avatar: 'assets/avatars/user10.jpg', status: 'offline' }
  ];

  newPost = {
    title: '',
    content: '',
    category: 'General',
    tags: ''
  };

  searchQuery: string = '';
  sortBy: string = 'latest';

  constructor() { }

  ngOnInit(): void {
    // Load forum data
  }

  get filteredPosts() {
    let filtered = this.posts;
    
    // Filter by category
    if (this.selectedCategory !== 'All Topics') {
      filtered = filtered.filter(post => post.category === this.selectedCategory);
    }
    
    // Filter by search
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Sort
    switch(this.sortBy) {
      case 'latest':
        return filtered; // Assuming posts are already in chronological order
      case 'popular':
        return filtered.sort((a, b) => b.likes - a.likes);
      case 'most_commented':
        return filtered.sort((a, b) => b.comments - a.comments);
      default:
        return filtered;
    }
  }

  createPost(): void {
    if (this.newPost.title && this.newPost.content) {
      const post = {
        id: this.posts.length + 1,
        title: this.newPost.title,
        content: this.newPost.content,
        author: {
          name: 'CurrentUser',
          avatar: 'assets/avatars/current-user.jpg',
          posts: 12,
          joined: '2023-01-01'
        },
        date: 'Just now',
        category: this.newPost.category,
        likes: 0,
        comments: 0,
        commentsList: [],
        showComments: false,
        tags: this.newPost.tags.split(',').map(tag => tag.trim())
      };
      
      this.posts.unshift(post);
      
      // Reset form
      this.newPost = {
        title: '',
        content: '',
        category: 'General',
        tags: ''
      };
    }
  }

  likePost(post: any): void {
    post.likes++;
  }

  toggleComments(post: any): void {
    post.showComments = !post.showComments;
  }

  addComment(post: any, commentText: string): void {
    if (commentText.trim()) {
      post.commentsList.push({
        name: 'CurrentUser',
        avatar: 'assets/avatars/current-user.jpg',
        text: commentText,
        date: 'Just now'
      });
      post.comments++;
    }
  }

  sharePost(post: any): void {
    // Implement sharing functionality
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content,
        url: window.location.href
      });
    }
  }

  reportPost(post: any): void {
    console.log('Reporting post:', post.id);
    // Implement reporting logic
  }

  followTopic(topic: string): void {
    console.log('Following topic:', topic);
    // Implement topic following
  }
}