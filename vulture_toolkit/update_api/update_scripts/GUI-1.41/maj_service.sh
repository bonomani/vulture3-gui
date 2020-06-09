#!/bin/sh

/bin/echo "#!/bin/sh
# PROVIDE: vulture
# KEYWORD: shutdown
# REQUIRE: mongod
#This file is part of Vulture 3.
#
#Vulture 3 is free software: you can redistribute it and/or modify
#it under the terms of the GNU General Public License as published by
#the Free Software Foundation, either version 3 of the License, or
#(at your option) any later version.

#Vulture 3 is distributed in the hope that it will be useful,
#but WITHOUT ANY WARRANTY; without even the implied warranty of
#MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#GNU General Public License for more details.

#You should have received a copy of the GNU General Public License
#along with Vulture 3.  If not, see http://www.gnu.org/licenses/.

########################## WARNING ###############################
# Don't edit this file, it is automatically generated by Vulture #
########################## WARNING ###############################

. /etc/rc.subr

name='vulture'
rcvar=\${name}_enable
vulture_enable=\${vulture_enable-'YES'}

command='/usr/sbin/\${name}'
start_cmd='vulture_start'
stop_cmd='vulture_stop'
reload_cmd='vulture_reload'
extra_commands='reload'

load_rc_config \$name

vulture_start()
{
    if checkyesno \${rcvar}; then
    {
        if [ ! -f /var/bootstrap/.first_start ]; then
        {
            echo 'Starting Vulture Services'
            /home/vlt-sys/Engine/bin/httpd -f /home/vlt-sys/Engine/conf/gui-httpd.conf -k start 2> /dev/null
            /home/vlt-sys/Engine/bin/httpd -f /home/vlt-sys/Engine/conf/portal-httpd.conf -k start 2> /dev/null
            /home/vlt-sys/scripts/vulture_apps_starter start 2> /dev/null
        }
        fi
    }
    fi
}
vulture_stop()
{
    if checkyesno \${rcvar}; then
    {
	    echo 'Stopping Vulture Services'
 	    /home/vlt-sys/scripts/vulture_apps_starter stop 2> /dev/null
	    /home/vlt-sys/Engine/bin/httpd -f /home/vlt-sys/Engine/conf/gui-httpd.conf -k stop 2> /dev/null
	    /home/vlt-sys/Engine/bin/httpd -f /home/vlt-sys/Engine/conf/portal-httpd.conf -k stop 2> /dev/null
	    sleep 2
    }
    fi
}
vulture_reload()
{
    if checkyesno \${rcvar}; then
    {
        echo 'Reloading Vulture Services'
        /home/vlt-sys/scripts/vulture_apps_starter reload 2> /dev/null
        /home/vlt-sys/Engine/bin/httpd -f /home/vlt-sys/Engine/conf/gui-httpd.conf -k graceful 2> /dev/null
        /home/vlt-sys/Engine/bin/httpd -f /home/vlt-sys/Engine/conf/portal-httpd.conf -k graceful 2> /dev/null
    }
    fi
}


run_rc_command \"\$1\"" > /usr/local/etc/rc.d/vulture
/bin/chmod 555 /usr/local/etc/rc.d/vulture
/bin/chmod -R 775 /home/vlt-sys/Engine/conf/certs