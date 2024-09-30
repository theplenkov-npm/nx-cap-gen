import {
  addProjectConfiguration,
  formatFiles,
  ProjectConfiguration,
  runExecutor,
  runTasksInSerial,
  TargetConfiguration,
  Tree,
  readProjectConfiguration,
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

  const commands: string[] = [
    `npm init -y`,
    // `npm install -D @sap/cds-dk`,
    // `npm install @sap/cds`,
  ];

  if (options.features) {
    commands.push(`npx cds add ${options.features.join(',')}`);
  }

  const bootstrap: TargetConfiguration<RunCommandsOptions> = {
    options: {
      commands,
      parallel: false,
      color: true,
      __unparsed__: [],
      cwd: path.join(tree.root, projectRoot),
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
  return runTasksInSerial(createNewProject, bootstrapProject);
  async function createNewProject() {}
  async function bootstrapProject() {
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
}

export default presetGenerator;
