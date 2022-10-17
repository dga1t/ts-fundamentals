// =====================================================
// vid #35 Create class

// in tsconfig - strictPropertyInitialization is often set to false, so that class can be used as interface
// especially together with decorators

// =====================================================
// vid #36 Constructor

// 'new' triggers constructor function
// in TS constructor can be overloaded

// =====================================================
// vid #37 Methods

// =====================================================
// vid #38 Exercise - Method overload

// wtf would anyone write this?!
class UserOne {
  skills: string[];

  addSkill(skill: string): void;
  addSkill(skills: string[]): void;
  addSkill(skillOrSkills: string | string[]): void {
    if (typeof skillOrSkills == 'string') this.skills.push(skillOrSkills);
    else this.skills.push(...skillOrSkills);
  }
}

// =====================================================
// vid #39 Getters and Setters

// getters and setters can only be synchronous

// =====================================================
// vid #40 Implements

interface ILogger {
  log(...args): void;
  error(...args): void;
}

class Logger implements ILogger {
  log(...args: any[]): void {
    console.log(...args);
  }
  async error(...args: any[]): Promise<void> {
    console.log(...args);
  }
}

// =====================================================
// vid #41 Extends

// =====================================================
// vid #42 Peculiarities of extends

// 'super' should always go before referencing any class properties

class HttpError extends Error {
  code: number;

  constructor(message: string, code?: number) {
    super(message);
    this.code = code ?? 500;
  }
}

// =====================================================
// vid #43 Composition vs Inheritance

// this kind of inheritance from utilitary class, like Array, should be avoided
class Users extends Array<User> {
  searchByName(name: string) {
    return this.filter((u) => u.name === name);
  }

  override toString(): string {
    return this.map((u) => u.name).join(', ');
  }
}

// composition is a better option in this case
class UserList {
  users: User[];

  push(u: User) {
    this.users.push(u);
  }
}

// ----------- another example ------------

class Payment {
  date: Date;
}

// again inheritance should be avoided here because it violates DDD (domain driven design) principle
// because User and Payment belong to different domains
class UserWithPayment extends Payment {
  name: string;
}

// composition is a better option again
class UserWithPayment2 {
  user: User;
  payment: Payment;

  constructor(user: User, payment: Payment) {
    this.payment = payment;
    this.user = user;
  }
}

// =====================================================
// vid #44 Visibility of properties

// property 'private' is only for typescript - in js we still can access it
// property 'protected' is different from 'private' - it can be accessed inside an inherited class
// in JS 'private' property is marked as '#'

// on the backend it is not really neccessary to make properties JS private (#)
// because no script from outside cant access it anyway (?)

// also private properties can be compared

// =====================================================
// vid #45 Exercise

class Product {
  constructor(public id: number, public name: string, public price: number) {}
}

class Delivery {
  constructor(public date: Date) {}
}

class HomeDelivery extends Delivery {
  constructor(date: Date, public adress: string) {
    super(date);
  }
}

class ShopDelivery extends Delivery {
  constructor(date: Date, public shopId: number) {
    super(new Date());
  }
}

type DeliveryOptions = HomeDelivery | ShopDelivery;

class Cart {
  private products: Product[] = [];
  private delivery: DeliveryOptions;

  public addProduct(product: Product): void {
    this.products.push(product);
  }

  public deleteProduct(productId: number): void {
    this.products = this.products.filter((p: Product) => p.id !== productId);
  }

  public getSum(): number {
    return this.products
      .map((p: Product) => p.price)
      .reduce((p1: number, p2: number) => p1 + p2);
  }

  public setDelivery(delivery: DeliveryOptions): void {
    this.delivery = delivery;
  }

  public checkout() {
    if (this.products.length == 0) throw new Error('The cart is empty');
    if (!this.delivery) throw new Error('Delivery method is missing');
    return { success: true };
  }
}

// =====================================================
// vid #46 Static

class UserService {
  private static db: any;

  static getUser(id: number) {
    return UserService.db.findById(id);
  }

  constructor(id: number) {}

  create() {
    UserService.db;
  }

  // since recently classes can have static blocks
  // cant have async code inside this static block
  static {
    UserService.db = 'dbName';
  }
}

// =====================================================
// vid #47 Working with 'this'

// in ts we can pass 'this' as an argument to methods to keep the context

// another way to achieve this is to use an arrow function
// but we should be careful when using arrow function from inherited class
// because it is not going to be on the prototype chain of the parent class (ex: super.arrowFunc())

// =====================================================
// vid #48 Type 'this'

// there is a special type for 'this' in ts
class UserBuilder {
  name: string;

  setName(name: string): this {
    this.name = name;
    return this;
  }

  // using type guard
  isAdmit(): this is AdminBuilder {
    return this instanceof AdminBuilder;
  }
}

class AdminBuilder extends UserBuilder {
  roles: string[];
}

// =====================================================
// vid #49 Abstract classes

// abstract classes cant be instantiated and are only used to inherite from
// and are widely used in different frameworks

// abstract class differs from interface in that it can have normal methods as well
// and also we can call abstract methods inside an abstract class

abstract class Controller {
  abstract handle(req: any): void;

  handleWithLogs(req: any) {
    console.log('start');
    this.handle(req);
    console.log('end');
  }
}

class UserController extends Controller {
  handle(req: any): void {
    console.log(req);
  }
}

// =====================================================
// vid #50 Exercise - abstract logger

abstract class LoggerTwo {
  abstract log(message: string): void;

  printDate(date: Date) {
    this.log(date.toString());
  };
}

class CustomLogger extends LoggerTwo {
  log(message: string): void {
    console.log(message);
  }

  logWithDate(message: string) {
    this.printDate(new Date());
    this.log(message);
  }
}