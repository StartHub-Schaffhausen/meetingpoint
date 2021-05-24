export interface Reservation {
    date: Date;
    bookingMorning: boolean;
    bookingAfternoon: boolean;
    bookingDay: boolean;
    bookingWeek: boolean;
    userId: string;
    bookingCreated: Date;
    reservationType: string;
 }
