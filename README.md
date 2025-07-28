## NpTemplate

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.1.

### Configuration

Configurations can be adjusted using the environment files under the `src` directory.

### Static Content

This project uses fake static content for demonstration purpose. Images are under CC or equivalent license. Please change these as per your requirements of your derivate work. Also update references to your dynamic content where needed.

### Backend

This project has a corresponding backend application, published at: https://github.com/samagrata/np-backend


### Project build

Run the following command from project directory to build:

```bash
ng build --configuration development
```

With Docker:

```bash
docker run --rm -v "$(pwd):/app/np-template" -w /app/np-template trion/ng-cli ng build --configuration development
```

### Development server

To start a local development server, run:

```bash
ng serve --configuration development --poll 2000
```

Or if using Docker, from project directory run:

```bash
docker run --rm -v "$(pwd):/app/np-template" -w /app/np-template -p 4200:4200 trion/ng-cli ng serve --configuration development --poll 2000 --host 0.0.0.0
```

Once the server is running, open your browser and navigate to `http://localhost:4200`. The application will automatically reload whenever you modify any of the source files.

### Admin Dashboard

This can be accessed by navigating to `http://localhost:4200/admin/dashboard`. You can create admin account using the API provided by the backend application.

### Contributions

See the `CONTRIBUTING.md` file for details.

### License & Notice

Please see the `LICENCE.txt` file for license and copyright details.

Please see the `NOTICE.md` file for additional notice, part of the License requirement.
