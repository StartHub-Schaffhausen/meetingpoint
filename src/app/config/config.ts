export const config = {
  coworkingName: 'Meeting-Point Schaffhausen',
  street: 'Am Herrenacker 15',
  postalcode: 8200,
  city: 'Schaffhausen',
  website: 'https://starthub.sh/Coworking',
  email: 'hello@starthub.sh',
  openingHours: {
    monday: '08:00 - 18:00',
    tuesday: '08:00 - 18:00',
    wednesday: '08:00 - 18:00',
    thursday: '08:00 - 18:00',
    friday: '08:00 - 18:00',
    saturday: 'Geschlossen',
    sunday: 'Geschlossen'
  },
  offer: [{
      id: 1,
      type: 'Morning',
      price: 12,
      usageHours: '08:00 - 13:00',
      description: 'Vormittag'
    },
    {
      id: 2,
      type: 'Afternoon',
      price: 12,
      usageHours: '13:00 - 18:00',
      description: 'Nachmittag'
    },
    {
      id: 3,
      type: 'Day',
      price: 19,
      usageHours: '08:00 - 18:00',
      description: 'Ganzer Tag'
    },
    {
      id: 4,
      type: 'Week',
      price: 85,
      usageHours: '08:00 - 18:00',
      description: 'Ganze Woche'
    },
    {
      id: 5,
      type: 'Month',
      price: 320,
      usageHours: '08:00 - 18:00',
      description: 'Ganzer Monat'
    },
  ]
};
