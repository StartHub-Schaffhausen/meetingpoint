import { Desk } from './resources';

export interface Reservation {
    id: string;
    dateFrom: Date;
    dateTo: Date;
    bookingType: string;
    bookingTypeDescription: string;
    userId: string;
    bookingCreated: Date;
    price: number;
    picture: string;
    desk: Desk;
    statusPaid: boolean;
 }
