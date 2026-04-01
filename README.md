# WireGuard Easy — IP TLS Fork

> **This is a fork of [wg-easy](https://github.com/wg-easy/wg-easy) with built-in TLS support for IP addresses.**
> It uses [lego](https://github.com/go-acme/lego) (Let's Encrypt ACME client) or pre-provisioned certificates
> to serve the Web UI over HTTPS without an external reverse proxy.

## TLS Setup

### How it works

HTTPS termination is handled by an internal `tls-proxy.js` node process. It reads your certificates,
forwards decrypted traffic to the Nitro app server on a local port, and hot-reloads certs on renewal
without restarting the container.

```
Client ──HTTPS──> tls-proxy.js :51821 ──HTTP──> Nitro :51822
```

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `LEGO_ENABLED` | `false` | Enable TLS mode. Set `true` to activate cert handling. |
| `INSECURE` | `false` | Set `true` to disable TLS and run plain HTTP on `PORT`. |
| `PORT` | `51821` | External port (HTTPS when TLS enabled). |
| `NITRO_PORT` | `51822` | Internal HTTP port for Nitro (not exposed). |
| `LEGO_EMAIL` | — | Let's Encrypt account email. Required for AUTO mode. |
| `LEGO_IP` | — | IPv4 address to obtain the certificate for. Required for AUTO mode. |
| `LEGO_CHALLENGE` | `http` | ACME challenge type: `http` (port 80) or `tls-alpn` (port 443). |
| `LEGO_DATA_DIR` | `/root/lego-data` | Directory where lego stores its state. |
| `LEGO_RENEW_INTERVAL` | `432000` | Renewal check interval in seconds (default: 5 days). |

### MANUAL mode (pre-provisioned certificates)

If you already have certificates from another tool (e.g. x-ui, certbot, acme.sh),
mount them into the container and set `LEGO_ENABLED=true`:

```yaml
environment:
  - LEGO_ENABLED=true
  - INSECURE=false
volumes:
  - /path/to/your/certs:/root/cert/ip:ro
```

The container expects:
- `/root/cert/ip/fullchain.pem` — certificate chain
- `/root/cert/ip/privkey.pem` — private key (`chmod 600` on the host)

Certificates are hot-reloaded on file change (polling interval: 60s), so restarting
the container after renewal is sufficient but not strictly required.

### AUTO mode (Let's Encrypt via lego)

> **Note:** IP address certificates from Let's Encrypt are issued by [ZeroSSL](https://zerossl.com/)
> since Let's Encrypt does not support IP SANs. Lego handles this transparently.

```yaml
environment:
  - LEGO_ENABLED=true
  - INSECURE=false
  - LEGO_EMAIL=your@email.com
  - LEGO_IP=1.2.3.4
  - LEGO_CHALLENGE=http   # requires port 80 to be open
ports:
  - "80:80"               # needed only for http-01 challenge
  - "51821:51821/tcp"
```

---

# WireGuard Easy

[![Build & Publish latest Image](https://github.com/wg-easy/wg-easy/actions/workflows/deploy.yml/badge.svg?branch=production)](https://github.com/wg-easy/wg-easy/actions/workflows/deploy.yml)
[![Lint](https://github.com/wg-easy/wg-easy/actions/workflows/lint.yml/badge.svg?branch=master)](https://github.com/wg-easy/wg-easy/actions/workflows/lint.yml)
[![GitHub Stars](https://img.shields.io/github/stars/wg-easy/wg-easy)](https://github.com/wg-easy/wg-easy/stargazers)
[![License](https://img.shields.io/github/license/wg-easy/wg-easy)](LICENSE)
[![GitHub Release](https://img.shields.io/github/v/release/wg-easy/wg-easy)](https://github.com/wg-easy/wg-easy/releases/latest)
[![Image Pulls](https://img.shields.io/badge/image_pulls-12M+-blue)](https://github.com/wg-easy/wg-easy/pkgs/container/wg-easy)

You have found the easiest way to install & manage WireGuard on any Linux host!

<!-- TOOD: update screenshot -->

<p align="center">
  <img src="./assets/screenshot.png" width="802" alt="wg-easy Screenshot" />
</p>

## Features

- All-in-one: WireGuard + Web UI.
- Easy installation, simple to use.
- List, create, edit, delete, enable & disable clients.
- Show a client's QR code.
- Download a client's configuration file.
- Statistics for which clients are connected.
- Tx/Rx charts for each connected client.
- Gravatar support.
- Automatic Light / Dark Mode
- Multilanguage Support
- One Time Links
- Client Expiration
- Prometheus metrics support
- IPv6 support
- CIDR support
- 2FA support
- Per-client firewall filtering (requires iptables)

> [!NOTE]
> To better manage documentation for this project, it has its own site here: [https://wg-easy.github.io/wg-easy/latest](https://wg-easy.github.io/wg-easy/latest)

- [Getting Started](https://wg-easy.github.io/wg-easy/latest/getting-started/)
- [Basic Installation](https://wg-easy.github.io/wg-easy/latest/examples/tutorials/basic-installation/)
- [Caddy](https://wg-easy.github.io/wg-easy/latest/examples/tutorials/caddy/)
- [Traefik](https://wg-easy.github.io/wg-easy/latest/examples/tutorials/traefik/)
- [Podman](https://wg-easy.github.io/wg-easy/latest/examples/tutorials/podman-nft/)
- [AdGuard Home](https://wg-easy.github.io/wg-easy/latest/examples/tutorials/adguard/)

> [!NOTE]
> If you want to migrate from the old version to the new version, you can find the migration guide here: [Migration Guide](https://wg-easy.github.io/wg-easy/latest/advanced/migrate/)

## Installation

This is a quick start guide to get you up and running with WireGuard Easy.

For a more detailed installation guide, please refer to the [Getting Started](https://wg-easy.github.io/wg-easy/latest/getting-started/) page.

### 1. Install Docker

If you haven't installed Docker yet, install it by running as root:

```shell
curl -sSL https://get.docker.com | sh
exit
```

And log in again.

### 2. Run WireGuard Easy

The easiest way to run WireGuard Easy is with Docker Compose.

Just follow [these steps](https://wg-easy.github.io/wg-easy/latest/examples/tutorials/basic-installation/) in the detailed documentation.

You can also install WireGuard Easy with the [docker run command](https://wg-easy.github.io/wg-easy/latest/examples/tutorials/docker-run/) or via [podman](https://wg-easy.github.io/wg-easy/latest/examples/tutorials/podman-nft/).

Now [setup a reverse proxy](https://wg-easy.github.io/wg-easy/latest/examples/tutorials/basic-installation/#setup-reverse-proxy) to be able to access the Web UI securely from the internet. This step is optional, just make sure to follow the guide [here](https://wg-easy.github.io/wg-easy/latest/examples/tutorials/reverse-proxyless/) if you decide not to do it.

## Donate

Are you enjoying this project? Consider donating.

Founder: [Buy Emile a beer!](https://github.com/sponsors/WeeJeWel) 🍻

Maintainer: [Buy kaaax0815 a coffee!](https://github.com/sponsors/kaaax0815) ☕

## Development

### Prerequisites

- Docker
- Node LTS & corepack enabled
- Visual Studio Code

### Dev Server

This starts the development server with docker

```shell
pnpm dev
```

### Update Auto Imports

If you add something that should be auto-importable and VSCode complains, run:

```shell
cd src
pnpm install
cd ..
```

### Test Cli

This starts the cli with docker

```shell
pnpm cli:dev
```

## License

This project is licensed under the AGPL-3.0-only License - see the [LICENSE](LICENSE) file for details

This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with Jason A. Donenfeld, ZX2C4 or Edge Security

"WireGuard" and the "WireGuard" logo are registered trademarks of Jason A. Donenfeld
