# Toy project for [KNP Labs](http://knplabs.com) Hackathon #3 - a "JS Widgets with Browserify" demo

## Install

Node.js v5+ is needed to run this demo. You can install it from the [official site](https://nodejs.org) or with [nvm](https://github.com/creationix/nvm).

```bash
$ npm install # install build & server dependencies
$ npm run setup # install front-end dependencies and build front-end assets
$ npm run server:dev # live demo server on localhost:8080
```

## What's in?

#### The pattern

The pattern is simple : a [widgets-initializer-from-dom](https://github.com/DrBenton/js-widgets-with-browserify-demo/blob/master/front-end-assets/js/lib/demo-app/core/widgets-initializer-from-dom.js) module is responsible for looking for HTML elements with the "data-widget-module-id" attribute.  
For each of these elements, it requires the given module by its id, and creates a new instance of the module, passing the DOM node as only argument.  
From then, each instance can live its own life, adding specific behaviour to the target HTML element. That's all!

#### Browserify

[Browserify](http://browserify.org/) is also used. Its role is to analyze CommonJS JavaScript modules from an "entry point", parse its dependencies recursively, and bundle of it in a single file.  
It can be also handy for its system of "transforms" ![Transformer](http://www.icon100.com/up/3572/16/33-transformer.png) - which are kind of preprocessors, that can do a lot of things. You can look at [this list](https://github.com/substack/node-browserify/wiki/list-of-transforms) for more information about them.

#### Demo content

In this demo I have used JavaScript classes for clarity, but of course it can be used with basic JS functions (EcmaScript 2015 specific features, like classes, are converted to legacy JavaScript at build time by the "[babelify](https://github.com/babel/babelify)" Browserify transform in this demo).  
The anatomy of a widget is very simple, you can look at this minimalistic test widget to see it.

I have included a few test widgets on the demo ; they all add a ugly border around their node for demo purpose. There is
 * a [tooltip](https://github.com/DrBenton/js-widgets-with-browserify-demo/blob/master/front-end-assets/js/lib/demo-app/widgets/tooltip.js) widget (which can adapt its behaviour by reading specific "data-" attributes on its node)
 * a [lorem picture](https://github.com/DrBenton/js-widgets-with-browserify-demo/blob/master/front-end-assets/js/lib/demo-app/widgets/lorem-picture.js) widget, as an example of a very simple widget
 * a [date picker](https://github.com/DrBenton/js-widgets-with-browserify-demo/blob/master/front-end-assets/js/lib/demo-app/widgets/date-picker.js) widget ; this is one is here to demonstrate that a widget can easily embed CSS resources, thanks to Browserify's "[brfs](https://github.com/substack/brfs)" transformer. It parses JS modules at build time, and replaces occurences of `fs.readFileSync` (which is Node's equivalent of PHP's `file_get_content()`) with the content of the target file.
 * a [Ajax form](https://github.com/DrBenton/js-widgets-with-browserify-demo/blob/master/front-end-assets/js/lib/demo-app/widgets/ajax-form.js) widget : this is the only one of this demo that can be useful in real world :-) It simply prevents form submit, and replaces it with an Ajax call.
  [The data returned by the server](https://github.com/KnpLabs/hackathon3---js-widgets-with-browserify/blob/master/lib/templates/form-response.html.twig) is added to a temporary container, which allows the server to decide which behaviour it will add on the HTML page - following a pattern I like a lot : "[Server-generated JavaScript Responses](https://signalvnoise.com/posts/3697-server-generated-javascript-responses)", described here by DHH, creator of Ruby on Rails.

You can build large real-world projects powered only by widgets and server-side JS responses. No framework! :-)

#### Specific case: widgets are not direct dependencies

The only tricky part is that Browserify resolve dependencies dynamically from a start module. But because the widgets modules are not required anywhere, Browserify don't include them in the bundled Javascript file.  
My solution is to do a hacky-but-efficient-even-on-a-real-project parsing of the project templates files. We look for "data-widget-module-id" occurences, and add each of these modules in the bundle. This is managed [here](https://github.com/DrBenton/js-widgets-with-browserify-demo/blob/master/lib/tool/browserify-with-widgets.js#L129-L176).

#### NPM as a task runner

I tried to keep this demo project minimalistic, and I did not use any Grunt or gulp build tool - everything is simply done by NPM scripts, described in [the root package.json](https://github.com/DrBenton/js-widgets-with-browserify-demo/blob/master/package.json#L8-L19) file.
Tasks like LESS compilation (with a "watch" option), Browserify JavaScript modules bundle (also with a "watch" option), HTTP test server and stuff are handled in the "scripts" section of the package.json file. 

[The other package.json](https://github.com/DrBenton/js-widgets-with-browserify-demo/blob/master/front-end-assets/js/package.json) file, in "front-end-assets/js", is only here to handle front-end dependencies - jQuery, Foundation, and misc libraries are downloaded from NPM.

#### Return of experience

You may like this pattern or not, but I thought it could be interesting to share it. I have been using it for a few years on multiple projects - with Require.js first, and now with Browserify.  
Its main advantages are that it's very simple, does not any heavy framework learning, and it "scales" : I have worked with dozens of JS modules on some projects, they are all independent, and it works well. If we need to send or receive information between events, we can send domain events on the HTML document (which is used as a central message bus).
