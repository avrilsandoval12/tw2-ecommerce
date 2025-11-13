export interface CartItemValidation {
  productId: number;
  requestedQuantity: number;
}

export interface ProductValidationResult {
  productId: number;
  productName: string;
  requestedQuantity: number;
  availableStock: number;
  currentPrice: number;
  isValid: boolean;
  reason?: string;
}

export interface CartValidationResponse {
  message: string;
  valid: boolean;
  results: ProductValidationResult[];
  totalPrice: number;
  invalidItems: number;
}
