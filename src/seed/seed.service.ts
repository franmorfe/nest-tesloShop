import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../auth/entities/user.entity';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { Repository } from 'typeorm';


@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,

    @InjectRepository( User )
    private readonly userRepository: Repository<User>,
  ) {}
  
  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.populateUsers();
    await this.populateProducts( adminUser );
    return 'Seed executed!'
  }

  private async deleteTables() {

    await this.productsService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute()

  };


  private async populateUsers() {

    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach( user => {
      user.password = bcrypt.hashSync( user.password, 10 );
      users.push( this.userRepository.create( user ) )
    });

    await this.userRepository.save( users );

    return users[0];

  }


  private async populateProducts( user: User ) {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach( product => {
      insertPromises.push(this.productsService.create( product, user ));
    });

    await Promise.all( insertPromises );

  }
}
