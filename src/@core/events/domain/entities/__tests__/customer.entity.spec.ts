import Cpf from 'src/@core/common/domain/value-object/cpf.vo';
import { Customer, CustomerId } from '../cutomer.entity';

test('deve criar um cliente', () => {
  const customer = Customer.create({
    name: 'João',
    cpf: '99346413050',
  });
  console.log(customer);
  expect(customer).toBeInstanceOf(Customer);
  expect(customer.id).toBeDefined();
  expect(customer.id).toBeInstanceOf(CustomerId);
  expect(customer.name).toBe('João');
  expect(customer.cpf.value).toBe('99346413050');

  const customer2 = new Customer({
    id: new CustomerId(customer.id.value),
    name: 'João xpto',
    cpf: new Cpf('703.758.870-91'),
  });

  console.log(customer.equals(customer2));
});
