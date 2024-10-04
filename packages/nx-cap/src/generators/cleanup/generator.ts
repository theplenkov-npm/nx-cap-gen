import {
  Tree,
  readProjectConfiguration,
  updateProjectConfiguration
} from '@nx/devkit';

import { CleanupGeneratorSchema } from './schema';

export async function bootstrapGenerator(
  tree: Tree,
  options: CleanupGeneratorSchema
) {
  const projectName = options.name;

  console.log('Reading project configuration...');
  const project = readProjectConfiguration(tree, projectName);

  delete project.targets["bootstrap"];
  delete project.targets["cleanup"];

  updateProjectConfiguration(tree, projectName, project)
}

export default bootstrapGenerator;
