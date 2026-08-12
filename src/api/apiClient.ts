import { APIRequestContext } from '@playwright/test';
import { UserAccount } from '@utils/testData';

export const API_ENDPOINTS = {
  productsList: '/api/productsList',
  brandsList: '/api/brandsList',
  searchProduct: '/api/searchProduct',
  verifyLogin: '/api/verifyLogin',
  createAccount: '/api/createAccount',
  deleteAccount: '/api/deleteAccount',
  updateAccount: '/api/updateAccount',
  getUserDetailByEmail: '/api/getUserDetailByEmail',
} as const;

function toFormFields(user: UserAccount) {
  return {
    name: user.name,
    email: user.email,
    password: user.password,
    title: user.title,
    birth_date: user.birthDay,
    birth_month: user.birthMonth,
    birth_year: user.birthYear,
    firstname: user.firstName,
    lastname: user.lastName,
    company: user.company,
    address1: user.address1,
    address2: user.address2,
    country: user.country,
    zipcode: user.zipcode,
    state: user.state,
    city: user.city,
    mobile_number: user.mobileNumber,
  };
}

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async createAccount(user: UserAccount) {
    return this.request.post(API_ENDPOINTS.createAccount, { form: toFormFields(user) });
  }

  async deleteAccount(email: string, password: string) {
    return this.request.delete(API_ENDPOINTS.deleteAccount, { form: { email, password } });
  }

  async updateAccount(user: UserAccount) {
    return this.request.put(API_ENDPOINTS.updateAccount, { form: toFormFields(user) });
  }

  async verifyLogin(email: string, password: string) {
    return this.request.post(API_ENDPOINTS.verifyLogin, { form: { email, password } });
  }

  async getUserDetailByEmail(email: string) {
    return this.request.get(`${API_ENDPOINTS.getUserDetailByEmail}?email=${encodeURIComponent(email)}`);
  }

  async getProductsList() {
    return this.request.get(API_ENDPOINTS.productsList);
  }

  async postProductsList() {
    return this.request.post(API_ENDPOINTS.productsList);
  }

  async getBrandsList() {
    return this.request.get(API_ENDPOINTS.brandsList);
  }

  async putBrandsList() {
    return this.request.put(API_ENDPOINTS.brandsList);
  }

  async deleteVerifyLogin() {
    return this.request.delete(API_ENDPOINTS.verifyLogin);
  }

  async searchProduct(searchTerm: string) {
    return this.request.post(API_ENDPOINTS.searchProduct, { form: { search_product: searchTerm } });
  }
}
