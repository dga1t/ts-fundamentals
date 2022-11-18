// =====================================================
// vid #105 Intro

// =====================================================
// vid #106 Bridge

interface IProvider {
  sendMessage(message: string): void;
  connect(confit: unknown): void;
  disconnect(): void;
}

class TelegramProvider implements IProvider {
  sendMessage(message: string): void {
    console.log(message);
  }
  connect(confit: string): void {
    console.log(confit);
  }
  disconnect(): void {
    console.log('disonnected tg');
  }
}

class WhatsupProvider implements IProvider {
  sendMessage(message: string): void {
    console.log(message);
  }
  connect(confit: string): void {
    console.log(confit);
  }
  disconnect(): void {
    console.log('disonnected wu');
  }
}

// so the bridge pattern here is implemented between NotificationSender and IProvider
// it allows us to work with basicaly any providers and easy extension
// which wouldn't be possible if we would be using separate classes and inheritance

class NotificationSender {
  constructor(private provider: IProvider) {}

  send() {
    this.provider.connect('connect');
    this.provider.sendMessage('message');
    this.provider.disconnect();
  }
}

const sender = new NotificationSender(new TelegramProvider());
sender.send();

// =====================================================
// vid #107 Facade

// facade abstracts and hides away all the internal functionality and logic
// behind the relatively simple API

class Notify {
  send(template: string, to: string) {}
}

class Log {
  log(message: string) {}
}

class Template {
  private templates = [{ name: 'other', template: 'temp' }];
  getByName(name: string) {
    return this.templates.find((t) => t.name === name);
  }
}

class NotificationFacade {
  private notify: Notify;
  private logger: Log;
  private template: Template;

  constructor() {
    this.notify = new Notify();
    this.logger = new Log();
    this.template = new Template();
  }

  send(to: string, templateName: string) {
    const data = this.template.getByName(templateName);
    if (!data) {
      this.logger.log('template not found');
      return;
    }
    this.notify.send(data?.template, to);
    this.logger.log('template is successfully sent');
  }
}

// so we just use NotificationFacade to send message and it abstracts away all other
// important, but not neccessary to know for outside user logic
const s = new NotificationFacade();
s.send('a@a.io', 'other');

// =====================================================
// vid #108 Adapter

// the pattern is very usefull for example for adding some new third party
// libraries, that your application does not support yet

class KVDatabase {
  private db: Map<string, string> = new Map();
  save(key: string, value: string) {
    this.db.set(key, value);
  }
}

class PersistentDB {
  savePersistent(data: Object) {
    console.log(data);
  }
}

// we extend the object to which we want to implement an adapter
class PersistentDBAdapter extends KVDatabase {
  constructor(public database: PersistentDB) {
    super();
  }

  override save(key: string, value: string): void {
    this.database.savePersistent({ key, value });
  }
}

function run(base: KVDatabase) {
  base.save('key', 'myValue');
}

run(new PersistentDBAdapter(new PersistentDB()));

// =====================================================
// vid #109 Proxy

// the pattern is usefull when you need to add some logic layer
// like for example authorization or caching, on top of the already
// existing code/library

interface IPaymentAPI {
  getPaymentDetail(id: number): IPaymentDetail | undefined;
}

interface IPaymentDetail {
  id: number;
  sum: number;
}

// interface of the 'real' payment api
class PaymentAPI implements IPaymentAPI {
  private data = [{ id: 1, sum: 10000 }];
  getPaymentDetail(id: number): IPaymentDetail | undefined {
    return this.data.find((d) => d.id === id);
  }
}

// the actual proxy with added authorization logic
class PaymentAccessProxy implements IPaymentAPI {
  constructor(private api: PaymentAPI, private userId: number) {}

  getPaymentDetail(id: number): IPaymentDetail | undefined {
    if (this.userId === 1) return this.api.getPaymentDetail(id);
    console.log('attemp to get payment details');
    return undefined;
  }
}

const proxy1 = new PaymentAccessProxy(new PaymentAPI(), 1);
console.log(proxy1.getPaymentDetail(1));
const proxy2 = new PaymentAccessProxy(new PaymentAPI(), 2);
console.log(proxy2.getPaymentDetail(2));

// =====================================================
// vid #110 Composite

// the patter is not really that popular, but sometimes can realy simplify your code
// it usually deals with tree-like structures

abstract class DeliveryItem {
  items: DeliveryItem[] = [];

  addItem(item: DeliveryItem) {
    this.items.push(item);
  }

  getItemPrices(): number {
    return this.items.reduce(
      (acc: number, i: DeliveryItem) => (acc += i.getPrice()),
      0
    );
  }

  abstract getPrice(): number;
}

class DeliveryShop extends DeliveryItem {
  constructor(private deliveryFee: number) {
    super();
  }

  getPrice(): number {
    return this.getItemPrices() + this.deliveryFee;
  }
}

class Package extends DeliveryItem {
  getPrice(): number {
    return this.getItemPrices();
  }
}

class Producto extends DeliveryItem {
  constructor(private price: number) {
    super();
  }

  getPrice(): number {
    return this.price;
  }
}

const shop = new DeliveryShop(100);
shop.addItem(new Producto(1000));

const pack1 = new Package();
pack1.addItem(new Producto(200));
shop.addItem(pack1);

const pack2 = new Package();
pack2.addItem(new Producto(50));
shop.addItem(pack2);

// so this patter allows with just one method 'getPrice' to aggregate all data
console.log(shop.getPrice());
