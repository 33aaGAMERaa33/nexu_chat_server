import { ContactRequestsEntity } from 'src/contact_requests/contact_requests.entity';
import { ContactsEntity } from 'src/contacts/contacts.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Unique, ManyToOne, OneToMany } from 'typeorm';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false})
  username: string;
  
  @Unique(["email"])
  @Column({ nullable: false })
  email: string;
  
  @Column({nullable: false})
  password: string;

  @CreateDateColumn({type: 'timestamp'})
  created_at: Date;

  @UpdateDateColumn({type: 'timestamp'})
  updated_at: Date;

  @OneToMany(() => ContactRequestsEntity, (contactRequest) => contactRequest.sender)
  sentRequests: ContactRequestsEntity[];

  @OneToMany(() => ContactRequestsEntity, (contactRequest) => contactRequest.receiver)
  receivedRequests: ContactRequestsEntity[];


  @Column({type: "varchar", length: 500})
  token: string;
}
