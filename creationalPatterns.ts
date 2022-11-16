// =====================================================
// vid #100 Intro

// =====================================================
// vid #101 Factory method

// factory patter is usefull when we need a reusable code that can
// work with different types of objects

interface IInsurance {
  id: number;
  status: string;
  setVehicle(vehicle: any): void;
  submit(): Promise<boolean>;
}

class TFInsurance implements IInsurance {
  id: number;
  status: string;
  private vehicle: any;

  setVehicle(vehicle: any): void {
    this.vehicle = vehicle;
  }

  async submit(): Promise<boolean> {
    // rewrite fetch for a built-in undici in latest node 18 ??
    const res = await fetch('tf.com', {
      method: 'POST',
      body: JSON.stringify({ vehicle: this.vehicle }),
    });

    const data = await res.json();
    return data.isSuccess;
  }
}

class ABInsurance implements IInsurance {
  id: number;
  status: string;
  private vehicle: any;

  setVehicle(vehicle: any): void {
    this.vehicle = vehicle;
  }

  async submit(): Promise<boolean> {
    // rewrite fetch for a built-in undici in latest node 18 ??
    const res = await fetch('ab.com', {
      method: 'POST',
      body: JSON.stringify({ vehicle: this.vehicle }),
    });

    const data = await res.json();
    return data.yes;
  }
}

abstract class InsuranceFactory {
  db: any;

  abstract createInsurance(): IInsurance;

  saveHistory(ins: IInsurance) {
    this.db.save(ins.id, ins.status);
  }
}

class TFInsuranceFactory extends InsuranceFactory {
  createInsurance(): TFInsurance {
    return new TFInsurance();
  }
}

class ABInsuranceFactory extends InsuranceFactory {
  createInsurance(): ABInsurance {
    return new ABInsurance();
  }
}

const tfInsuranceFactory = new TFInsuranceFactory();
const ins = tfInsuranceFactory.createInsurance();
tfInsuranceFactory.saveHistory(ins);

// another way to implement this pattern without an abstract class
// it is not following OOP principles, but can often be seen in typescript

const INSURANCE_TYPE = {
  tf: TFInsurance,
  ab: ABInsurance,
};

type IT = typeof INSURANCE_TYPE;

class InsuranceFactoryAlt {
  db: any;

  createInsurance<T extends keyof IT>(type: T): IT[T] {
    return INSURANCE_TYPE[type];
  }

  saveHistory(ins: IInsurance) {
    this.db.save(ins.id, ins.status);
  }
}

const insuranceFactoryAlt = new InsuranceFactoryAlt();
const ins2 = new (insuranceFactoryAlt.createInsurance('tf'))();
insuranceFactoryAlt.saveHistory(ins2);

// =====================================================
// vid #102 Singleton

class MyMap {
  private static instance: MyMap;

  map: Map<number, string> = new Map();

  private constructor() {}

  clean() {
    this.map = new Map();
  }

  public static get(): MyMap {
    if (!MyMap.instance) MyMap.instance = new MyMap();
    return MyMap.instance;
  }
}

class Service1 {
  addMap(key: number, value: string) {
    const myMap = MyMap.get();
    myMap.map.set(key, value);
  }
}

class Service2 {
  getKeys(key: number) {
    const myMap = MyMap.get();
    console.log(myMap.map.get(key));
    myMap.clean();
    console.log(myMap.map.get(key));
  }
}

new Service1().addMap(1, 'working');
new Service2().getKeys(1);

// =====================================================
// vid #103 Prototype

interface Prototype<T> {
  clone(): T;
}

class UserHistory implements Prototype<UserHistory> {
  createdAt: Date;

  constructor(public email: string, public name: string) {
    this.createdAt = new Date();
  }

  clone(): UserHistory {
    let target = new UserHistory(this.email, this.name);
    target.createdAt = this.createdAt;
    return target;
  }
}

let userFive = new UserHistory('a@a.io', 'tony');
console.log(userFive);
let userSix = userFive.clone();
console.log(userSix);

// =====================================================
// vid #104 Builder

// builder pattern is often used for example in ORMs

// important aspect - builder's methods should be chainable

enum ImageFormat {
  Png = 'png',
  Jpeg = 'jpeg',
}

interface IResolution {
  width: number;
  height: number;
}

interface IImageConvertion extends IResolution {
  format: ImageFormat;
}

class ImageBuilder {
  private formats: ImageFormat[] = [];
  private resolutions: IResolution[] = [];

  addPng() {
    if (this.formats.includes(ImageFormat.Png)) return this;
    this.formats.push(ImageFormat.Png);
    return this;
  }

  addJpeg() {
    if (this.formats.includes(ImageFormat.Jpeg)) return this;
    this.formats.push(ImageFormat.Jpeg);
    return this;
  }

  addResolution(width: number, height: number) {
    this.resolutions.push({ width, height });
    return this;
  }

  build(): IImageConvertion[] {
    const res: IImageConvertion[] = [];
    for (const r of this.resolutions) {
      for (const f of this.formats) {
        res.push({ format: f, width: r.width, height: r.height });
      }
    }
    return res;
  }
}

console.log(
  new ImageBuilder()
    .addJpeg()
    .addPng()
    .addResolution(100, 50)
    .addResolution(200, 100)
    .build()
);
