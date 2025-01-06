import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { Collection } from "discord.js";
import type { Command, Event, Interaction } from "../../interfaces";

export async function fileToCollection<
  Type extends Command | Interaction | Event,
>(dirPath: string): Promise<Collection<string, Type>> {
  const collection: Collection<string, Type> = new Collection();
  const promises: Promise<void>[] = [];

  function processDirectory(directory: string) {
    const dirents = readdirSync(directory, { withFileTypes: true });
    for (const dirent of dirents) {
      const fullPath = path.join(directory, dirent.name);
      if (dirent.isDirectory()) {
        processDirectory(fullPath);
      } else if (dirent.isFile() && dirent.name.endsWith(".js")) {
        const importPromise = import(fullPath).then((resp: { default: Type }) => {
          const key = getKey(resp.default);
          if (key) {
            collection.set(key, resp.default);
          } else {
            console.warn(`Could not determine key for file: ${fullPath}`);
          }
        }).catch(error => {
          console.error(`Error importing file ${fullPath}:`, error);
        });
        promises.push(importPromise);
      }
    }
  }

  //Helper function to extract the key
  function getKey(item: Type): string | undefined {
    if ((item as Command).data !== undefined) {
      return (item as Command).data.name;
    } else if ((item as Event).event) {
      return (item as Event).event;
    } else if ((item as Interaction).name) {
      return (item as Interaction).name;
    } else {
      return undefined;
    }
  }

  processDirectory(dirPath);
  await Promise.all(promises);
  return collection;
}
