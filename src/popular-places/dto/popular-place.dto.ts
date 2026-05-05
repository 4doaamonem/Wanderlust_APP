import { ApiProperty } from '@nestjs/swagger';

export class PopularPlaceDto {
  @ApiProperty({ example: 'Pyramids of Giza' })
  name: string;

  @ApiProperty({ example: 'Ancient Egyptian pyramids and sphinx complex' })
  description: string;

  @ApiProperty({ example: 'https://example.com/pyramids-giza.jpg' })
  photo: string;
}
