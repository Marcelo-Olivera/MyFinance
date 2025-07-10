// myfinance-app/backend/src/database/seeds/admin-seeder.ts
import 'dotenv/config'; // Importa e carrega as variáveis de ambiente do .env
import { DataSource } from 'typeorm'; // Importe DataSource do typeorm
import * as bcrypt from 'bcryptjs';
import { User } from '../../auth/entities/user.entity'; // Caminho para sua entidade User
import { UserRole } from '../../auth/enums/user-role.enum'; // Caminho para seu enum UserRole
import { Logger } from '@nestjs/common'; // Para logs

async function seedAdmin() {
  const logger = new Logger('AdminSeeder');

  // Configuração do TypeORM para o script de seeder
  // Deve ser compatível com a configuração do seu AppModule.ts
  const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'db.sqlite', // Nome do banco de dados SQLite
    entities: [User], // Adicione todas as entidades que o seeder pode precisar, neste caso, User
    synchronize: true, // Apenas para garantir que a tabela existe, pode ser false se já tiver certeza
  });

  try {
    await AppDataSource.initialize();
    logger.log('Conexão com o banco de dados inicializada para o seeder.');

    const usersRepository = AppDataSource.getRepository(User);

    const adminEmail = 'admin@myfinance.com'; // Email do admin
    const adminPassword = 'adminpassword123'; // Senha do admin (MUITO FORTE EM PRODUÇÃO!)

    // 1. Verificar se o admin já existe
    const existingAdmin = await usersRepository.findOneBy({ email: adminEmail });

    if (existingAdmin) {
      logger.warn(`Usuário administrador com email '${adminEmail}' já existe. Ignorando.`);
      await AppDataSource.destroy();
      return;
    }

    // 2. Hash da senha do admin
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // 3. Criar e salvar o novo usuário administrador
    const adminUser = usersRepository.create({
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.ADMIN, // Definindo o papel como ADMIN
    });

    await usersRepository.save(adminUser);
    logger.log(`Usuário administrador '${adminEmail}' criado com sucesso.`);

  } catch (error) {
    logger.error('Erro ao semear usuário administrador:', error.message);
    logger.error(error.stack); // Mostra o stack trace para depuração
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      logger.log('Conexão com o banco de dados encerrada.');
    }
  }
}

seedAdmin(); // Executa a função de seeder