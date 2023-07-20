import { Authenticator } from "@app/lib/auth";
import { isDevelopmentOrDustWorkspace } from "@app/lib/development";
import { EventSchema } from "@app/lib/models";
import { EventSchemaType } from "@app/types/extract";

export async function getEventSchemas(
  auth: Authenticator
): Promise<EventSchemaType[]> {
  const owner = auth.workspace();
  if (!owner) {
    return [];
  }

  const schemas = await EventSchema.findAll({
    where: {
      workspaceId: owner.id,
    },
    order: [["marker", "ASC"]],
  });

  return schemas.map((schema): EventSchemaType => {
    return {
      marker: schema.marker,
      description: schema.description,
      status: schema.status,
      properties: schema.properties,
    };
  });
}

export async function getEventSchema(
  auth: Authenticator,
  marker: string
): Promise<EventSchemaType | null> {
  const owner = auth.workspace();
  if (!owner) {
    return null;
  }

  const schema = await EventSchema.findOne({
    where: {
      marker: marker,
      workspaceId: owner.id,
    },
  });

  if (!schema) {
    return null;
  }

  return {
    marker: schema.marker,
    description: schema.description,
    status: schema.status,
    properties: schema.properties,
  };
}

export async function createEventSchema(
  auth: Authenticator,
  marker: string,
  description: string,
  properties: []
): Promise<EventSchemaType | void> {
  const owner = auth.workspace();
  const user = auth.user();
  if (!owner || !user) {
    return;
  }

  const schema = await EventSchema.create({
    marker: marker,
    description: description,
    properties: properties,
    status: "active",
    workspaceId: owner.id,
    debug: isDevelopmentOrDustWorkspace(owner), // @todo Daph schema_debug_feature
    userId: user.id,
  });

  return {
    marker: schema.marker,
    description: schema.description,
    status: schema.status,
    properties: schema.properties,
  };
}

export async function updateEventSchema(
  auth: Authenticator,
  marker: string,
  newMarker: string,
  newDescription: string,
  newProperties: []
): Promise<EventSchemaType | void> {
  const owner = auth.workspace();
  if (!owner) {
    return;
  }

  const schema = await EventSchema.findOne({
    where: {
      marker: marker,
      workspaceId: owner.id,
    },
  });

  if (!schema) {
    return;
  }

  await schema.update({
    marker: newMarker,
    description: newDescription,
    properties: newProperties,
  });

  return {
    marker: schema.marker,
    description: schema.description,
    status: schema.status,
    properties: schema.properties,
  };
}
