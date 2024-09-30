import {
  addProjectConfiguration,
  formatFiles,
  ProjectConfiguration,
  runExecutor,
  runTasksInSerial,
  TargetConfiguration,
  Tree,
  readProjectConfiguration,
  updateProjectConfiguration,
} from '@nx/devkit';

import * as path from 'path';
import { BoostrapGeneratorSchema } from './schema';

import { RunCommandsOptions } from 'nx/src/executors/run-commands/run-commands.impl';

export async function presetGenerator(
  tree: Tree,
  options: BoostrapGeneratorSchema
) {
  const projectName = options.name;
  const projectRoot = path.join('projects', projectName);

  console.log('Generating project configuration...');

  if (options.features) {
    console.log('Adding features to project configuration...');
  }

  const commands = [`npm init -y`];

  if (options.features) {
    commands.push(`npx cds add ${options.features.join(',')}`);
  }

  const bootstrap: TargetConfiguration<RunCommandsOptions> = {
    options: {
      commands,
      parallel: false,
      color: true,
      __unparsed__: [],
      cwd: projectRoot,
    },
    executor: 'nx:run-commands',
  };

  const project: ProjectConfiguration = {
    name: projectName,
    root: projectRoot,
    projectType: 'application',
    targets: {
      bootstrap,
    },
  };

  addProjectConfiguration(tree, projectName, project);
  await formatFiles(tree);

  // follow-up tasks
  return runTasksInSerial(bootstrapProject);

  async function bootstrapProject() {
    console.log('Bootstrapping project...');
    const projectRoot = path.join('projects', projectName);
    const project = readProjectConfiguration(tree, projectName);

    const tasks = await runExecutor(
      {
        target: 'bootstrap',
        project: projectName,
      },
      {},
      {
        cwd: path.join(tree.root, projectRoot),
        isVerbose: process.argv.includes('--verbose'),
        root: tree.root,
        projectsConfigurations: {
          version: 0,
          projects: {
            [projectName]: project,
          },
        },
      }
    );

    //all tasks must be finished
    for await (const task of tasks) {
    }
  }

  // async function removeBootstrapTarget(): Promise<void> {
  //   console.log('Removing bootstrap target from project configuration...');
  //   const project = readProjectConfiguration(tree, projectName);
  //   delete project?.targets?.['bootstrap'];
  //   updateProjectConfiguration(tree, projectName, project);
  //   await formatFiles(tree);
  // }
}

export default presetGenerator;
