import { IsNotEmpty, IsUUID } from 'class-validator';

export class MarcarQrDto {
  @IsUUID('4')
  @IsNotEmpty()
  sesionId: string;
}
