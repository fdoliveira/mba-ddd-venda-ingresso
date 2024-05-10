import { Module } from '@nestjs/common';
import { ApplicationService } from 'src/@core/common/application/application.service';
import { IUnitOfWork } from 'src/@core/common/application/unit-of-work.interface';
import { DomainEventManager } from 'src/@core/common/domain/domain-event-manager';

@Module({
  providers: [
    {
      provide: ApplicationService,
      useFactory: (
        uow: IUnitOfWork,
        domainEventManager: DomainEventManager,
      ) => {
        return new ApplicationService(uow, domainEventManager);
      },
      inject: ['IUnitOfWork', DomainEventManager],
    },
  ],
  exports: [ApplicationService],
})
export class ApplicationModule {}
