import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class QueryJobDto {
  @ApiProperty({ example: 'Developer', required: false })
  @IsString()
  @IsOptional()
  title?: string;
  @ApiProperty({ example: 'Cali', required: false })
  @IsString()
  @IsOptional()
  location?: string;
}
