export interface Reservation {
    date: Date;
    bookingMorning: boolean;
    bookingAfternoon: boolean;
    bookingDay: boolean;
    bookingWeek: boolean;
    bookingType: string;
    userId: string;
    bookingCreated: Date;
    reservationType: string;
    price: string;
    image: string;
 }
