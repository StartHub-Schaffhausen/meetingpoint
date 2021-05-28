export const config = {
  coworkingName: 'Meeting-Point Schaffhausen',
  street: 'Am Herrenacker 15',
  postalcode: 8200,
  city: 'Schaffhausen',
  website: 'https://starthub.sh/Coworking',
  email: 'coworking@starthub.sh',
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
      price: 10,
      usageHours: '08:00 - 12:30',
      description: 'Morgen'
    },
    {
      id: 2,
      type: 'Afternoon',
      price: 10,
      usageHours: '13:00 - 17:30',
      description: 'Nachmittag'
    },
    {
      id: 3,
      type: 'Day',
      price: 15,
      usageHours: '08:00 - 17:30',
      description: 'Ganzer Tag'
    },
    {
      id: 4,
      type: 'Week',
      price: 65,
      usageHours: '08:00 - 17:30',
      description: 'Ganze Woche'
    },
    {
      id: 5,
      type: 'Month',
      price: 250,
      usageHours: '08:00 - 17:30',
      description: 'Ganzer Monat'
    },
  ]
};
