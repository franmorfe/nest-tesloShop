import { ApiProperty } from '@nestjs/swagger';
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, OptimisticLockVersionMismatchError, PrimaryGeneratedColumn } from 'typeorm'
import slugify from 'slugify';
import { User } from '../../auth/entities/user.entity';
import { ProductImage } from './product-image.entity';


@Entity({ name: 'products' })
export class Product {

  @ApiProperty({ 
    example: '3a29508e-3541-4763-a658-47e35af38a92',
    description: 'Product ID',
    uniqueItems: true
   })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ 
    example: 'T-Shirt Teslo',
    description: 'Product title',
    uniqueItems: true
   })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({ 
    example: 0,
    description: 'Product price'
   })
  @Column('float', {
    default: 0,
  })
  price: number;

  @ApiProperty({ 
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    description: 'Product description',
    default: null
   })
  @Column('text', {
    nullable: true,
  })
  description: string;

  @ApiProperty({ 
    example: 't-shirt-teslo',
    description: 'Product slug for SEO',
    default: null
   })
  @Column('text', {
    unique: true,
  })
  slug: string;

  @ApiProperty({ 
    example: 10,
    description: 'Product stock',
    default: 0
  })
  @Column('int', {
    default: 0,
  })
  stock: number;

  @ApiProperty({ 
    example: ['M', 'S', 'L', 'XL'],
    description: 'Product sizes'
  })
  @Column('text', {
    array: true,
  })
  sizes: string[];

  @ApiProperty({ 
    example: ['man', 'woman', 'kid', 'unisex'],
    description: 'Product gender'
  })
  @Column('text')
  gender: string;

  @ApiProperty({ 
    example: ['t-shirt', 'shoes', 'kid', 'jeans'],
    description: 'Product tags'
  })
  @Column('text', {
    array: true,
    default: []
  })
  tags: string[];

  @OneToMany(
    () => ProductImage,
    productImage => productImage.product,
    { cascade: true, eager: true } 
  )
  images?: ProductImage[];

  @ManyToOne(
    () => User,
    ( user ) => user.product,
    { eager: true }
  )
  user: User;



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
