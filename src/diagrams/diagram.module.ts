import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Diagram, DiagramSchema } from './schemas/diagram.schema';
import { DiagramService } from './diagram.service';
import { DiagramController } from './diagram.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Diagram.name, schema: DiagramSchema }]),
  ],
  providers: [DiagramService],
  controllers: [DiagramController],
})
export class DiagramModule {}
