import slugify from 'slugify';
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'


@Entity()
export class Product {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  title: string;

  @Column('float', {
    default: 0,
  })
  price: number;

  @Column('text', {
    nullable: true,
  })
  description: string;

  @Column('text', {
    unique: true,
  })
  slug: string;

  @Column('int', {
    default: 0,
  })
  stock: number;

  @Column('text', {
    array: true,
  })
  sizes: string[];

  @Column('text')
  gender: string;

  @Column('text', {
    array: true,
    default: []
  })
  tags: string[];


  @BeforeInsert()
  checkSlugInsert() {
    if( !this.slug ) {
       this.slug = this.title; 
    }

    this.slug = slugify(this.slug, {lower: true, remove: /[*+~.()'"!:@]/g});
  }

  @BeforeUpdate()
  chechSlugUpdate() {
    this.slug = slugify(this.slug, {lower: true, remove: /[*+~.()'"!:@]/g});
  }

}
