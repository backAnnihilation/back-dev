import { ApiProperty } from '@nestjs/swagger';

interface FieldConfig {
  description: string;
  example: any;
  nullable?: boolean;
}
type FieldsConfig = Record<string, FieldConfig>;

export const createErrorMessageDto = (fieldsConfig: FieldsConfig) => {
  class DynamicDto {}

  for (const [fieldName, config] of Object.entries(fieldsConfig)) {
    ApiProperty({
      description: config.description,
      example: config.example,
      nullable: config.nullable ?? true,
    })(DynamicDto.prototype, fieldName);
  }

  return DynamicDto;
};
