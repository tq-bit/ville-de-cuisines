<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/tq-bit/ville-de-cuisines">
    <img src="https://github.com/tq-bit/ville-de-cuisines/blob/master/public/github-assets/logo-dark.png?raw=true">
  </a>

  <h1 align="center">Ville de Cuisines</h1>

  <p align="center">
    🌟 Discover and share culinary masterpieces
  </p>
  <div align="center">
    <img alt="GitHub" src="https://img.shields.io/github/license/tq-bit/ville-de-cuisines?style=plastic&logo=MIT"/>
    <a href="https://ville-de-cuisines.netlify.app/">
      <img alt="Netlify" src="https://img.shields.io/netlify/57fab78d-d46d-4c9b-b71a-2e1d17a375b4?style=plastic&logo=netlify">
    </a>
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/tq-bit/ville-de-cuisines?style=plastic&logo=git"/>
  </div>
</div>

## About The Project

Ville de Cuisines translates to 'City of Kitchens' from french. It is my submission to the [dev.to Appwrite Hackathon](https://dev.to/devteam/announcing-the-appwrite-hackathon-on-dev-1oc0). I built it for my girlfriend and myself to make diet planning (more) fun. I also added a few social components to make it more engaging.

Sadly, I was not able to implement all the features during the time of the hackathon. I still hope you'll find it entertaining 🤠

[![ville-de-cuisines landingpage][product-screenshot]](#)

### Current features

<details>
<summary> Toggle current features </summary>

<li>User signup and profile maintenance</li>
<li>Avatar and image upload</li>
<li>Public ingredient- and recipe-category creation</li>
<li>Global search for several content types, like recipes, ingredients and users</li>
<li>Private and public recipe creation</li>
<li>Markdown support for recipe preparation steps</li>
<li>User following</li>
<li>Recipe suggestions</li>
<li>Recipe refinement (that's like forking a recipe)</li>
<li>Ingredient and energy calculation per recipe</li>
</details>


### Planned features

<details>
<summary> Toggle planned features </summary>

<li>Add a public / personal diet calender</li>
<li>Add proper loading indicators</li>
<li>Improve recipe creation (browsing and adding ingredients on the fly)</li>
<li>Enhance recipe suggestions and search, e.g. by tag or several ingredients</li>
<li>Enhance ingredient data structure, e.g. nutrients, brand and retailer</li>
<li>Add user actions and a user feed</li>
<li>SSR, Vue meta and social sharing (Facebook, Instagram, Pinterest)</li>
<li>Plugin to add recipe ingredients to your grocery list</li>
<li>Use a cloud function to suggest ingredients from a 3rd party API (still looking for a good one)</li>
<li>Use a cloud function to cleanup unnecessary images</li>
</details>

### Built With

* [Vue 3](https://vuejs.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [AppWrite](https://appwrite.io/)
* [Github](https://github.com/)
* [Netlify](https://www.netlify.com/)
## Get started

### Quickstart

1. This app is built on top of a running Appwrite instance. Head over to the official website to quickly get your instance up and running.
2. Then install the [appwrite-cli](https://appwrite.io/docs/command-line) and deploy the `appwrite.json` - configuration.
3. You can now start the frontend application using `npm run dev`. It will open on `localhost:3000`.

### Demo

There's a demo version of Ville de Cuisines hosted on Netlify. You're very much invited to check it out and fiddle around a bit. If you find a bug, [please do open an issue](https://github.com/tq-bit/ville-de-cuisines/issues)

Since AppWrite's backend is hosted on a rather small VM, this demo comes with a few constraints:

- Max. upload size is 1mb
- Image loading can take a while
- The frontend service layer is not yet optimized and has no caching.
- Please be mindful when making http requests.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage examples

I tried to design the app in an intuitive way. Naturally, there's always something that simply isn't. So in the following, you can find a few basic, first steps to get started.

### Signup

[![update-your-user-preferences][gif-signup]](#)

### Maintain your user preferences

[![update-your-user-preferences][gif-update-preferences]](#)

### Refine a recipe and make it your own
[![update-your-user-preferences][gif-refine-recipe]](#)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->
## License

Licensed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Please tell me how you liked the submission. You can reach me on Twitter or on [dev.to](https://dev.to/tqbit)

If you've got any suggestions on new features, please do open a new issue.

Mail: [tobi@q-bit.me](mailto:tobi@q-bit.me) - Twitter: [@qbitme](https://twitter.com/qbitme)

Project Link: [https://github.com/tq-bit/ville-de-cuisines](https://github.com/tq-bit/ville-de-cuisines)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

While developing, I fell in love with AppWrite's simplicity. If you're reading this: You guys did a fantastic job taking away the headache of API and DB maintenance.

* [Tsvetomira Dichevska](https://www.linkedin.com/in/tsvetomira-dichevska/) thank you for creating my Logo and help me figure out this idea
* [Vincent](https://dev.to/gewenyu99) - thank you for helping me to underand how to use indexes properly.
* [Othneildrew's Best-README-Template](https://github.com/othneildrew/Best-README-Template) which was used to write this template
* [Heroicons](https://heroicons.com/) which are used throughout the application
* [Grocery icons created by ultimatearm - Flaticon](https://www.flaticon.com/free-icons/grocery)
* [Food icons created by justicon - Flaticon](https://www.flaticon.com/free-icons/food)
* [Social media logos (Facebook, Instagram, Pinterest) from Simpleicons](https://simpleicons.org/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[product-screenshot]: public/github-assets/twilight-vdc.png
[gif-update-preferences]: public/github-assets/update-preferences.gif
[gif-signup]: public/github-assets/signup.gif
[gif-refine-recipe]: public/github-assets/refine-recipe.gif
