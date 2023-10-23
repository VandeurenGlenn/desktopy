// import { createServer, Server } from 'http'
import url from 'url'
import { createReadStream } from 'fs'
import path from 'path'
import zlib from 'zlib'
import { pipeline } from 'stream'
import { access, constants, readdir } from 'fs/promises'
import {  createServer } from 'http'



export default class DesktopyServer {
  port: number
  root: string
  hostDefaults: string[]

  constructor(options: launchOptions) {
    this.port = options.hostPort
    this.root = options.hostRoot
    this.hostDefaults = options.hostDefaults

console.log('go');

    this.server = createServer(options, async (request, response) => {
      // console.log(`${request.method} ${request.url}`);
    if (request.url.endsWith('/')) request.url = '/index.html'
      // parse URL
      const parsedUrl = url.parse(request.url);
      // extract URL path
      let pathname = `./${path.join(this.root, parsedUrl.pathname)}`;
      // based on the URL path, extract the file extension. e.g. .js, .doc, ...
      const ext = path.parse(pathname).ext;
      // maps file extension to MIME typere
      const map = {
        '.ico': 'image/x-icon',
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.wav': 'audio/wav',
        '.mp3': 'audio/mpeg',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword'
      };
    
      try {
        await access(pathname, constants.F_OK)
        // read file from file system
        const raw = createReadStream(pathname);
        // Store both a compressed and an uncompressed version of the resource.
        response.setHeader('Vary', 'Accept-Encoding');
        response.setHeader('Content-type', map[ext] || 'text/plain' );
        response.setHeader('Cache-Control', 'max-age=36000')
        let acceptEncoding = request.headers['accept-encoding'] as string;
        if (!acceptEncoding) {
          acceptEncoding = '';
        }
    
        const onError = (err) => {
          if (err) {
            // If an error occurs, there's not much we can do because
            // the server has already sent the 200 response code and
            // some amount of data has already been sent to the client.
            // The best we can do is terminate the response immediately
            // and log the error.
            response.end();
            console.error('An error occurred:', err);
          }
        };
    
        // Note: This is not a conformant accept-encoding parser.
        // See https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
        if (/\bdeflate\b/.test(acceptEncoding)) {
          response.writeHead(200, { 'Content-Encoding': 'deflate' });
          pipeline(raw, zlib.createDeflate(), response, onError);
        } else if (/\bgzip\b/.test(acceptEncoding)) {
          response.writeHead(200, { 'Content-Encoding': 'gzip' });
          pipeline(raw, zlib.createGzip(), response, onError);
        } else if (/\bbr\b/.test(acceptEncoding)) {
          response.writeHead(200, { 'Content-Encoding': 'br' });
          pipeline(raw, zlib.createBrotliCompress(), response, onError);
        } else {
          response.writeHead(200, {});
          pipeline(raw, response, onError);
        }
      } catch (error) {
        response.statusCode = 404
        response.end(`404: ${pathname} not found`)
      }
    }).listen(parseInt(String(this.port)));
    
    console.log(`Server listening on port ${String(this.port)}`);
  }
  
  
}

