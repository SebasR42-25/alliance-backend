import { PartialType } from '@nestjs/swagger';
import { CreateCompanyDto } from './create-company.dto';

// PartialType hace que todas las propiedades de CreateCompanyDto sean opcionales
export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}
