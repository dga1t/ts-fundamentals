// vid #20 Union - type narrowing
function logId(id: string | number | boolean) {
  if (typeof id === 'string') console.log(id);
  else if (typeof id === 'number') console.log(id);
  else console.log(id);
}

function logError(err: string | string[]) {
  if (Array.isArray(err)) console.log(err);
  else console.log(err);
}

function logObject(obj: { a: number } | { b: number }) {
  if ('a' in obj) console.log(obj.a);
  else console.log(obj.b);
}

// =====================================================
// vid #21 Literal Types

function fetchWithAuth(url: string, method: 'post' | 'get'): 1 | -1 {
  return 1;
}

// =====================================================
// vid #22 Type Aliases

type httpMethod = 'post' | 'get';

function fetchWithAuth2(url: string, method: httpMethod): 1 | -1 {
  return 1;
}

type User = {
  name: string;
  age: number;
  skills: string[];
};

type Role = {
  id: number;
};

type UserWithRole = User & Role;

let user: UserWithRole = {
  name: 'asd',
  age: 33,
  skills: ['1', '2'],
  id: 1,
};

// =====================================================
// vid #23 Interfaces

interface IUser {
  name: string;
  age: number;
  skills: string[];

  log: (id: number) => string;
}

interface IRole {
  roleId: number;
}

interface IUserWithRole extends IUser, IRole {
  createdAt: Date;
}

let user2: IUserWithRole = {
  name: 'asd',
  age: 33,
  skills: ['1', '2'],
  roleId: 1,
  createdAt: new Date(),

  log(id) {
    return '';
  },
};

interface UserDic {
  [index: number]: IUser;
}

// =====================================================
// vid #24 Types or Interfaces - in general types for primitives and interfaces for objects

// =====================================================
// vid #25 Optional

function multiply(first: number, second?: number): number {
  if (!second) return first * first;
  return first * second;
}

multiply(5);

interface UserPro {
  login: string;
  password: {
    type: 'primary' | 'secondary';
  };
}

function testPass(user: UserPro) {
  const t = user.password?.type;
}

// nullish coalescing operator
function test(param?: string) {
  const t = param ?? multiply(5);
}

// =====================================================
// vid #26 Practice exercise

enum PaymentStatus {
  Success = 'success',
  Failed = 'failed'
}

interface IPayment {
  sum: number;
  from: number;
  to: number;
}

interface IPaymentRequest extends IPayment {}

interface IDataSuccess extends IPayment {
  databaseId: number;
}

interface IDataFailed {
  errorMessage: string;
  errorCode: number;
}

interface IResponseSuccess {
  status: PaymentStatus.Success;
  data: IDataSuccess;
}

interface IResponseFailed {
  status: PaymentStatus.Failed;
  data: IDataFailed;
}

// =====================================================
// vid #27 Void
