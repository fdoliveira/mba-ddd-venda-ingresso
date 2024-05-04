import { MikroORM, PostgreSqlDriver } from '@mikro-orm/postgresql';
import {
  CustomerSchema,
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  OrderSchema,
  PartnerSchema,
  SpotReservationSchema,
} from '../infra/db/schemas';
import { CustomerPgsqlRepository } from '../infra/db/repositories/customer-pgsql.repository';
import { Customer } from '../domain/entities/customer.entity';
import { UnitOfWorkMikroOrm } from '../../common/infra/unit-of-work-mikro-orm';
import { PartnerPgsqlRepository } from '../infra/db/repositories/partner-pgsql.repository';
import { Partner } from '../domain/entities/partner.entity';
import { EventPgsqlRepository } from '../infra/db/repositories/event-pgsql.repository';
// import { OrderService } from './order.service';
// import { OrderPgsqlRepository } from '../infra/db/repositories/order-pgsql.repository';
// import { SpotReservationPgsqlRepository } from '../infra/db/repositories/spot-reservation-pgsql.repository';

test('deve criar uma order', async () => {
  const orm = await MikroORM.init<PostgreSqlDriver>({
    entities: [
      CustomerSchema,
      PartnerSchema,
      EventSchema,
      EventSectionSchema,
      EventSpotSchema,
      OrderSchema,
      SpotReservationSchema,
    ],
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
  const partnerRepo = new PartnerPgsqlRepository(em);
  const eventRepo = new EventPgsqlRepository(em);
  const customer = Customer.create({
    name: 'Customer 1',
    cpf: '70375887091',
  });
  await customerRepo.add(customer);

  const partner = Partner.create({
    name: 'Partner 1',
  });
  await partnerRepo.add(partner);

  const event = partner.initEvent({
    name: 'Event 1',
    description: 'Event 1',
    date: new Date(),
  });

  event.addSection({
    name: 'Section 1',
    description: 'Section 1',
    price: 100,
    total_spots: 1000,
  });

  event.publishAll();

  await eventRepo.add(event);

  await unitOfWork.commit();
  await em.clear();

  // const orderRepo = new OrderPgsqlRepository(em);
  // const spotReservationRepo = new SpotReservationPgsqlRepository(em);
  // const orderService = new OrderService(
  //   orderRepo,
  //   customerRepo,
  //   eventRepo,
  //   spotReservationRepo,
  //   unitOfWork,
  // );

  // const op1 = orderService.create({
  //   event_id: event.id.value,
  //   section_id: event.sections[0].id.value,
  //   customer_id: customer.id.value,
  //   spot_id: event.sections[0].spots[0].id.value,
  // });

  // const op2 = orderService.create({
  //   event_id: event.id.value,
  //   section_id: event.sections[0].id.value,
  //   customer_id: customer.id.value,
  //   spot_id: event.sections[0].spots[0].id.value,
  // });

  // try {
  //   await Promise.all([op1, op2]);
  // } catch (e) {
  //   console.log(e);
  //   console.log(await orderRepo.findAll());
  //   console.log(await spotReservationRepo.findAll());
  // }

  await orm.close();
});
