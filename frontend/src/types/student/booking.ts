export interface IBooking {
  _id?: string;
  studentId: { name: string };
  teacherId: { name: string };
  courseId: { title: string };
  date: string;
  slot: { start: string; end: string };
  note: string;
  paymentOrderId?: string;
  status?: string;
  amount?: number;
}



export interface BookingDetails {
    teacherId: {
        name: string
    };
    courseId: {
        title: string
    };
    date: string;
    day: string;
    slot: { start: string; end: string };
    paymentOrderId: string;
    status: string;
    amount: number;
}

