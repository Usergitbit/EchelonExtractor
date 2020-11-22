# EchelonExtractor

This is a tool for the mobile game [Girls' Frontline](http://gf.sunborngame.com/) to extract your echelons from screenshots of your ID card into a single compact image. It is built using Angular 10 and OpenCVJS 4.4 (webassembly version running in a web worker). It is available online [here](https://usergitbit.github.io/EchelonExtractor/) and can also be installed as PWA. See [wiki](https://github.com/Usergitbit/EchelonExtractor/wiki/How-to-use) for usage.

## Building for development

`ng serve` and navigate to `http://localhost:4200/` like most Angular applications.

## Building for production

`ng build --prod`

## Known issues

The compiler currently strips the code from the worker file when building in production with AOT. The workaround is to build for production without AOT then copy the contents of the worker file over the content in the build with optimizations. The service worker hash will also have to be updated manually.   

## License
[MIT](https://choosealicense.com/licenses/mit/)