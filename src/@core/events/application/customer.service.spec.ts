import { MikroORM, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { CustomerSchema } from '../infra/db/schemas';
import { Customer } from '../domain/entities/customer.entity';
import { CustomerService } from './customer.service';
import { CustomerPgsqlRepository } from '../infra/db/repositories/customer-pgsql.repository';
import { UnitOfWorkMikroOrm } from 'src/@core/common/infra/unit-of-work-mikro-orm';

test('deve listar os customers', async () => {
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
  const unitOfWork = new UnitOfWorkMikroOrm(em);
  const customerRepo = new CustomerPgsqlRepository(em);
  const customerService = new CustomerService(customerRepo, unitOfWork);
  const customer = Customer.create({
    name: 'Customer 1',
    cpf: '70375887091',
  });
  await customerRepo.add(customer);
  await em.flush();
  await em.clear();

  const customers = await customerService.list();
  console.log(customers);
  await orm.close();
});

test('deve registrar um customer', async () => {
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
  const unitOfWork = new UnitOfWorkMikroOrm(em);
  const customerRepo = new CustomerPgsqlRepository(em);
  const customerService = new CustomerService(customerRepo, unitOfWork);

  const customer = await customerService.register({
    name: 'Customer 1',
    cpf: '70375887091',
  });

  expect(customer).toBeInstanceOf(Customer);
  expect(customer.id).toBeDefined();
  expect(customer.name).toBe('Customer 1');
  expect(customer.cpf.value).toBe('70375887091');

  await em.clear();

  const customerFound = await customerRepo.findById(customer.id);
  expect(customerFound).toBeInstanceOf(Customer);
  expect(customerFound.id).toBeDefined();
  expect(customerFound.name).toBe('Customer 1');
  expect(customerFound.cpf.value).toBe('70375887091');

  await orm.close();
});
