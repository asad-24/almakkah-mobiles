export interface Product {
  _id?: string
  name: string
  price: number
  category: "new-boxed" | "second-hand"
  brand: string
  model: string
  specs: {
    ram: string
    storage: string
    processor: string
    camera: string
    battery: string
  }
  condition?: "excellent" | "good" | "fair"
  image: string
  description: string
  inStock: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface Offer {
  _id?: string
  title: string
  description: string
  discount: number
  discountType: "percentage" | "fixed"
  applicableProducts: string[]
  startDate: Date
  endDate: Date
  active: boolean
  createdAt?: Date
}

export interface GalleryImage {
  _id?: string
  url: string
  title: string
  description: string
  category: string
  createdAt?: Date
}

export interface Contact {
  _id?: string
  name: string
  email: string
  phone: string
  message: string
  createdAt?: Date
  status: "new" | "read" | "replied"
}
