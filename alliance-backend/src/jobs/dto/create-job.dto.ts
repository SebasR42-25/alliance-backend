import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsMongoId,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty({ example: 'Ingeniero de Software Backend' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '65239e23849...',
    description: 'ID de la empresa en Mongo',
  })
  @IsMongoId({ message: 'El ID de la empresa no es válido' }) // Premisa 2: Validación de flujo
  @IsNotEmpty()
  company: string;

  @ApiProperty({ example: 'Cali, Valle del Cauca' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: ['NestJS', 'Microservicios'], required: false })
  @IsArray()
  @IsOptional()
  tags?: string[];
}
