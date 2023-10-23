import { Certificate } from "crypto";

declare type launchOptions = {
  hostPort: number,
  hostRoot: string,
  hostDefaults: ['chrome', 'edge', 'safari'],
  autoStart: false | true,
  key: Certificate,
  cert: Certificate
  
}