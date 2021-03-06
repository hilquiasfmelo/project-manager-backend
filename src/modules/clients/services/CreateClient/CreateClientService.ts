import { AppError } from '@shared/errors/AppError';
import { Client } from '@modules/clients/entities/Client';
import { ClientRepository } from '@modules/clients/repositories/implementations/ClientRepository';
import { IClientRepository } from '@modules/clients/repositories/interfaces/IClientRepository';

interface IRequest {
  name: string;
  email: string;
  telephone: string;
  cpf: string;
}

export class CreateClientService {
  private clientRepository: IClientRepository;

  constructor(clientRepository: ClientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute({ name, email, telephone, cpf }: IRequest): Promise<Client> {
    const clientEmailExists = await this.clientRepository.findByEmail(email);
    const clientCpfExists = await this.clientRepository.findByCPF(cpf);

    if (clientEmailExists || clientCpfExists) {
      throw new AppError(
        'There is already a client registered with this email or cpf.',
      );
    }

    const newClient = await this.clientRepository.create({
      name,
      email,
      telephone,
      cpf,
    });

    return newClient;
  }
}
