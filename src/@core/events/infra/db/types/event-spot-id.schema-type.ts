/* eslint-disable @typescript-eslint/no-unused-vars */
import { Type, Platform, EntityProperty } from '@mikro-orm/core';
import { EventSpotId } from 'src/@core/events/domain/entities/event-spot.entity';

export class EventSpotIdSchemaType extends Type<EventSpotId, string> {
  convertToDatabaseValue(
    valueObject: EventSpotId | undefined | null,
    platform: Platform,
  ): string {
    return valueObject instanceof EventSpotId
      ? valueObject.value
      : (valueObject as string);
  }

  //não funciona para relacionamentos
  convertToJSValue(value: string, platform: Platform): EventSpotId {
    return new EventSpotId(value);
  }

  getColumnType(prop: EntityProperty, platform: Platform) {
    return `varchar(36)`;
  }
}
