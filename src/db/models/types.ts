import { models } from "../index";

type ModelsType = typeof models;
export type ModelInstances = { [K in keyof ModelsType]: InstanceType<ModelsType[K]> };
