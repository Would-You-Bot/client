import { Collection } from "discord.js";
import { readdirSync } from "fs";
import path from "path";
import { Command, Event, Interaction } from "../../interfaces";

export async function fileToCollection<
  Type extends Command | Interaction | Event,
>(dirPath: string): Promise<Collection<string, Type>> {
  const collection: Collection<string, Type> = new Collection();
  try {
    const dirents = readdirSync(dirPath, { withFileTypes: true });
    var promises: Promise<void>[] = [];

    dirents
      .filter((dirent) => dirent.isDirectory())
      .forEach((dir) => {
        const directoryPath = path.join(dirPath, dir.name);
        readdirSync(directoryPath)
          .filter((file) => file.endsWith(".js"))
          .forEach((file) => {
            const importPromise = import(path.join(directoryPath, file)).then(
              (resp: { default: Type }) => {
                collection.set(
                  (resp.default as Command).data != undefined
                    ? (resp.default as Command).data.name
                    : Boolean((resp.default as Event).event)
                      ? (resp.default as Event).event
                      : (resp.default as Interaction).name,
                  resp.default,
                );
              },
            );
            promises.push(importPromise);
          });
      });

    dirents
      .filter((dirent) => !dirent.isDirectory() && dirent.name.endsWith(".js"))
      .forEach((file) => {
        const importPromise = import(path.join(dirPath, file.name)).then(
          (resp: { default: Type }) => {
            collection.set(
              (resp.default as Command).data != undefined
                ? (resp.default as Command).data.name
                : Boolean((resp.default as Event).event)
                  ? (resp.default as Event).event
                  : (resp.default as Interaction).name,
              resp.default,
            );
          },
        );
        promises.push(importPromise);
      });
    await Promise.all(promises);
  } catch (error) {
    throw error;
  }
  return collection;
}
