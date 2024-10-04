import { createWorkspace, CreateWorkspaceOptions } from 'create-nx-workspace';
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { type BoostrapGeneratorSchema } from 'nx-cap';

async function main() {

  const name = process.argv[2]; // TODO: use libraries like yargs or enquirer to set your workspace name
  if (!name) {
    throw new Error('Please provide a name for the workspace');
  }

  type Options = BoostrapGeneratorSchema & CreateWorkspaceOptions;

  const argv = await yargs(hideBin(process.argv))
    .parse();

  console.log(`Creating the workspace: ${name}`);

  const options: Options = {
    name,
    nxCloud: 'skip',
    packageManager: 'npm',
  }

  // TODO: update below to customize the workspace
  const { directory } = await createWorkspace(`nx-cap`, Object.assign(argv, options));

  console.log(`Successfully created the workspace: ${directory}.`);
}

main();
