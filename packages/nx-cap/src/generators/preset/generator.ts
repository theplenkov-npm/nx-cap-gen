import {
  runTasksInSerial,
  Tree,
} from '@nx/devkit';
import { PresetGeneratorSchema } from './schema';
import bootstrapGenerator from '../bootstrap/generator';


export async function presetGenerator(
  tree: Tree,
  options: PresetGeneratorSchema
) {

  return runTasksInSerial(await bootstrapGenerator(tree, options));
}

export default presetGenerator;
