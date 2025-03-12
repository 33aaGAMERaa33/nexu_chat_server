import { UsersEntity } from 'src/users/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum ContactRequestStatus {
  accepted = "accepted",
  rejected = "rejected",
  pending = "pending",
}

@Entity('contact_requests')
export class ContactRequestsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Relação ManyToOne corrigida
  @ManyToOne(() => UsersEntity, { nullable: false})
  @JoinColumn({ name: "sender"})
  sender: UsersEntity; // Tipo alterado para UsersEntity

  // Relação ManyToOne corrigida
  @ManyToOne(() => UsersEntity, { nullable: false })
  @JoinColumn({ name: "receiver" })
  receiver: UsersEntity; // Tipo alterado para UsersEntity

  @Column({ type: "enum", enum: ContactRequestStatus, default: ContactRequestStatus.pending })
  status: ContactRequestStatus;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}