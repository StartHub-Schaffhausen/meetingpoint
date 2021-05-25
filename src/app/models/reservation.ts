import { Desk } from './resources';

export interface Reservation {
    id: string;
    date: Date;
    bookingMorning: boolean;
    bookingAfternoon: boolean;
    bookingDay: boolean;
    bookingWeek: boolean;
    bookingType: string;
    userId: string;
    bookingCreated: Date;
    price: string;
    picture: string;
    desk: Desk;
 }
