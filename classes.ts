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