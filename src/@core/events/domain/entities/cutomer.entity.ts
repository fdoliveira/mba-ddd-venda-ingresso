import { AggregateRoot } from 'src/@core/common/domain/aggragate-root';
import Cpf from 'src/@core/common/domain/value-object/cpf.vo';
import Uuid from 'src/@core/common/domain/value-object/uuid.vo';

export class CustomerId extends Uuid {}

export type CustomerConstructorProps = {
  id?: CustomerId | string;
  cpf: Cpf;
  name: string;
};

export class Customer extends AggregateRoot {
  id: CustomerId;
  cpf: Cpf;
  name: string;

  constructor(customerProps: CustomerConstructorProps) {
    super();
    this.id =
      customerProps.id instanceof CustomerId
        ? customerProps.id
        : new CustomerId(customerProps.id);
    this.cpf = customerProps.cpf;
    this.name = customerProps.name;
  }

  static create(command: { name: string; cpf: string }) {
    return new Customer({
      name: command.name,
      cpf: new Cpf(command.cpf),
    });
  }

  toJSON() {
    return {
      id: this.id,
      cpf: this.cpf,
      name: this.name,
    };
  }
}
