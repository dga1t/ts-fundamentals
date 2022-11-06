// =====================================================
// vid #77 Intro

// =====================================================
// vid #78 Partial, Required, Readonly

// all these utility types are using map under the hood

// =====================================================
// vid #79 Pick/Omit, Extract/Exclude

interface PaymentPersistent {
  id: number;
  sum: number;
  from: string;
  to: string;
}

type PaymentTwo = Omit<PaymentPersistent, 'id'>;
type PaymentThree = Pick<PaymentPersistent, 'from' | 'to'>;

type ExtractEx = Extract<'from' | 'to' | Payment, string>;
type ExcludetEx = Exclude<'from' | 'to' | Payment, string>;

// =====================================================
// vid #80 ReturnType, Parameters, ConstructorParameters

class UserOmg {
  constructor(public id: number, public name: string) {}
}

function getData(id: number): UserOmg {
  return new UserOmg(id, 'tony');
}

type RT = ReturnType<typeof getData>;
type RT2 = ReturnType<() => void>;
type RT3 = ReturnType<<T>() => T>;

type PT = Parameters<typeof getData>[0];

type CP = ConstructorParameters<typeof UserOmg>;

// =====================================================
// vid #81 Awaited

type A = Awaited<Promise<string>>;
type A2 = Awaited<Promise<Promise<string>>>;

interface IMenu {
  name: string;
  url: string;
}

async function getMenu(): Promise<IMenu[]> {
  return [{ name: 'Analytics', url: 'analytics.io' }];
}

// we pulled out IMenu type even though it is async func returning a promise
type R = Awaited<ReturnType<typeof getMenu>>;

// another use case is for readability
async function getArray<T>(x: T): Promise<Awaited<T>[]> {
  return [await x];
}
