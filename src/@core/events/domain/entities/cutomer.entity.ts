import { AggregateRoot } from 'src/@core/common/domain/aggragate-root';

export type CustomerConstructorProps = {
  id?: number;
  cpf: string;
  name: string;
};

export class Customer extends AggregateRoot {
  id: number;
  cpf: string;
  name: string;

  constructor(customerProps: CustomerConstructorProps) {
    super();
    this.id = customerProps.id;
    this.cpf = customerProps.cpf;
    this.name = customerProps.name;
  }

  static create(command: { cpf: string; name: string }) {
    return new Customer(command);
  }

  toJSON() {
    return {
      id: this.id,
      cpf: this.cpf,
      name: this.name,
    };
  }
}
