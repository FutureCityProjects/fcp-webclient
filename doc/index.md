# FCP-Client documentation

### Development
This project is configured to work in VSCode by using the launch configuration in `/.vscode/launch.json` and by using a local docker container setup via `/.devcontainer/`

* [Dependecies](dependencies.md)
* [Redux usage](redux.md)

### Deployment
* clone this repository
* build a docker container using the `/Dockerfile` and providing the required build
  arguments (either via [commandline](https://docs.docker.com/engine/reference/commandline/build/#set-build-time-variables---build-arg) or [docker-compose config](https://docs.docker.com/compose/compose-file/#args))

