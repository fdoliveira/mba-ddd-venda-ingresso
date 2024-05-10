import { MikroORM, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { CustomerSchema, PartnerSchema } from './schemas';
import { Partner } from 'src/@core/events/domain/entities/partner.entity';
import { Customer } from 'src/@core/events/domain/entities/customer.entity';

test('deve criar um partner', async () => {
  const orm = await MikroORM.init<PostgreSqlDriver>({
    entities: [PartnerSchema],
    dbName: 'postgres',
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgrespw',
    forceEntityConstructor: true,
  });
  await orm.schema.refreshDatabase();
  const em = orm.em.fork();

  const partner = Partner.create({ name: 'Partner 1' });
  console.log(partner.id);
  em.persist(partner);
  await em.flush();
  await em.clear(); // limpa o cache do entity manager (unit of work)

  const partnerFound = await em.findOne(Partner, { id: partner.id });
  console.log(partnerFound);
  await orm.close();
});

test('deve criar um customer', async () => {
  const orm = await MikroORM.init<PostgreSqlDriver>({
    entities: [CustomerSchema],
    dbName: 'postgres',
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgrespw',
    forceEntityConstructor: true,
  });
  await orm.schema.refreshDatabase();
  const em = orm.em.fork();

  const customer = Customer.create({
    name: 'Customer 1',
    cpf: '703.758.870-91',
  });
  console.log(customer);
  em.persist(customer);
  await em.flush();
  await em.clear(); // limpa o cache do entity manager (unit of work)

  const customerFound = await em.findOne(Customer, { id: customer.id });
  console.log('customerFoud', customerFound);

  await orm.close();
});
