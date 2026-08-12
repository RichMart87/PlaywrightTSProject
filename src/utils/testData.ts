import { faker } from '@faker-js/faker';

export interface UserAccount {
  name: string;
  email: string;
  password: string;
  title: 'Mr' | 'Mrs';
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
}

const COUNTRIES = ['India', 'United States', 'Canada', 'Australia', 'Israel', 'New Zealand', 'Singapore'] as const;

export function uniqueEmail(prefix = 'qa'): string {
  return `${prefix}.${Date.now()}.${faker.string.alphanumeric(6).toLowerCase()}@example.com`;
}

export function generateUser(overrides: Partial<UserAccount> = {}): UserAccount {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const title: 'Mr' | 'Mrs' = faker.helpers.arrayElement(['Mr', 'Mrs']);

  return {
    name: `${firstName} ${lastName}`,
    email: uniqueEmail(),
    password: faker.internet.password({ length: 12 }),
    title,
    birthDay: String(faker.number.int({ min: 1, max: 28 })),
    birthMonth: String(faker.number.int({ min: 1, max: 12 })),
    birthYear: String(faker.number.int({ min: 1970, max: 2000 })),
    firstName,
    lastName,
    company: faker.company.name(),
    address1: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    country: faker.helpers.arrayElement(COUNTRIES),
    state: faker.location.state(),
    city: faker.location.city(),
    zipcode: faker.location.zipCode(),
    mobileNumber: faker.string.numeric(10),
    ...overrides,
  };
}
