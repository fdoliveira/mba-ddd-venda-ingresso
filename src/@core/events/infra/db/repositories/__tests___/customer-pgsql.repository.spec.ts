import { MikroORM, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Customer } from 'src/@core/events/domain/entities/customer.entity';
import { CustomerPgsqlRepository } from '../customer-pgsql.repository';
import { CustomerSchema } from '../../schemas';

test('Customer repository', async () => {
  const orm = await MikroORM.init<PostgreSqlDriver>({
    entities: [CustomerSchema],
    dbName: 'postgres',
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgrespw',
    forceEntityConstructor: true,
    debug: true,
  });
  await orm.schema.refreshDatabase();
  const em = orm.em.fork();
  const customerRepo = new CustomerPgsqlRepository(em);

  const customer = Customer.create({
    name: 'Customer 1',
    cpf: '703.758.870-91',
  });
  await customerRepo.add(customer);
  await em.flush();
  await em.clear(); // limpa o cache do entity manager (unit of work)

  console.log(customer);

  let customerFound = await customerRepo.findById(customer.id);
  console.log(customerFound);
  expect(customerFound.id.equals(customer.id)).toBeTruthy();
  expect(customerFound.name).toBe(customer.name);
  expect(customerFound.cpf.value).toBe('70375887091');

  customer.changeName('Customer 2');
  await customerRepo.add(customer);
  await em.flush();
  await em.clear(); // limpa o cache do entity manager (unit of work)

  customerFound = await customerRepo.findById(customer.id);
  expect(customerFound.id.equals(customer.id)).toBeTruthy();
  expect(customerFound.name).toBe(customer.name);

  console.log(await customerRepo.findAll());

  customerRepo.delete(customer);
  await em.flush();

  console.log(await customerRepo.findAll());

  await orm.close();
});
