import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import express from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<express.Response>();
    const request = ctx.getRequest<express.Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let title = 'Internal Server Error';
    let detail = 'Une erreur interne est survenue.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      title = this.titleForStatus(status);
      detail = this.extractDetail(exception.getResponse());
    } else if (this.isPayloadTooLarge(exception)) {
      status = HttpStatus.PAYLOAD_TOO_LARGE;
      title = this.titleForStatus(status);
      detail = 'Le corps de la requete depasse la taille maximale autorisee.';
    } else if (this.isDuplicateKey(exception)) {
      status = HttpStatus.CONFLICT;
      title = this.titleForStatus(status);
      detail = 'Une ressource avec les memes valeurs uniques existe deja.';
    } else {
      this.logger.error(
        exception instanceof Error ? exception.stack : exception,
      );
    }

    response.status(status).type('application/problem+json').json({
      type: 'about:blank',
      title,
      status,
      detail,
      instance: request.url,
    });
  }

  private isPayloadTooLarge(exception: unknown): boolean {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'type' in exception &&
      (exception as { type?: unknown }).type === 'entity.too.large'
    );
  }

  private isDuplicateKey(exception: unknown): boolean {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception &&
      (exception as { code?: unknown }).code === 11000
    );
  }

  private titleForStatus(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'Bad Request';
      case HttpStatus.NOT_FOUND:
        return 'Not Found';
      case HttpStatus.CONFLICT:
        return 'Conflict';
      case HttpStatus.PAYLOAD_TOO_LARGE:
        return 'Payload Too Large';
      case HttpStatus.TOO_MANY_REQUESTS:
        return 'Too Many Requests';
      default:
        return 'Error';
    }
  }

  private extractDetail(res: string | object): string {
    if (typeof res === 'string') {
      return res;
    }
    if (typeof res === 'object' && res !== null && 'message' in res) {
      const message = (res as { message: unknown }).message;
      return Array.isArray(message) ? message.join('; ') : String(message);
    }
    return 'Une erreur est survenue.';
  }
}
