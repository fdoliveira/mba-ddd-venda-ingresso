import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Global, Module } from '@nestjs/common';
import {
  CustomerSchema,
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  OrderSchema,
  PartnerSchema,
  SpotReservationSchema,
} from '../@core/events/infra/db/schemas';
import { EntityManager } from '@mikro-orm/postgresql';
import { UnitOfWorkMikroOrm } from '../@core/common/infra/unit-of-work-mikro-orm';
import { StoredEventSchema } from 'src/@core/stored-events/infra/db/schemas';

@Global()
@Module({
  imports: [
    MikroOrmModule.forRoot({
      entities: [
        CustomerSchema,
        PartnerSchema,
        EventSchema,
        EventSectionSchema,
        EventSpotSchema,
        OrderSchema,
        SpotReservationSchema,
        StoredEventSchema,
      ],
      dbName: 'postgres',
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'postgrespw',
      type: 'postgresql',
      forceEntityConstructor: true,
    }),
  ],
  providers: [
    {
      provide: 'IUnitOfWork',
      useFactory(em: EntityManager) {
        return new UnitOfWorkMikroOrm(em);
      },
      inject: [EntityManager],
    },
  ],
  exports: ['IUnitOfWork'],
})
export class DatabaseModule {}
