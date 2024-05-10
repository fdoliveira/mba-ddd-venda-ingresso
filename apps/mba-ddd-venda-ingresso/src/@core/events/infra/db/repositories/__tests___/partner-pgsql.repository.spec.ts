import { MikroORM, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { PartnerPgsqlRepository } from '../partner-pgsql.repository';
import { Partner } from 'src/@core/events/domain/entities/partner.entity';
import { PartnerSchema } from '../../schemas';

test('partner repository', async () => {
  const orm = await MikroORM.init<PostgreSqlDriver>({
    entities: [PartnerSchema],
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
  const partnerRepo = new PartnerPgsqlRepository(em);

  const partner = Partner.create({ name: 'Partner 1' });
  await partnerRepo.add(partner);
  await em.flush();
  await em.clear(); // limpa o cache do entity manager (unit of work)

  let partnerFound = await partnerRepo.findById(partner.id);
  expect(partnerFound.id.equals(partner.id)).toBeTruthy();
  expect(partnerFound.name).toBe(partner.name);

  partner.changeName('Partner 2');
  await partnerRepo.add(partner);
  await em.flush();
  await em.clear(); // limpa o cache do entity manager (unit of work)

  partnerFound = await partnerRepo.findById(partner.id);
  expect(partnerFound.id.equals(partner.id)).toBeTruthy();
  expect(partnerFound.name).toBe(partner.name);

  console.log(await partnerRepo.findAll());

  partnerRepo.delete(partner);
  await em.flush();

  console.log(await partnerRepo.findAll());

  await orm.close();
});
