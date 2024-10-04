import {
  addProjectConfiguration,
  formatFiles,
  ProjectConfiguration,
  runExecutor,
  runTasksInSerial,
  TargetConfiguration,
  Tree,
  ExecutorContext
} from '@nx/devkit';

import * as path from 'path';
import { BoostrapGeneratorSchema } from './schema';

import { RunCommandsOptions } from 'nx/src/executors/run-commands/run-commands.impl';

export async function bootstrapGenerator(
  tree: Tree,
  options: BoostrapGeneratorSchema
) {
  const projectName = options.name;
  const projectRoot = options.path || path.join('projects', projectName);

  console.log('Generating project configuration...');

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

  const cleanup: TargetConfiguration<RunCommandsOptions> = {
    options: {
      command: [`npx nx g nx-cap:cleanup --name ${projectName}`],
      __unparsed__: []
    },
    executor: 'nx:run-commands',
  };

  const project: ProjectConfiguration = {
    name: projectName,
    root: projectRoot,
    projectType: 'application',
    targets: {
      bootstrap,
      cleanup
    },
  };

  addProjectConfiguration(tree, projectName, project);
  await formatFiles(tree);

  // follow-up tasks
  return runTasksInSerial(bootstrapProject, cleanupProject);

  async function bootstrapProject() {

    console.log('Bootstrapping project...');

    return runProjectTask('bootstrap');
  }

  async function cleanupProject() {

    console.log('Cleaning up bootstrapped project...');

    return runProjectTask('cleanup');
  }

  async function runProjectTask(target: string) {

    const context = {
      cwd: path.join(tree.root, projectRoot),
      isVerbose: process.argv.includes('--verbose'),
      root: tree.root,
      projectsConfigurations: {
        version: 0,
        projects: {
          [projectName]: project,
        },
      },
    } satisfies ExecutorContext;

    const tasks = await runExecutor(
      {
        target,
        project: projectName,
      }, {},
      context,
    );

    //all tasks must be finished
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for await (const _task of tasks) {
      //we need to make sure no more pending commands
    }
  }

}

export * from './schema';
export default bootstrapGenerator;
