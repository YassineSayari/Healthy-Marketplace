import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html'
})
export class DeliveryComponent implements OnInit {
  deliveryOptions = [
    {
      icon: 'fas fa-bolt',
      name: 'Express Delivery',
      time: '1-2 hours',
      price: '$5.99'
    },
    {
      icon: 'fas fa-truck',
      name: 'Standard Delivery',
      time: '24-48 hours',
      price: '$2.99'
    },
    {
      icon: 'fas fa-calendar-check',
      name: 'Scheduled Delivery',
      time: 'Choose your day',
      price: 'FREE'
    }
  ];

  standardTimes = [
    { day: 'Monday - Friday', slot: '9:00 AM - 6:00 PM' },
    { day: 'Saturday', slot: '10:00 AM - 4:00 PM' },
    { day: 'Sunday', slot: 'Closed' }
  ];

  expressTimes = [
    { day: 'Monday - Friday', slot: '10:00 AM - 8:00 PM' },
    { day: 'Saturday', slot: '11:00 AM - 6:00 PM' },
    { day: 'Sunday', slot: '12:00 PM - 4:00 PM' }
  ];

  deliveryZones = [
    { name: 'Zone 1 - Downtown', time: '30-45 min', fee: '$2.99' },
    { name: 'Zone 2 - Suburbs', time: '45-60 min', fee: '$3.99' },
    { name: 'Zone 3 - Rural', time: '60-90 min', fee: '$4.99' }
  ];

  trackingNumber: string = '';
  trackingResult: any = null;

  constructor() { }

  ngOnInit(): void {
    // Initialize any data or subscriptions
  }

  trackOrder(): void {
    if (this.trackingNumber) {
      // Simulate API call to track order
      this.trackingResult = {
        status: 'In Transit',
        location: 'Distribution Center',
        estimatedDelivery: 'Tomorrow, 2:00 PM',
        updates: [
          { time: '2 hours ago', description: 'Package arrived at distribution center' },
          { time: '5 hours ago', description: 'Package departed from sorting facility' },
          { time: '1 day ago', description: 'Order confirmed and processed' }
        ]
      };
    }
  }

  calculateDeliveryFee(zipCode: string): number {
    // Simulate delivery fee calculation based on zip code
    const zipPrefix = parseInt(zipCode.substring(0, 3));
    if (zipPrefix < 100) return 2.99;
    if (zipPrefix < 200) return 3.99;
    return 4.99;
  }

  getZoneColor(zone: string): string {
    const colors: { [key: string]: string } = {
      'Zone 1': 'bg-green-100 text-green-800',
      'Zone 2': 'bg-yellow-100 text-yellow-800',
      'Zone 3': 'bg-orange-100 text-orange-800'
    };
    return colors[zone.split(' - ')[0]] || 'bg-gray-100 text-gray-800';
  }

  scheduleDelivery(date: string, timeSlot: string): void {
    console.log(`Delivery scheduled for ${date} at ${timeSlot}`);
  }
}