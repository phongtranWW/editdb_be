import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    let finalException: HttpException;

    if (exception.code === 11000) {
      finalException = new ConflictException('Duplicate key error');
    } else {
      finalException = new InternalServerErrorException(exception.message);
    }

    const status = finalException.getStatus();
    const resBody = finalException.getResponse();

    response.status(status).json({
      statusCode: status,
      error: resBody,
    });
  }
}
