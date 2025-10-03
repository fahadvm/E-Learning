export interface CartCourse {
    id: string
    title: string
    teacherId: TeacherDetails | string
    coverImage: string
    price: number
    originalPrice?: number
    quantity: number
}

export interface TeacherDetails {
    id: string
    name: string
    email: string
}

export interface CartData {
    courses: CartCourse[]
    total:number;
}

export interface CartSummary {
    subtotal: number
    discount: number
    total: number
    courseCount: number
}
