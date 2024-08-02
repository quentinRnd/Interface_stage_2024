# CSP games

This project is a website that implement CSP games.

The website can be acessed localy on [http://localhost](http://localhost).

This repository is hosted on [Github](https://github.com/chrppi-developpers/csp_games).

## Technologies by dependance/usage

- Container engine (Podman)
	- C++ package manager (Conan)
		- C++ web framework (Drogon)
			- CSS framework (Bulma)
			- CSP compiler/solver (PyCSP3/ACE) in [Python](https://pycsp.org/)

## Requirements

Any machine running macOS or GNU/Linux should be supported, but we recommend using a `Debian` based operating system as we did.

The absolute path of the root folder should not contain spaces in order to allow compilation (excecution of `app/build.sh` and `app/run.sh`).

## Rootfull Podman deployment

Deploy the app on any server with Podman in rootfull mode.

Use this method when you can't modify network routing.

Else, use rootless Podman deployment.

### Set ports

```bash
cd app
sed --in-place --regexp-extended "s/(INTERNAL_PORT=).*/\18080/" .env
sed --in-place --regexp-extended "s/(EXTERNAL_PORT=).*/\180/" .env
```

### Install and configure Podman

```bash
sudo apt-get install podman --yes
sudo loginctl enable-linger $USER
```

### Build and copy the app

```bash
cd ../env
./build.sh
./root_copy.sh
```

### Execute the app as root

```bash
sudo ./run.sh
```

### Access the app

Got to [http://localhost](http://localhost).

### Terminate app execution

```bash
./kill.sh
```

## Rootless Podman deployment

Deploy the app on any server with Podman in rootless mode.

Rootfull deployment is needed when we can't modify network routing.

However, rootless deployement is more secure on most systems.

### Set internal port

Internal port is not important as long as its value is a registered or a dynamic ports (a number between 1024 and 65535):

```bash
sed --in-place --regexp-extended "s/(INTERNAL_PORT=).*/\18080/" app/.env 
```

### Set external port and port forwarding

To run the app in rootless mode you will need to select a registered or a dynamic ports.

You will assign this value (`$port`) to the variable `EXTERNAL_PORT` in `app/.env` file:

```bash
sed --in-place --regexp-extended "s/(EXTERNAL_PORT=).*/\1$port/" app/.env 
```

You will then map this port to port 80 with port forwarding:

```bash
sudo iptables -t nat -I OUTPUT -p tcp -d 127.0.0.1 --dport 80 -j REDIRECT --to-ports $port
sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports $port
```

### Install and configure Podman

```bash
sudo apt-get install podman --yes
sudo loginctl enable-linger $USER
```

### Build and run the app

Then build and run the app with the current user on the select port.

```bash
cd env
./build.sh
./run.sh
```

### Access to the app

Got to [http://localhost](http://localhost).

### Terminate app execution

```bash
./kill.sh
```