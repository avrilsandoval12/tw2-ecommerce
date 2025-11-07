export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imgurl: string;
    stock: number;
    categoryid: number;
}

export interface ProductDTO {
    name: string;
    description: string;
    price: number;
    imgurl: string;
    stock: number;
    categoryid: number;
}
