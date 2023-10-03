import { Collection } from "discord.js";
import { readdirSync } from "fs";
import path from "path";
import { Command, Interaction } from "../../models";

export function fileToCollection<Type extends Command | Interaction>(dirPath:string):Collection<string, Type> {

    const collection:Collection<string, Type> = new Collection();
    try {
        const dirents = readdirSync(dirPath, { withFileTypes:true });

        dirents.filter(dirent => dirent.isDirectory()).forEach((dir) => {
            const directoryPath = path.join(dirPath, dir.name);
            readdirSync(directoryPath).filter((file) => file.endsWith('.js')).forEach((file) => {
                import(path.join(directoryPath, file)).then((resp: { default: Type }) => {
                    collection.set(((resp.default as Command).data != undefined) ? (resp.default as Command).data.name : (resp.default as Interaction).name, resp.default);
                });
            });
        });

        dirents.filter(dirent => !dirent.isDirectory() && dirent.name.endsWith('.js')).forEach((file) => {
            import(path.join(dirPath, file.name)).then((resp: { default: Type }) => {
                collection.set(((resp.default as Command).data != undefined) ? (resp.default as Command).data.name : (resp.default as Interaction).name, resp.default);
            });
        });
    }
    catch (error) {
        throw error;
    }
    return collection;
}