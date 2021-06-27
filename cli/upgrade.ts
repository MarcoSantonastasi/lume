import {
  getCurrentVersion,
  getLastDevelopmentVersion,
  getLastVersion,
} from "./utils.ts";
import { brightGreen, gray } from "../deps/colors.ts";

interface Options {
  dev: boolean;
}

/**
 * Upgrade the lume installation to the latest version
 */
export default async function upgrade({ dev }: Options) {
  const latest = dev
    ? await getLastDevelopmentVersion()
    : await getLastVersion();

  if (latest === getCurrentVersion()) {
    console.log(
      `You’re using the latest version of lume: ${brightGreen(latest)}!`,
    );
    console.log();
    return;
  }

  console.log(
    `New version available. Updating lume to ${brightGreen(latest)}...`,
  );

  await install(latest, dev);

  console.log();
  console.log("Update successful!");
  console.log(
    `You’re using the latest version of lume: ${brightGreen(latest)}!`,
  );

  if (!dev) {
    console.log(
      "See the changes in",
      gray(`https://github.com/lumeland/lume/blob/${latest}/CHANGELOG.md`),
    );
  }
  console.log();
}

async function install(version: string, dev = false) {
  const url = dev
    ? `https://cdn.jsdelivr.net/gh/lumeland/lume@${version}`
    : `https://deno.land/x/lume@${version}`;

  const process = Deno.run({
    cmd: [
      Deno.execPath(),
      "run",
      "-A",
      `${url}/install.js`,
    ],
  });

  const status = await process.status();
  process.close();

  return status.success;
}
