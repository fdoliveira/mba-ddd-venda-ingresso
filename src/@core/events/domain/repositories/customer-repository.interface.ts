import { IRepository } from '../../../common/domain/repository-interface';
import { Customer } from '../entities/cutomer.entity';

export interface ICustomerRepository extends IRepository<Customer> {}
