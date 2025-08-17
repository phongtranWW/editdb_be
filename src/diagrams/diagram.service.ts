import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Diagram } from './schemas/diagram.schema';
import { FilterQuery, Model } from 'mongoose';
import { CreateDiagramDto } from './dtos/request/create-diagram.dto';
import { UpdateDiagramDto } from './dtos/request/update-diagram.dto';
import { SummaryDiagramDto } from './dtos/response/summary-diagram.dto';
import { DiagramDto } from './dtos/response/diagram.dto';
import { UpdateShareSettingsDto } from './dtos/request/update-share-setting.dto';

@Injectable()
export class DiagramService {
  constructor(
    @InjectModel(Diagram.name) private diagramModel: Model<Diagram>,
  ) {}

  async findSummaryDiagrams(
    filter: FilterQuery<Diagram>,
  ): Promise<SummaryDiagramDto[]> {
    const diagrams = await this.diagramModel
      .find(filter)
      .select('_id name description visibility createdAt updatedAt')
      .lean()
      .exec();

    return diagrams.map((d) => ({
      id: d._id.toString(),
      name: d.name,
      description: d.description,
      visibility: d.visibility,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    }));
  }

  async findDiagramById(filter: FilterQuery<Diagram>): Promise<DiagramDto> {
    const diagram = await this.diagramModel
      .findOne(filter)
      .select('-__v')
      .lean()
      .exec();

    if (!diagram) {
      throw new NotFoundException('Diagram not found');
    }

    return {
      id: diagram._id.toString(),
      name: diagram.name,
      description: diagram.description,
      tables: diagram.tables,
      relationships: diagram.relationships,
      visibility: diagram.visibility,
      createdAt: diagram.createdAt,
      updatedAt: diagram.updatedAt,
    };
  }

  async create(userId: string, dto: CreateDiagramDto): Promise<DiagramDto> {
    try {
      const diagram = new this.diagramModel({ ...dto, userId });
      await diagram.save();

      return {
        id: diagram._id.toString(),
        name: diagram.name,
        description: diagram.description,
        tables: diagram.tables,
        relationships: diagram.relationships,
        visibility: diagram.visibility,
        createdAt: diagram.createdAt,
        updatedAt: diagram.updatedAt,
      };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateDiagramDto,
  ): Promise<DiagramDto> {
    const diagram = await this.diagramModel.findOne({ _id: id, userId });
    if (!diagram) {
      throw new NotFoundException('Diagram not found');
    }
    try {
      const updatedDiagram = await this.diagramModel.findByIdAndUpdate(
        id,
        dto,
        { new: true },
      );

      return {
        id: updatedDiagram!._id.toString(),
        name: updatedDiagram!.name,
        description: updatedDiagram!.description,
        tables: updatedDiagram!.tables,
        relationships: updatedDiagram!.relationships,
        visibility: updatedDiagram!.visibility,
        createdAt: updatedDiagram!.createdAt,
        updatedAt: updatedDiagram!.updatedAt,
      };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: string, userId: string): Promise<void> {
    const diagram = await this.diagramModel.findOne({ _id: id, userId });
    if (!diagram) {
      throw new NotFoundException('Diagram not found');
    }
    try {
      await this.diagramModel.findByIdAndDelete(id);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateShareSettings(
    id: string,
    userId: string,
    dto: UpdateShareSettingsDto,
  ): Promise<DiagramDto> {
    const diagram = await this.diagramModel
      .findOne({ _id: id, userId })
      .select('-__v')
      .exec();
    if (!diagram) {
      throw new NotFoundException('Diagram not found');
    }

    try {
      const updatedDiagram = await this.diagramModel.findByIdAndUpdate(
        id,
        dto,
        { new: true },
      );

      return {
        id: updatedDiagram!._id.toString(),
        name: updatedDiagram!.name,
        description: updatedDiagram!.description,
        tables: updatedDiagram!.tables,
        relationships: updatedDiagram!.relationships,
        visibility: updatedDiagram!.visibility,
        createdAt: updatedDiagram!.createdAt,
        updatedAt: updatedDiagram!.updatedAt,
      };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new InternalServerErrorException(error.message);
    }
  }
}
