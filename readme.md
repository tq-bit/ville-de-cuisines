<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/tq-bit/ville-de-cuisines">
    Logo
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

Ville de Cuisines is my submission to the [dev.to Appwrite Hackathon](https://dev.to/devteam/announcing-the-appwrite-hackathon-on-dev-1oc0). I built it for my girlfriend and myself to make diet planning fun. I also added a few social components to make it more engaging.

Unfortunatly, I was not able to implement all the features during the time of the hackathon. I still hope you'll find it entertaining 🤠

[![ville-de-cuisines landingpage][product-screenshot]](#)

[![ville-de-cuisines audio recording][example-screenshot-I]](#)
<div align="center"> Caption </div>

### Current features
- User signup and profile maintenance
- Avatar and image upload
- Public ingredient- and recipe-category creation
- Global search for several content types
- Private and public recipe creation
- User following
- Recipe suggestions*
- Recipe refinement*
- Ingredient and energy calculation*

### Planned features
- Improve recipe creation (e.g. add ingredients on the fly)
- Search recipes based on several ingredients
- Enhance recipe suggestions and search, e.g. by tag
- Enhance ingredient data structure, e.g. nutrients, brand and retailer
- Add a personal diet calender*
- Add user actions and a user feed
- SSR, Vue meta and social sharing (Facebook, Instagram, Pinterest)
- Plugin to add recipe ingredients to your grocery list
- Use edge functions to suggest ingredients from a 3rd party API (still looking for one)
- Use edge functions to cleanup unnecessary images
- Proper loading indicators (after finishing the app & the service refactoring)

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
## Usage

### Signup

### Maintain your user preferences

### Create your first public ingredient

### Create a recipe category

### Create a recipe and share it

### Share your recipe on social media

### Follow another user

### Refine a recipe and make it your own

### Calculate needed ingredients for your visitors

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->
## License

Apache License, Version 2.0 See `LICENSE` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Please tell me how you liked the submission. You can reach me on Twitter or on [dev.to](https://dev.to/tqbit)

If you've got any suggestions on new features, please

Mail: [tobi@q-bit.me](mailto:tobi@q-bit.me) - Twitter: [@qbitme](https://twitter.com/qbitme)

Project Link: [https://github.com/tq-bit/ville-de-cuisines](https://github.com/tq-bit/ville-de-cuisines)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

While developing, I fell in love with AppWrite's simplicity. If you're reading this: You guys did a fantastic job taking away the headache of API and DB maintenance.

* [Vincent](https://dev.to/gewenyu99) - thank you for helping me to underand how to use indexes properly.
* [Othneildrew's Best-README-Template](https://github.com/othneildrew/Best-README-Template) which was used to write this template
* [Heroicons](https://heroicons.com/) which are used throughout the application
* [Grocery icons created by ultimatearm - Flaticon](https://www.flaticon.com/free-icons/grocery)
* [Food icons created by justicon - Flaticon](https://www.flaticon.com/free-icons/food)
* [Social media logos (Facebook, Instagram, Pinterest) from Simpleicons](https://simpleicons.org/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/tq-bit/ville-de-cuisines.svg??style=plastic&logo=appveyor
[contributors-url]: https://github.com/tq-bit/ville-de-cuisines/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/tq-bit/ville-de-cuisines.svg??style=plastic&logo=appveyor
[forks-url]: https://github.com/tq-bit/ville-de-cuisines/network/members
[stars-shield]: https://img.shields.io/github/stars/tq-bit/ville-de-cuisines.svg??style=plastic&logo=appveyor
[stars-url]: https://github.com/tq-bit/ville-de-cuisines/stargazers
[issues-shield]: https://img.shields.io/github/issues/tq-bit/ville-de-cuisines.svg??style=plastic&logo=appveyor
[issues-url]: https://github.com/tq-bit/ville-de-cuisines/issues
[license-shield]: https://img.shields.io/github/license/tq-bit/ville-de-cuisines.svg??style=plastic&logo=appveyor
[license-url]: https://github.com/tq-bit/ville-de-cuisines/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg??style=social&logo=appveyor&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/tobias-quante-764aa1140/
[product-logo]: assets/logo.gif
[product-screenshot]: assets/ville-de-cuisines_landingpage.png
[example-screenshot-I]: assets/ville-de-cuisines_chat_I.png
[example-screenshot-II]: assets/ville-de-cuisines_chat_II.png
[onboarding-screenshot-I]: assets/ville-de-cuisines_signup.gif
[onboarding-screenshot-II]: assets/ville-de-cuisines_transcribe.gif
