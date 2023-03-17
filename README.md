# EchelonExtractor

This is a tool for the mobile game [Girls' Frontline](http://gf.sunborngame.com/) to extract your echelons from screenshots of your ID card into a single compact image. It is built using Angular 12 and OpenCVJS 4.4 (webassembly version running in a web worker). It is available online [here](https://usergitbit.github.io/EchelonExtractor/) and can also be installed as PWA. See [wiki](https://github.com/Usergitbit/EchelonExtractor/wiki/How-to-use) for usage.

## Building for development

`ng serve` and navigate to `http://localhost:4200/` like most Angular applications.

## Building for production

`ng build --configuration production`

## Change Log
17 Mar 2023 - v1.5.1 Angular 14 -> Angular 15

24 Sep 2022 - v1.5.0 Angular 12 -> Angular 14

19 Aug 2022 - v1.4.2 Added date suffix to filename

16 July 2022 - v1.4.1 Added deployment pipelines

29 June 2021 - v1.4.0 Added Sangvis echelon support, Angular11 -> Angular12

10 December 2020 - v1.3.2 some layout changes

10 December 2020 - v1.3.1 added some spacing on smaller screens for touch scrolling, added a footer with the option to enable/disable reordering

09 December 2020 - v1.3.0 changed extracted echelons to be in list format and added drag and drop 

22 November 2020 - v1.2.0 Added multi-threading support

22 November 2020 - v1.1 Angular10 -> Angular11

02 September 2020 - v1.0 Initial release

## License
[MIT](https://choosealicense.com/licenses/mit/)
