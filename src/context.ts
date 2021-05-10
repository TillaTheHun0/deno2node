import { path, Project, ts, z } from "./deps.deno.ts";

const Config = z.strictObject({
  shim: z.string().optional(),
});

export class Context {
  readonly project: Project;
  readonly config;

  /**
   * Synchronously loads `tsconfig.json` and `"files"`.
   */
  constructor(private readonly tsConfigFilePath: string) {
    this.project = new Project({
      tsConfigFilePath,
      compilerOptions: {
        strict: true,
      },
    });
    const fs = this.project.getFileSystem();
    const result = ts.readConfigFile(tsConfigFilePath, fs.readFileSync);
    this.config = Config.parse(result.config.deno2node ?? {});
  }

  resolve(path_: string) {
    return path.join(this.tsConfigFilePath, "..", path_);
  }
}
