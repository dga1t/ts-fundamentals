// =====================================================
// vid #35 Create class

// in tsconfig - strictPropertyInitialization is often set to false, so that class can be used as interface
// especially together with decorators

// =====================================================
// vid #36 Constructor

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