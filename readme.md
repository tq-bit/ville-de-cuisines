<div id="top"></div>



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/tq-bit/ville-de-cuisines">
    Logo
  </a>

  <h1 align="center">Ville de Cuisines (VDC)</h1>

  <p align="center">
    Share and refine your culinary masterpieces.
  </p>
  <div align="center">
    <a href=""></a>
    <img alt="GitHub" src="https://img.shields.io/github/license/tq-bit/ville-de-cuisines?style=plastic&logo=apache"/>
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/tq-bit/ville-de-cuisines?style=plastic&logo=git"/>
  </div>
</div>


<!-- ABOUT THE PROJECT -->
## About The Project

Ville de Cuisines is my submission to the [dev.to Appwrite Hackathon](https://dev.to/devteam/announcing-the-appwrite-hackathon-on-dev-1oc0). I built it for my girlfriend and myself to make diet planning more fun. And I added a few social components to make it more fun.

> Unfortunatly, I was unable to implement all features I would have liked till the end of the hackathon. Everything that is yet to be added is listed under 'Planned features'

[![ville-de-cuisines landingpage][product-screenshot]](#)

[![ville-de-cuisines audio recording][example-screenshot-I]](#)
<div align="center"> Caption </div>

## Quickstart

Clone the repos and run the start script

```bash
git clone https://github.com/tq-bit/ville-de-cuisines
sudo bin/dev up
```

### Current features
- User signup and profile maintenance
- Public ingredient- and recipe-category creation
- Global search for several content types
- Private and public recipe creation
- User following
- Recipe suggestions*
- Recipe refinement*
- Ingredient and energy calculation*

### Planned features
- Search recipes based on several ingredients
- Enhance recipe suggestions and search, e.g. by tag
- Enhance ingredient data structure, e.g. nutrients, brand and retailer
- Add a personal diet calender*
- Add user actions and a user feed
- SSR, Vue meta and social sharing (Facebook, Instagram, Pinterest)
- Plugin to add recipe ingredients to your grocery list

### Built With

#### Frontend

* [Vue 3](https://vuejs.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Nginx](https://www.nginx.com/) (planned: Traefic integration)

#### Backend

* [AppWrite](https://appwrite.io/)

#### Development & deployment
* [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
* [Vite](https://vitejs.dev/) (development only)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

Ville de Cuisines is still under development. That means, unfortunatly, I cannot yet provide a deployable version. You can still run it in development mode.

### Prerequisites

At a bare minimum, you need to have a working version of Docker and docker-compose installed on your machine. Please follow the official docs to set these up:

* [Install Docker](https://docs.docker.com/engine/install/)
* [Install Docker Compose](https://docs.docker.com/compose/install/)

For development, you will also need a working version of node & npm.

* [Install Nodejs & NPM](https://nodejs.org/en/download/)
* Install with apt (Linux Ubuntu):
  ```sh
  $ sudo apt update
  $ sudo apt install nodejs
  $ node -v # output: vX.Y.Z
  ```

### Installation

Ville de Cuisines uses AppWrite as a backend. All its configuration can be found in the `appwrite.json` file.

The frontend is a simple Vue.js app using Vite as a development server. You can run it standalone or with its `.dockerfile`.

### Run the app

To start AppWrite and the frontend, simply run `sudo bin/dev up` in the project's root directory. You can access the app under `http://localhost:3000`.

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
