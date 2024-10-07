import { createWorkspace, CreateWorkspaceOptions } from 'create-nx-workspace';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { type BoostrapGeneratorSchema } from 'nx-cap';

async function main() {
  type Options = BoostrapGeneratorSchema & CreateWorkspaceOptions;

  const argv = await yargs(hideBin(process.argv), 'create a new CAP(CDS) workspace')
    .command('<name>', 'create a new CAP(CDS) workspace')
    .demandCommand(1, 'Please specify the name of the workspace to create.')
    .option('name', {
      description: 'CAP project name',
      type: 'string',
    })
    .option('path', {
      description: 'Path (relative to the workspace root) where to create CAP projects',
      type: 'string',
    })
    .option('features', {
      description: 'Comma-delimited list of features to add to the cap project ( see "cds add --help" for more information )',
      type: 'string',
    })
    // .option('interactive', {
    //   description: 'Enable interactive mode',
    //   type: 'boolean',
    // })
    .group(['name', 'features'], 'CAP project options:')
    .help()
    .parse();

  const options: Options = {
    name: argv._[0] as string,
    nxCloud: 'skip',
    packageManager: 'npm',
    // interactive: argv.interactive
  };

  // TODO: update below to customize the workspace
  const { directory } = await createWorkspace(
    `nx-cap`,
    Object.assign(argv, options)
  );

  console.log(`Successfully created the workspace: ${directory}.`);
}

main();
