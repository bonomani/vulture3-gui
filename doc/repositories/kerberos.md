---
title: "Kerberos repository"
currentMenu: kerberos
parentMenu: repositories
---


## Overview

A Kerberos repository is used to authenticate and identify users in a domain. It is thus possible to manage access to the services of a domain via tickets delivered by the KDC ( Kerberos Domain Controller) to the users of this domain after authentication.

## About Kerberos

The Kerberos authentication protocol is responsible for authenticating, authorizing and monitoring users who want to access resources and network services.
Kerberos also introduces the Single Sign-On (SSO) principle, and with single-user authentication the user will have access to network services requiring Kerberos identification.

## Requirements

In order to properly configure a Kerberos authentication repository, it is first necessary to have:

* A Kerberos server,
* A Kerberos "service", allowing to contact the KDC (Kerberos Domain Controler) to verify the validity of the tickets provided to Vulture,
* The "keytab" of this service, allowing to authenticate this one with the KDC without having to type a password.

WARNING: The service used by Vulture to contact the KDC should be of the following form:
`HTTP/<machine_name>.<domain>@<REALM>`. For example, for the Vulture machine with hostname "vulture.testing.tr", belonging to the "TESTING.TR" realm, the service to be created in the KDC should be:
```
HTTP/vulture.testing.tr@TESTING.TR
```

In addition, to test the validity of the keytab, it is recommended to use the following command:
`kinit -k -t <keytab> <service>` from another machine in the realm on which the configuration is correct.

## Adding a kerberos repository

To add a Kerberos repository, go to the "Repository" section, then "Kerberos". Once on the page, click on "Add an entry".

## Configuration of the repository

- `Repository name`: The name for the repository. This name will be used elsewhere in GUI interfaces.
- `Kerberos realm`: Kerberos realm of users to authenticate / identify.
- `Kerberos domain realm`: Domain of the kingdom Kerberos.
- `KDCs`: List of Kerberos Domain Controler (s) for this domain.
- `Admin server`: The host on which the kerberos authentication service (AS) is launched.
- `KRB5 service name`: Service used by Vulture to contact the KDC and check the tickets.
- `Service keytab`: Keytab associated with this service.

Note :
1. Unlike other repositories, it is possible to save it without testing the connection. Indeed, the Kerberos configuration is generated during the saving, so if you still want to test the connection, it will have to be saved, then re-edited and tested.
2. In addition, during saving, the keytab is tested against the entered configuration; It is not possible to import an invalid keytab.


## Troubleshooting Connections

In case that connection problems occur, several elements should be checked:

* The logs, especially the files present in `/var/log/Vulture/gui/`, are the first thing to check when registering the repository.
* Since the `/etc/krb5.conf` file is automatically generated by the GUI, it seems relevant to check its contents.
* The keytab, normally imported into the `/etc/krb5.keytab` file, should be checked using the following command:
`kinit -k -t /etc/krb5.keytab HTTP/<service>@<REALM>` replacing with the service entered in the GUI.

If these three steps are correct, it is quite possible that the problem arises from the configuration of the KDC, or the service in the KDC, or even the keytab in the KDC.