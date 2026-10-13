import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform<string> {
  transform(value: string): string {
    if (!isValidObjectId(value)) {
      throw new BadRequestException(
        `"${value}" n'est pas un identifiant MongoDB valide.`,
      );
    }
    return value;
  }
}
