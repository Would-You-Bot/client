import { readdirSync } from "node:fs";
import path from "node:path";
import { Collection } from "discord.js";
import type { Command, Event, Interaction } from "../../interfaces";

export async function fileToCollection<
  Type extends Command | Interaction | Event,
>(dirPath: string): Promise<Collection<string, Type>> {
  const collection: Collection<string, Type> = new Collection();
  const dirents = readdirSync(dirPath, { withFileTypes: true });
  const promises: Promise<void>[] = [];

  const directories = dirents.filter((dirent) => dirent.isDirectory());
  for (const dir of directories) {
    const directoryPath = path.join(dirPath, dir.name);
    const files = readdirSync(directoryPath).filter((file) =>
      file.endsWith(".js"),
    );

    for (const file of files) {
      const importPromise = import(path.join(directoryPath, file)).then(
        (resp: { default: Type }) => {
          collection.set(
            (resp.default as Command).data !== undefined
              ? (resp.default as Command).data.name
              : (resp.default as Event).event
                ? (resp.default as Event).event
                : (resp.default as Interaction).name,
            resp.default,
          );
        },
      );
      promises.push(importPromise);
    }
  }

  const rootFiles = dirents.filter(
    (dirent) => !dirent.isDirectory() && dirent.name.endsWith(".js"),
  );
  for (const file of rootFiles) {
    const importPromise = import(path.join(dirPath, file.name)).then(
      (resp: { default: Type }) => {
        collection.set(
          (resp.default as Command).data !== undefined
            ? (resp.default as Command).data.name
            : (resp.default as Event).event
              ? (resp.default as Event).event
              : (resp.default as Interaction).name,
          resp.default,
        );
      },
    );
    promises.push(importPromise);
  }

  await Promise.all(promises);
  return collection;
}
