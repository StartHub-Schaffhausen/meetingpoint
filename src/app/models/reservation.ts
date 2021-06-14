import { Desk } from './resources';
import firebase from 'firebase/app';

export interface Reservation {
    id: string;
    dateFrom: Date | any;
    dateTo: Date | any;
    bookingType: string;
    bookingTypeDescription: string;
    userId: string;
    bookingCreated: Date | any;
    price: number;
    picture: string;
    desk: Desk;
    statusPaid: boolean;
    stripeInvoiceUrl: string;
    pdf: string;
 }
